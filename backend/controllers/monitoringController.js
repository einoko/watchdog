import { scheduleMonitoringJob } from "../services/agendaService.js";
import { deleteMonitoringJob } from "../services/monitoringService.js";

const createMonitoringJob = (jobObject) => {
  scheduleMonitoringJob(jobObject);
};

const changeStatus = (jobObject) => {
  if (jobObject.active) {
    createMonitoringJob(jobObject);
  } else {
    deleteMonitoringJob(jobObject._id);
  }
};

export { createMonitoringJob, changeStatus };
