import nodemailer from "nodemailer";
import "dotenv/config";
import { getVisualAlertMail } from "../tests/mailTemplateUtil.js";
import { compressImage, getFullLink } from "./imageService.js";
import fs from "fs";
import { createDeletionToken } from "../utils/JWTUtil.js";

let options;

if (process.env.MAIL_SERVICE) {
  options = {
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  };
} else {
  options = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  };
}

const from =
  process.env.MAIL_FROM || "Watchdog Monitor <watchdog.monitor@yahoo.com>";
const transporter = nodemailer.createTransport(options);

export const sendVisualAlertMail = async (
  jobId,
  email,
  jobName,
  jobUrl,
  beforeId,
  afterId,
  diffId
) => {
  const compressedBefore = await compressImage(beforeId);
  const compressedAfter = await compressImage(afterId);
  const compressedDiff = await compressImage(diffId);

  const mailOptions = {
    from,
    to: email,
    subject: "Watchdog monitor detected a change!",
    html: getVisualAlertMail(
      jobName,
      jobUrl,
      Buffer.from(compressedBefore).toString("base64"),
      Buffer.from(compressedAfter).toString("base64"),
      Buffer.from(compressedDiff).toString("base64"),
      getFullLink(beforeId),
      getFullLink(afterId),
      getFullLink(diffId)
    ),
  };

  console.log("Mail sent...");

  const mailResult = getVisualAlertMail(
    jobName,
    jobUrl,
    Buffer.from(compressedBefore).toString("base64"),
    Buffer.from(compressedAfter).toString("base64"),
    Buffer.from(compressedDiff).toString("base64"),
    getFullLink(beforeId),
    getFullLink(afterId),
    getFullLink(diffId),
    createDeletionToken(jobId, "visual")
  )

  // save mail to file
  fs.writeFileSync(`./mail.html`, mailResult);

  /*transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });*/
};