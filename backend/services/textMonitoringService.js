import { TextMonitoringJob } from "../models/textMonitoringJob.js";
import { User } from "../models/user.js";
import { deleteAgendaJob } from "./agendaService.js";
import { sendTextAlertMail } from "./mailService.js";
import { getWebsiteText } from "./textService.js";

const checkText = async (job) => {
  const fullText = await getWebsiteText(job.url);

  if (fullText === null) {
    console.error("Could not retrieve text from website. Send warning email.");
    return;
  }

  const trimmedText = fullText.toLowerCase().replace(/\s+/g, " ").trim();

  const matches = [];

  for (const word of job.words) {
    if (job.type === "added") {
      if (trimmedText.includes(word.toLowerCase())) {
        matches.push(word);
      }
    } else if (!trimmedText.includes(word.toLowerCase())) {
      matches.push(word);
    }
  }

  if (matches.length > 0) {
    const user = await User.findById(job.userId);
    if (user) {
      sendTextAlertMail(job, user, matches);
    } else {
      console.error(`Could not find user ${job.userId}`);
    }
  }

  return { matches, fullText };
};

/**
 * Executes one monitoring cycle.
 * @param {*} jobID ID of the monitoring job to execute.
 */
const executeTextMonitoringJob = async (jobID) => {
  console.info(`Executing monitoring job ${jobID}`);

  const job = await TextMonitoringJob.findById(jobID);

  if (!job) {
    console.error(`Monitoring job ${jobID} not found`);
    return;
  }

  const { matches, fullText } = await checkText(job);

  if (matches.length > 0) {
    job.matches.push({
      matches,
      createdAt: new Date(),
      fullText,
    });

    await job.save();
  }
};

/**
 * Delete a monitoring job from Agenda by job ID.
 * @param {*} jobObject Object containing the job ID.
 */
const deleteTextMonitoringJob = async (jobObject) => {
  await deleteAgendaJob(jobObject._id);
};

export { executeTextMonitoringJob, deleteTextMonitoringJob };
