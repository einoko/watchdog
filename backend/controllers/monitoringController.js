import {
  scheduleTextMonitoringJob,
  scheduleVisualMonitoringJob,
} from "../services/agendaService.js";
import { deleteTextMonitoringJob } from "../services/textMonitoringService.js";
import { deleteVisualMonitoringJob } from "../services/visualMonitoringService.js";

const createVisualMonitoringJob = (jobObject) => {
  scheduleVisualMonitoringJob(jobObject);
};

const createTextMonitoringJob = (jobObject) => {
  scheduleTextMonitoringJob(jobObject);
};

const changeStatus = (jobObject) => {
  if (jobObject.active) {
    if (jobObject.words) {
      createTextMonitoringJob(jobObject);
    } else {
      createVisualMonitoringJob(jobObject);
    }
  } else {
    if (jobObject.words) {
      deleteTextMonitoringJob(jobObject);
    } else {
      deleteVisualMonitoringJob(jobObject);
    }
  }
};

export { createVisualMonitoringJob, createTextMonitoringJob, changeStatus };
