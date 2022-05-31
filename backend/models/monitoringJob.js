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

const monitoringJobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    jobType: {
      type: String,
      required: true,
      enum: ["text", "visual"],
      immutable: true,
    },
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    threshold: {
      type: Number,
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
    visual_scrollToElement: {
      type: String,
    },
    visual_hideElements: {
      type: String,
    },
    visual_crop: {
      type: Object,
    },
    text_css: {
      type: String,
    },
    text_type: {
      type: String,
      enum: ["any_change", "added", "removed"],
    },
    text_words: {
      type: [String],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const MonitoringJob = mongoose.model("MonitoringJob", monitoringJobSchema);

export { MonitoringJob, acceptedIntervals };
