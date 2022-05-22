import { Agenda } from "agenda";
import "dotenv/config";

const agenda = new Agenda({
  db: { address: process.env.MONGODB_URI, collection: "agendaJobs" },
});

agenda.define("monitor website for changes", async (job) => {
  const jobID = job.attrs.data.jobID;
  console.log(`Monitoring job ${jobID}`);
});

export const scheduleMonitoringJob = (jobObject) => {
  const job = agenda.create("monitor website for changes", {
    jobID: jobObject._id,
  });
  job.repeatEvery(jobObject.interval);
  job.save();
};

agenda.start();
