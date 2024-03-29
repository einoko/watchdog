import express, { json } from "express";
import "dotenv/config";
import cors from "cors";
import { connectToDB } from "./db.js";
import { previewRouter } from "./routes/preview.js";
import { jobRouter } from "./routes/monitoring.js";
import { accountRouter } from "./routes/account.js";
import { adminRouter } from "./routes/admin.js";
import { imageRouter } from "./routes/image.js";
import { emailCancelRouter } from "./routes/emailCancel.js";
import { restartStuckJobs } from "./services/agendaRestarter.js";

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(json());

const basePath = "";

app.use(`${basePath}/api`, emailCancelRouter);
app.use(`${basePath}/api`, imageRouter);
app.use(`${basePath}/api`, adminRouter);
app.use(`${basePath}/api`, accountRouter);
app.use(`${basePath}/api`, previewRouter);
app.use(`${basePath}/api`, jobRouter);

connectToDB().then((r) => {
  restartStuckJobs();

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});
