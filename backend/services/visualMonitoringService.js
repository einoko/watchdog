import { VisualMonitoringJob } from "../models/visualMonitoringJob.js";
import { calculateDifference, createDiffImage } from "../utils/compareUtil.js";
import { deleteAgendaJob } from "./agendaService.js";
import { Image } from "../models/image.js";
import { User } from "../models/user.js";
import { captureWebsiteToBuffer } from "./captureService.js";
import { saveImage } from "./imageService.js";
import { readFileFromPath } from "./fileService.js";
import { sendVisualAlertMail } from "./mailService.js";

const initializeFirstState = async (job) => {
  const screenshot = await captureWebsiteToBuffer(job.url);

  if (screenshot === null) {
    console.error(`Could not capture screenshot for ${job._id} ${job.url}`);
  } else {
    const savedImage = await saveImage(screenshot);

    job.states.push({
      image: savedImage._id,
      createdAt: new Date(),
    });

    await job.save();

    console.log(`Created initial state for ${job._id}`);
  }
};

const checkLastState = async (job) => {
  const lastState = job.states[job.states.length - 1];

  const lastStateImage = await Image.findById(lastState.image);

  if (!lastStateImage) {
    console.error(`Could not find the last image of job ${job._id}`);
    return;
  }

  const lastStateImageBuffer = await readFileFromPath(lastStateImage.path);
  const newScreenshotBuffer = await captureWebsiteToBuffer(job.url);

  if (newScreenshotBuffer === null) {
    console.error(`Could not capture screenshot for ${job._id} ${job.url}`);
    return;
  }

  const difference = await calculateDifference(
    lastStateImageBuffer,
    newScreenshotBuffer
  );

  if (difference > 0) {
    const savedNewScreenshot = await saveImage(newScreenshotBuffer);
    const savedDiffImage = await saveImage(
      await createDiffImage(lastStateImageBuffer, newScreenshotBuffer)
    );

    job.states.push({
      image: savedNewScreenshot._id,
      diff: savedDiffImage._id,
      createdAt: new Date(),
    });

    await job.save();

    const user = await User.findById(job.userId);

    sendVisualAlertMail(user, job, lastStateImage, savedNewScreenshot, savedDiffImage);
  }
};

/**
 * Executes one monitoring cycle.
 * @param {*} jobID ID of the monitoring job to execute.
 */
const executeVisualMonitoringJob = async (jobID) => {
  console.info(`Executing monitoring job ${jobID}`);

  const job = await VisualMonitoringJob.findById(jobID);

  if (!job) {
    console.error(`Monitoring job ${jobID} not found`);
    return;
  }

  if (job.states.length === 0) {
    await initializeFirstState(job);
  } else {
    await checkLastState(job);
  }
};

/**
 * Delete a monitoring job from Agenda by job ID.
 * @param {*} jobObject Object containing the job ID.
 */
const deleteVisualMonitoringJob = async (jobObject) => {
  await deleteAgendaJob(jobObject._id);
};

export { executeVisualMonitoringJob, deleteVisualMonitoringJob };
