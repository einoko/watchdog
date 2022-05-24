import { scheduleTextMonitoringJob, scheduleVisualMonitoringJob } from "../services/agendaService.js";
import { deleteVisualMonitoringJob } from "../services/visualMonitoringService.js";

const createVisualMonitoringJob = (jobObject) => {
  scheduleVisualMonitoringJob(jobObject);
};

const createTextMonitoringJob = (jobObject) => {
  scheduleTextMonitoringJob(jobObject);
};

const changeStatus = (jobObject) => {
  if (jobObject.active) {
    createVisualMonitoringJob(jobObject);
  } else {
    deleteVisualMonitoringJob(jobObject._id);
  }
};

export { createVisualMonitoringJob, createTextMonitoringJob, changeStatus };
