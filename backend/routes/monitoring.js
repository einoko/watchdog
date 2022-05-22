import express from "express";
import { body, validationResult } from "express-validator";
import { MonitoringJob, acceptedIntervals } from "../models/monitoringJob.js";
import createMonitoringJob from "../controllers/monitoringController.js";

const router = express.Router();

router.post(
  "/job",
  body("name").isString(),
  body("url").isURL(),
  body("interval").isIn(acceptedIntervals),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, url, interval } = req.body;

    MonitoringJob.create({ name, url, interval }, (err, job) => {
      if (err) {
        return res.status(500).json({
          errors: [{ msg: "Could not create the monitoring job." }],
        });
      } else {
        createMonitoringJob(job);
      }
    });

    return res.status(200).json({
      msg: "Successfully created a new monitoring job.",
    });
  }
);

export { router as jobRouter };
