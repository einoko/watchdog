import { TextMonitoringJob } from "../models/textMonitoringJob.js";
import { User } from "../models/user.js";
import { deleteAgendaJob } from "./agendaService.js";
import { sendTextAlertMail } from "./mailService.js";
import { getWebsiteText } from "./textService.js";

const checkText = async (url, type, words, jobID, jobName, jobUrl, userId) => {
  let text = await getWebsiteText(url);
  text = text.toLowerCase().replace(/\s+/g, " ").trim();

  if (text === null) {
    console.error("Could not retrieve text from website. Send warning email.");
    return;
  }

  const matches = [];

  for (const word of words) {
    if (type === "added") {
      if (text.includes(word.toLowerCase())) {
        matches.push(word);
      }
    } else {
      if (!text.includes(word.toLowerCase())) {
        matches.push(word);
      }
    }
  }

  if (matches.length > 0) {
    const user = await User.findById(userId);
    if (user) {
      sendTextAlertMail(jobID, user.email, jobName, jobUrl, matches, type);
    } else {
      console.error(`Could not find user ${userId}`);
    }
    return matches;
  } else {
    return null;
  }
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

  const matches = await checkText(
    job.url,
    job.type,
    job.words,
    jobID,
    job.name,
    job.url,
    job.userId
  );

  if (matches) {
    job.matches.push({
      matches: matches,
      createdAt: new Date(),
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
