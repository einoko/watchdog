import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

const User = mongoose.model("User", userSchema);

export { User };
