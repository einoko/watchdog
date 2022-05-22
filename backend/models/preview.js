import mongoose from "mongoose";

const previewSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    success: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Preview = mongoose.model("Preview", previewSchema);

export { Preview };
