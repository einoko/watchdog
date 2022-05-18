import mongoose from "mongoose";

const connectToDB = async (MONGODB_URI) => {
  await mongoose.connect(MONGODB_URI).then(r => {
    console.log("Connected to MongoDB.");
  }).catch(e => {
    console.error("Error connecting to MongoDB.", e);
    process.exit();
  });
};

const closeDB = () => {
  mongoose.connection.close().then(r => {
    console.log("Closed MongoDB connection.");
  }).catch(e => {
    console.error("Error closing MongoDB connection.", e);
    process.exit();
  });
};

export { connectToDB, closeDB };
