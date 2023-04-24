import mongoose from "mongoose";
import { SiteConfig } from "./models/siteConfig.js";

export const getMongoURI = () => {
  return `mongodb://${process.env.DATABASE_HOST || "localhost"}:27017/watchdog`;
};

const connectToDB = async () => {
  await mongoose
    .connect(getMongoURI())
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
      mailService: "126",
      mailUser: null,
      mailPass: null,
      mailFrom: null,
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
