import express, { json } from "express";
import "dotenv/config";
import cors from "cors";
import { connectToDB, closeDB } from "./db.js";
import { previewRouter } from "./routes/preview.js";
import { jobRouter } from "./routes/monitoring.js";

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(json());

app.use("/api", previewRouter);
app.use("/api", jobRouter);

connectToDB(process.env.MONGODB_URI).then((r) => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});
