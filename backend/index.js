import express, { json } from "express";
import "dotenv/config";
import cors from "cors";
import { connectToDB, closeDB } from "./db.js";
import { previewRouter } from "./routes/preview.js";
import { jobRouter } from "./routes/monitoring.js";
import { accountRouter } from "./routes/account.js";
import { adminRouter } from "./routes/admin.js";
import { imageRouter } from "./routes/image.js";
import { authChecker } from "./middlewares/auth.js";

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(json());

app.use("/api", imageRouter);
app.use("/api", adminRouter);
app.use("/api", accountRouter);
app.use("/api", previewRouter, authChecker);
app.use("/api", jobRouter, authChecker);

connectToDB(process.env.MONGODB_URI).then((r) => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});
