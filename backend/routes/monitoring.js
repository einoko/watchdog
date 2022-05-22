import express from "express";
import { body, validationResult } from "express-validator";
import { MonitoringJob, acceptedIntervals } from "../models/monitoringJob.js";
import {
  createMonitoringJob,
  changeStatus,
} from "../controllers/monitoringController.js";
import { deleteMonitoringJob } from "../services/monitoringService.js";
import { deleteImage } from "../services/imageService.js";

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
 * @api {update} /monitoring/job Change the settings of a monitoring job
 */
router.put(
  "/job",
  body("_id").isMongoId(),
  body("name").isString(),
  body("url").isURL(),
  body("interval").isIn(acceptedIntervals),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { _id, name, url, interval } = req.body;

    MonitoringJob.findByIdAndUpdate(
      _id,
      { name, url, interval },
      { new: true },
      (err, job) => {
        if (err) {
          return res.status(500).json({
            errors: [{ msg: "Could not update the monitoring job." }],
          });
        } else {
          deleteMonitoringJob(job._id);
          createMonitoringJob(job);

          return res.status(200).json({
            msg: "Successfully updated the monitoring job.",
          });
        }
      }
    );
  }
);

/**
 * @api {patch} /monitoring/job/status Pause or resume a monitoring job
 */
router.patch(
  "/job/status",
  body("_id").isMongoId(),
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

/**
 * @api {delete} /monitoring/job Delete a monitoring job
 */
router.delete("/job", body("id").isString(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.body;
  const job = await MonitoringJob.findById(id);

  if (!job) {
    return res.status(500).json({
      errors: [{ msg: "Could not find the monitoring job." }],
    });
  }

  deleteMonitoringJob(job._id);

  job.states.forEach((state) => {
    if (state.image) {
      deleteImage(state.image);
    }
    if (state.diff) {
      deleteImage(state.diff);
    }
  });

  job.remove();

  res.status(200).json({ msg: "Successfully deleted the monitoring job." });
});

export { router as jobRouter };
