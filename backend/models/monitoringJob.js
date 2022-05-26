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

const monitoringJobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["visual", "text"],
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
    cookies: {
      type: String,
    },
    crop: {
      type: Object,
    },
    keywords: {
      type: [String],
    },
    wordChange: {
      type: String,
      enum: ["added", "removed"],
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const MonitoringJob = mongoose.model(
  "MonitoringJob",
  monitoringJobSchema
);

export { MonitoringJob, acceptedIntervals };
