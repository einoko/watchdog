import { deleteAgendaJob } from "./agendaService.js";

const executeMonitoringJob = async (jobID) => {
  // TODO: Implement
};

/**
 * Delete a monitoring job from Agenda by job ID.
 * @param {*} jobID ID of the monitoring job to delete.
 */
const deleteMonitoringJob = async (jobID) => {
  await deleteAgendaJob(jobID);
};

export { executeMonitoringJob, deleteMonitoringJob };
