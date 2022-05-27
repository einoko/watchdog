import mongoose from "mongoose";
import randToken from "rand-token";

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

const visualMonitoringJobSchema = new mongoose.Schema(
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
    states: {
      type: [Object],
      default: [],
    },
    scrollToElement: {
      type: String,
    },
    hideElements: {
      type: [String],
    },
    crop: {
      type: Object,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const VisualMonitoringJob = mongoose.model(
  "VisualMonitoringJob",
  visualMonitoringJobSchema
);

export { VisualMonitoringJob, acceptedIntervals };
