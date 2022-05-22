import { scheduleMonitoringJob } from "../utils/agendaUtil.js";

const createMonitoringJob = (jobObject) => {
  scheduleMonitoringJob(jobObject);
};

export default createMonitoringJob;
