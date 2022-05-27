import nodemailer from "nodemailer";
import "dotenv/config";
import {
  getKeywordAlertMail,
  getVisualAlertMail,
  getTextChangeAlertMail,
} from "../utils/mailTemplateUtil.js";
import { compressImage, getFullLink } from "./imageService.js";
import fs from "fs";
import Diff from "text-diff";

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

export const sendKeywordAlertMail = async (job, user, matches = null) => {
  const templateObject = {
    jobName: job.name,
    jobUrl: job.url,
    matches: matches,
    wordChange: job.type,
    keywords: job.words,
    cancelLink: createDeletionLink(job.cancelToken),
  };

  const mailOptions = {
    from,
    to: user.email,
    subject: "Watchdog monitor detected a change!",
    html: getKeywordAlertMail(templateObject),
  };

  const mailResult = getKeywordAlertMail(templateObject);

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

export const sendTextDiffMail = async (job, user) => {
  // Get the last and second last state texts
  const lastStateText = job.states[job.states.length - 1].text;
  const secondLastStateText = job.states[job.states.length - 2].text;

  const diff = new Diff();

  let textDiff = diff.main(secondLastStateText, lastStateText);
  diff.cleanupSemantic(textDiff);
  const html = diff.prettyHtml(textDiff);

  const templateObject = {
    jobName: job.name,
    jobUrl: job.url,
    cancelLink: createDeletionLink(job.cancelToken),
    diffHTML: html,
  };

  const mailOptions = {
    from,
    to: user.email,
    subject: "Watchdog monitor detected a change!",
    html: getTextChangeAlertMail(templateObject),
  };

  const mailResult = getTextChangeAlertMail(templateObject);

  fs.writeFileSync("./text_mail.html", mailResult);

  console.log("Mail sent...");

  /*transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });*/
};
