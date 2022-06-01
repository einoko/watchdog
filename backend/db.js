import mongoose from "mongoose";
import { SiteConfig } from "./models/siteConfig.js";

const connectToDB = async (MONGODB_URI) => {
  await mongoose
    .connect(MONGODB_URI)
    .then((r) => {
      console.log("Connected to MongoDB.");
    })
    .catch((e) => {
      console.error("Error connecting to MongoDB.", e);
      process.exit();
    });

  // Check if SiteConfig exists. If not, create it.
  const siteConfig = await SiteConfig.findOne({});
  if (!siteConfig) {
    await SiteConfig.create({
      openSignup: true,
    });
  } else {
    console.log("Siteconfig exists.");
  }
};

const closeDB = () => {
  mongoose.connection
    .close()
    .then((r) => {
      console.log("Closed MongoDB connection.");
    })
    .catch((e) => {
      console.error("Error closing MongoDB connection.", e);
      process.exit();
    });
};

export { connectToDB, closeDB };
