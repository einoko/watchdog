import express from "express";
import { body, header, validationResult } from "express-validator";
import { MonitoringJob, acceptedIntervals } from "../models/monitoringJob.js";
import {
  createMonitoringJob,
  changeStatus,
} from "../controllers/monitoringController.js";
import { deleteMonitoringJob } from "../services/monitoringService.js";
import { deleteImage } from "../services/imageService.js";
import { verifyJWT } from "../utils/JWTUtil.js";

const router = express.Router();

/**
 * @api {post} /api/job Create a new monitoring job
 */
router.post(
  "/job",
  body("name").isString(),
  body("url").isURL(),
  body("interval").isIn(acceptedIntervals).withMessage("Please enter a valid interval."),
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userToken = verifyJWT(req.headers.authorization);

    if (userToken.errors.length > 0) {
      return res.status(401).json({ errors: userToken.errors });
    }

    const userId = userToken.decoded.user.id;

    const { name, url, interval } = req.body;

    MonitoringJob.create({ userId, name, url, interval }, (err, job) => {
      if (err) {
        return res.status(500).json({
          errors: [{ msg: "Could not create the monitoring job." }],
        });
      } else {
        createMonitoringJob(job);

        return res.status(201).json({
          msg: "Successfully created a new monitoring job.",
        });
      }
    });
  }
);

/**
 * @api {update} /api/job Change the settings of a monitoring job
 */
router.put(
  "/job",
  body("_id").isMongoId(),
  body("name").isString(),
  body("interval").isIn(acceptedIntervals),
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userToken = verifyJWT(req.headers.authorization);

    if (userToken.errors.length > 0) {
      return res.status(401).json({ errors: userToken.errors });
    }

    const userId = userToken.decoded.user.id;

    const { _id, name, interval } = req.body;

    MonitoringJob.findOneAndUpdate(
      { _id, userId },
      { name, interval },
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
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userToken = verifyJWT(req.headers.authorization);

    if (userToken.errors.length > 0) {
      return res.status(401).json({ errors: userToken.errors });
    }

    const userId = userToken.decoded.user.id;

    const { _id, active } = req.body;

    MonitoringJob.findById({ _id, userId }, (err, job) => {
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
 * @api {delete} /api/job Delete a monitoring job
 */
router.delete(
  "/job",
  body("_id").isString(),
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userToken = verifyJWT(req.headers.authorization);

    if (userToken.errors.length > 0) {
      return res.status(401).json({ errors: userToken.errors });
    }

    const userId = userToken.decoded.user.id;

    const { _id } = req.body;
    const job = await MonitoringJob.findById(_id);

    if (!job) {
      return res.status(500).json({
        errors: [{ msg: "Could not find the monitoring job." }],
      });
    }

    if (job.userId.toString() !== userId) {
      return res.status(401).json({
        errors: [
          { msg: "You are not authorized to delete this monitoring job." },
        ],
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
  }
);

export { router as jobRouter };
