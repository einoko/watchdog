import express from "express";
import { body, validationResult } from "express-validator";
import { MonitoringJob, acceptedIntervals } from "../models/monitoringJob.js";

import {
  createMonitoringJob,
  changeStatus,
} from "../controllers/monitoringController.js";

const router = express.Router();

/**
 * @api {post} /monitoring/job Create a new monitoring job
 */
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

        return res.status(200).json({
          msg: "Successfully created a new monitoring job.",
        });
      }
    });
  }
);

/**
 * @api {patch} /monitoring/job/status Pause or resume a monitoring job
 */
router.patch(
  "/job/status",
  body("id").isString(),
  body("active").isBoolean(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, active } = req.body;

    MonitoringJob.findById(id, (err, job) => {
      if (err) {
        return res.status(500).json({
          errors: [{ msg: "Could not find the monitoring job." }],
        });
      } else {
        job.active = active;
        job.save();
        changeStatus(job);
        res.status(200).json({ msg: "Job status changed." });
      }
    });
  }
);

export { router as jobRouter };
