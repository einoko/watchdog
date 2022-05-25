import nodemailer from "nodemailer";
import "dotenv/config";
import { getVisualAlertMail } from "../tests/mailTemplateUtil.js";

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

export const sendVisualAlertMail = (email, jobName, jobUrl, beforeId, afterId, diffId) => {
  const mailOptions = {
    from,
    to: email,
    subject: "Watchdog monitor detected a change!",
    html: getVisualAlertMail(jobName, jobUrl, `${process.env.BASE_URL}/api/image/${beforeId}`, `${process.env.BASE_URL}/api/image/${afterId}`, `${process.env.BASE_URL}/api/image/${diffId}`),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
