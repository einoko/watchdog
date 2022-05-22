import { deleteAgendaJob } from "./agendaService.js";

const executeMonitoringJob = async (jobID) => {
  // TODO: Implement
};

const deleteMonitoringJob = async (jobObject) => {
  await deleteAgendaJob(jobObject._id);
};

export { executeMonitoringJob, deleteMonitoringJob };
