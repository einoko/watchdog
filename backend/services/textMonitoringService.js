import { TextMonitoringJob } from "../models/textMonitoringJob.js";
import { deleteAgendaJob } from "./agendaService.js";
import { getWebsiteText } from "./textService.js";

const checkText = async (url, type, words) => {
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
        matches.push(`Word "${word}" was found in text.`);
      }
    } else {
      if (!text.includes(word.toLowerCase())) {
        matches.push(`Word "${word}" was not found in text.`);
      }
    }
  }

  if (matches.length > 0) {
    console.log("Send mail here");
    return matches;
  } else {
    console.log("No matches this time...");
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

  const matches = await checkText(job.url, job.type, job.words);

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
 * @param {*} jobID ID of the monitoring job to delete.
 */
const deleteTextMonitoringJob = async (jobID) => {
  await deleteAgendaJob(jobID);
};

export { executeTextMonitoringJob, deleteTextMonitoringJob };
