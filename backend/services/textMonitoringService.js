import { MonitoringJob } from "../models/monitoringJob.js";
import { User } from "../models/user.js";
import { deleteAgendaJob } from "./agendaService.js";
import { sendKeywordAlertMail, sendTextDiffMail } from "./mailService.js";
import { getWebsiteText } from "./textService.js";

const checkText = async (job) => {
  const fullText = await getWebsiteText(job.url, job.text_css);

  if (fullText === null) {
    // TODO: Implement
    console.error("Could not retrieve text from website. Send warning email.");
    return;
  }

  if (job.text_type === "any_change") {
    if (job.states.length === 0) {
      job.states.push({
        text: fullText,
        createdAt: new Date(),
      });

      await job.save();

      console.log("Created initial state.");
      return;
    } else {
      const lastState = job.states[job.states.length - 1];

      if (lastState.text !== fullText) {
        job.states.push({
          text: fullText,
          createdAt: new Date(),
        });

        await job.save();

        // Send alert email.
        const user = await User.findById(job.userId);

        if (user) {
          sendTextDiffMail(job, user);
        } else {
          console.error(`Could not find user ${job.userId}`);
        }

        console.log("Created new state.");
        return;
      } else {
        return;
      }
    }
  } else {
    const trimmedText = fullText.toLowerCase().replace(/\s+/g, " ").trim();

    const matches = [];

    for (const word of job.text_words.toString().split(",").map((word) => word.trim())) {
      if (job.text_type === "added") {
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
        job.states.push({
          matches,
          createdAt: new Date(),
          fullText,
        });

        await job.save();
        sendKeywordAlertMail(job, user, matches);
      } else {
        console.error(`Could not find user ${job.userId}`);
      }
    }
  }

  await job.save()
};

/**
 * Executes one monitoring cycle.
 * @param {*} jobID ID of the monitoring job to execute.
 */
const executeTextMonitoringJob = async (jobID) => {
  console.info(`Executing monitoring job ${jobID}`);

  const job = await MonitoringJob.findById(jobID);

  if (!job) {
    console.error(`Monitoring job ${jobID} not found`);
    return;
  }

  job.updatedAt = new Date();

  await checkText(job);
};

/**
 * Delete a monitoring job from Agenda by job ID.
 * @param {*} jobObject Object containing the job ID.
 */
const deleteTextMonitoringJob = async (jobObject) => {
  await deleteAgendaJob(jobObject._id);
};

export { executeTextMonitoringJob, deleteTextMonitoringJob };
