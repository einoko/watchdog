import nodemailer from "nodemailer";
import "dotenv/config";
import { compressImage, getFullLink } from "./imageService.js";
import Diff from "text-diff";
import { SiteConfig } from "../models/siteConfig.js";
import fs from "fs";
import Handlebars from "handlebars";

const createDeletionLink = (token) => {
  return `${process.env.APP_URL}/api/emailCancel/${token}`;
};

const getTransporter = async () => {
  const config = await SiteConfig.findOne({});

  const options = {
    service: config.mailService || null,
    auth: {
      user: config.mailUser || null,
      pass: config.mailPass || null,
    },
  };

  const from = config.mailFrom || null;

  const transporter = nodemailer.createTransport(options);

  return {
    transporter,
    from,
  };
};

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

  const templateFile = "./templates/emails/visual-alert-mail.hbs";
  const template = Handlebars.compile(fs.readFileSync(templateFile, "utf8"));

  const { transporter, from } = await getTransporter();

  const mailOptions = {
    from,
    to: userObject.email,
    subject: "Watchdog monitor detected a change!",
    html: template(templateObject),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export const sendKeywordAlertMail = async (job, user, matches = null) => {
  const templateObject = {
    title: "Watchdog monitor detected a change!",
    jobName: job.name,
    jobUrl: job.url,
    matches: matches.map((match) => {
      return {
        keyword: match,
      };
    }),
    wordChange: job.text_type === "removed" ? "not found" : "found",
    keywords: job.text_words[0].split(",").map((word) => {
      return {
        keyword: word.trim(),
      };
    }),
    cancelLink: createDeletionLink(job.cancelToken),
  };

  const { transporter, from } = await getTransporter();

  const templateFile = "./templates/emails/keyword-alert-mail.hbs";
  const template = Handlebars.compile(fs.readFileSync(templateFile, "utf8"));

  const mailOptions = {
    from,
    to: user.email,
    subject: "Watchdog monitor detected a change!",
    html: template(templateObject),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
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

  const templateFile = "./templates/emails/text-change-alert-mail.hbs";
  const template = Handlebars.compile(fs.readFileSync(templateFile, "utf8"));

  const { transporter, from } = await getTransporter();

  const mailOptions = {
    from,
    to: user.email,
    subject: "Watchdog monitor detected a change!",
    html: template(templateObject),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export const sendTestMail = async (
  email,
  mailService,
  mailUser,
  mailPass,
  mailFrom
) => {
  const options = {
    service: mailService,
    auth: {
      user: mailUser,
      pass: mailPass,
    },
  };

  const { transporter } = await getTransporter();

  const templateFile = "./templates/emails/test-email.hbs";
  const template = Handlebars.compile(fs.readFileSync(templateFile, "utf8"));

  const mailOptions = {
    from: mailFrom,
    to: email,
    subject: "Watchdog Test Mail",
    html: template({
      title: "Watchdog Test Mail",
    }),
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        resolve({
          error: error,
        });
      } else {
        resolve({
          success: info,
        });
      }
    });
  });
};
