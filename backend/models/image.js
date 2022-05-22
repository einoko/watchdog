import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Image = mongoose.model("Image", imageSchema);

export { Image };
