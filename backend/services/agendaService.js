import { Agenda } from "agenda";
import "dotenv/config";
import { executeVisualMonitoringJob } from "./visualMonitoringService.js";

const agenda = new Agenda({
  db: { address: process.env.MONGODB_URI, collection: "agendaJobs" },
});

agenda.define("monitor website for changes", async (job) => {
  executeVisualMonitoringJob(job.attrs.data.jobID);
});

export const deleteAgendaJob = async (id) => {
  await agenda.cancel({ data: { jobID: id } });
};

export const scheduleMonitoringJob = (jobObject) => {
  const job = agenda.create("monitor website for changes", {
    jobID: jobObject._id,
  });

  job.repeatEvery(jobObject.interval);
  job.save();
};

agenda.start();
