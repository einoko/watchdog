import mongoose from "mongoose";

const previewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
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
