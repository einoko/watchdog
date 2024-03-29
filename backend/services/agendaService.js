import { Agenda } from "agenda";
import "dotenv/config";
import { executeTextMonitoringJob } from "./textMonitoringService.js";
import { executeVisualMonitoringJob } from "./visualMonitoringService.js";
import { getMongoURI } from "../db.js";

const agenda = new Agenda({
  db: { address: getMongoURI(), collection: "agendaJobs" },
});

agenda.define("monitor website for visual changes", async (job) => {
  await executeVisualMonitoringJob(job.attrs.data.jobID);
});

agenda.define("monitor website for text changes", async (job) => {
  await executeTextMonitoringJob(job.attrs.data.jobID);
});

export const deleteAgendaJob = async (id) => {
  await agenda.cancel({ data: { jobID: id } });
};

export const scheduleVisualMonitoringJob = (jobObject) => {
  const job = agenda.create("monitor website for visual changes", {
    jobID: jobObject._id,
  });

  job.repeatEvery(jobObject.interval);
  job.save();
};

export const scheduleTextMonitoringJob = (jobObject) => {
  const job = agenda.create("monitor website for text changes", {
    jobID: jobObject._id,
  });

  job.repeatEvery(jobObject.interval);
  job.save();
};

agenda.start();
