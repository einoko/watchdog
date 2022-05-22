import mongoose from "mongoose";

const acceptedIntervals = [
  "1 minute",
  "5 minutes",
  "15 minutes",
  "30 minutes",
  "hour",
  "3 hours",
  "6 hours",
  "12 hour",
  "day",
  "week",
  "month",
  "year",
];

const monitoringJobSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    interval: {
      type: String,
      required: true,
      enum: acceptedIntervals,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const MonitoringJob = mongoose.model("MonitoringJob", monitoringJobSchema);

export { MonitoringJob, acceptedIntervals };
