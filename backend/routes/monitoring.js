import express from "express";
import { body, header, param, validationResult } from "express-validator";
import {
  VisualMonitoringJob,
  acceptedIntervals,
} from "../models/visualMonitoringJob.js";
import { TextMonitoringJob } from "../models/textMonitoringJob.js";
import {
  createVisualMonitoringJob,
  changeStatus,
  createTextMonitoringJob,
} from "../controllers/monitoringController.js";
import { deleteVisualMonitoringJob } from "../services/visualMonitoringService.js";
import { deleteImage } from "../services/imageService.js";
import { verifyJWT } from "../utils/JWTUtil.js";

const router = express.Router();

/**
 * @api {post} /api/job Create a new monitoring job
 */
router.post(
  "/job/visual",
  body("name").isString(),
  body("url").isURL(),
  body("interval")
    .isIn(acceptedIntervals)
    .withMessage("Please enter a valid interval."),
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

    VisualMonitoringJob.create({ userId, name, url, interval }, (err, job) => {
      if (err) {
        return res.status(500).json({
          errors: [{ msg: "Could not create the monitoring job." }],
        });
      } else {
        createVisualMonitoringJob(job);

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
  "/job/visual/:_id",
  param("_id").isMongoId(),
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

    const _id = req.params._id;
    const { name, interval } = req.body;

    VisualMonitoringJob.findOneAndUpdate(
      { _id, userId },
      { name, interval },
      { new: true },
      (err, job) => {
        if (err) {
          return res.status(500).json({
            errors: [{ msg: "Could not update the monitoring job." }],
          });
        } else {
          deleteVisualMonitoringJob(job._id);
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
  "/job/visual/:_id/status",
  param("_id").isMongoId(),
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

    const _id = req.params._id;
    const active = req.body.active;

    VisualMonitoringJob.findById({ _id, userId }, (err, job) => {
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
  "/job/visual/:_id",
  param("_id").isMongoId(),
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

    const { _id } = req.params;
    const job = await VisualMonitoringJob.findById(_id);

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

    deleteVisualMonitoringJob(job._id);

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

/**
 * @api {get} /api/job Get a monitoring job
 */
router.get(
  "/job/visual/:_id",
  param("_id").isMongoId(),
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

    const { _id } = req.params;

    const job = await VisualMonitoringJob.findById(_id);

    if (!job) {
      return res.status(500).json({
        errors: [{ msg: "Could not find the monitoring job." }],
      });
    }

    if (job.userId.toString() !== userId) {
      return res.status(401).json({
        errors: [{ msg: "You are not authorized to view this job." }],
      });
    }

    res.status(200).json({ job });
  }
);

/**
 * @api {get} /api/jobs Get all monitoring jobs for user
 */
router.get(
  "/jobs/visual",
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

    const jobs = await VisualMonitoringJob.find({ userId });

    res.status(200).json({ jobs });
  }
);

router.post(
  "/job/text",
  body("name").isString(),
  body("url").isURL(),
  body("interval")
    .isIn(acceptedIntervals)
    .withMessage("Please enter a valid interval."),
  body("type").isIn(["added", "removed"]),
  body("words").isArray(),
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

    const { name, url, interval, type, words } = req.body;

    TextMonitoringJob.create(
      {
        name,
        url,
        interval,
        type,
        words,
        userId,
      },
      (err, job) => {
        if (err) {
          return res.status(500).json({
            errors: [{ msg: "Could not create the monitoring job." }],
          });
        }
        createTextMonitoringJob(job);

        res
          .status(200)
          .json({ msg: "Successfully created the monitoring job." });
      }
    );
  }
);

export { router as jobRouter };
