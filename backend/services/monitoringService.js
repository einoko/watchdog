import { MonitoringJob } from "../models/monitoringJob.js";
import {
  calculateDifference,
  createDiffImage,
  deleteImage,
} from "../utils/compareUtil.js";
import { deleteAgendaJob } from "./agendaService.js";
import { Image } from "../models/image.js";
import { captureWebsiteToBuffer } from "./captureService.js";
import { saveImage } from "./imageService.js";

const initializeFirstState = async (job) => {
  const screenshot = await captureWebsiteToBuffer(job.url);

  if (screenshot === null) {
    console.error(`Could not capture screenshot for ${job._id} ${job.url}`);
    return;
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

  const screenshot = await captureWebsiteToBuffer(job.url);

  if (screenshot === null) {
    console.error(`Could not capture screenshot for ${job._id} ${job.url}`);
    return;
  } else {
    
  }
}

const executeMonitoringJob = async (jobID) => {
  console.info(`Executing monitoring job ${jobID}`);

  const job = await MonitoringJob.findById(jobID);

  if (!job) {
    console.error(`Monitoring job ${jobID} not found`);
    return;
  }

  if (job.states.length === 0) {
    initializeFirstState(job);
  } else {
    checkLastState(job);
  }
};

/**
 * Delete a monitoring job from Agenda by job ID.
 * @param {*} jobID ID of the monitoring job to delete.
 */
const deleteMonitoringJob = async (jobID) => {
  await deleteAgendaJob(jobID);
};

export { executeMonitoringJob, deleteMonitoringJob };
