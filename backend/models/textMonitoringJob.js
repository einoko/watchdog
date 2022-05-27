import mongoose from "mongoose";
import randToken from "rand-token";

// TODO: Remove 1 minute
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

const textMonitoringJobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
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
    cancelToken: {
      type: String,
      required: true,
      default: () => randToken.generate(32),
    },
    cssText: {
      type: String,
      default: null,
    },
    states: {
      type: [Object],
      default: [],
    },
    type: {
      type: String,
      enum: ["any_change", "added", "removed"],
    },
    words: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const TextMonitoringJob = mongoose.model(
  "TextMonitoringJob",
  textMonitoringJobSchema
);

export { TextMonitoringJob, acceptedIntervals };
