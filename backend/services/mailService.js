import nodemailer from "nodemailer";
import "dotenv/config";
import {
  getTextAlertMail,
  getVisualAlertMail,
} from "../utils/mailTemplateUtil.js";
import { compressImage, getFullLink } from "./imageService.js";
import fs from "fs";

// TODO: Refactor

const createDeletionLink = (token) => {
  return `${process.env.APP_URL}/api/emailCancel/${token}`;
};

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
  userObject,
  jobObject,
  lastStateImage,
  savedNewScreenshot,
  savedDiffImage
) => {
  const compressedBefore = await compressImage(lastStateImage._id);
  const compressedAfter = await compressImage(savedNewScreenshot._id);
  const compressedDiff = await compressImage(savedDiffImage._id);

  const templateObject = {
    jobName: jobObject.name,
    jobUrl: jobObject.url,
    beforeImage: Buffer.from(compressedBefore).toString("base64"),
    afterImage: Buffer.from(compressedAfter).toString("base64"),
    diffImage: Buffer.from(compressedDiff).toString("base64"),
    beforeLink: getFullLink(lastStateImage._id),
    afterLink: getFullLink(savedNewScreenshot._id),
    diffLink: getFullLink(savedDiffImage._id),
    cancelLink: createDeletionLink(jobObject.cancelToken),
  };

  const mailOptions = {
    from,
    to: userObject.email,
    subject: "Watchdog monitor detected a change!",
    html: getVisualAlertMail(templateObject),
  };

  console.log("Mail sent...");

  const mailResult = getVisualAlertMail(templateObject);

  // save mail to file
  fs.writeFileSync(`./visual_mail.html`, mailResult);

  /*transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });*/
};

export const sendTextAlertMail = async (job, user, matches) => {
  const templateObject = {
    jobName: job.name,
    jobUrl: job.url,
    matches: matches,
    cancelLink: createDeletionLink(job.cancelToken),
  };

  const mailOptions = {
    from,
    to: user.email,
    subject: "Watchdog monitor detected a change!",
    html: getTextAlertMail(templateObject),
  };

  const mailResult = getTextAlertMail(templateObject);

  // save mail to file
  fs.writeFileSync(`./text_mail.html`, mailResult);

  console.log("Mail sent...");

  /*transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });*/
};
