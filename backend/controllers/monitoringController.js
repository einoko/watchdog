import { scheduleMonitoringJob } from "../services/agendaService.js";
import { deleteVisualMonitoringJob } from "../services/visualMonitoringService.js";

const createMonitoringJob = (jobObject) => {
  scheduleMonitoringJob(jobObject);
};

const changeStatus = (jobObject) => {
  if (jobObject.active) {
    createMonitoringJob(jobObject);
  } else {
    deleteVisualMonitoringJob(jobObject._id);
  }
};

export { createMonitoringJob, changeStatus };
