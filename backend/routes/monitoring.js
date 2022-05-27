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
import { deleteTextMonitoringJob } from "../services/textMonitoringService.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Visual monitoring jobs

/**
 * @api {post} /api/job/visual Create a new visual monitoring job
 */
router.post(
  "/job/visual",
  auth,
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

    const userId = req.userId;

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
 * @api {update} /api/job/visual/:id Change the settings of a visual monitoring job
 */
router.put(
  "/job/visual/:_id",
  auth,
  param("_id").isMongoId(),
  body("name").isString(),
  body("interval").isIn(acceptedIntervals),
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId;

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
          createVisualMonitoringJob(job);

          return res.status(200).json({
            msg: "Successfully updated the monitoring job.",
          });
        }
      }
    );
  }
);

/**
 * @api {patch} /monitoring/job/visual/:id/status Pause or resume a visual monitoring job
 */
router.patch(
  "/job/visual/:_id/status",
  auth,
  param("_id").isMongoId(),
  body("active").isBoolean(),
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId;

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
 * @api {delete} /api/job/visual/:id Delete a visual monitoring job
 */
router.delete(
  "/job/visual/:_id",
  auth,
  param("_id").isMongoId(),
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId;

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
 * @api {get} /api/job/visual/:id Get a single visual monitoring job
 */
router.get(
  "/job/visual/:_id",
  auth,
  param("_id").isMongoId(),
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId;

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
 * @api {get} /api/jobs/visual Get all visual monitoring jobs for user
 */
router.get(
  "/jobs/visual",
  auth,
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId;

    const jobs = await VisualMonitoringJob.find({ userId });

    res.status(200).json({ jobs });
  }
);

// Text monitoring jobs

/**
 * @api {post} /api/job/text Create a text monitoring job
 */
router.post(
  "/job/text",
  auth,
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

    const userId = req.userId;

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
          .status(201)
          .json({ msg: "Successfully created a new monitoring job." });
      }
    );
  }
);

/**
 * @api {update} /api/job/text/:id Change the settings of a text monitoring job
 */
router.put(
  "/job/text/:_id",
  auth,
  param("_id").isMongoId(),
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

    const userId = req.userId;

    const { _id } = req.params;
    const { name, url, interval, type, words } = req.body;

    const job = await TextMonitoringJob.findById(_id);

    if (!job) {
      return res.status(500).json({
        errors: [{ msg: "Could not find the monitoring job." }],
      });
    }

    if (job.userId.toString() !== userId) {
      return res.status(401).json({
        errors: [
          { msg: "You are not authorized to edit this monitoring job." },
        ],
      });
    }

    TextMonitoringJob.findOneAndUpdate(
      { _id, userId },
      { name, url, interval, type, words },
      { new: true },
      (err, job) => {
        if (err) {
          return res.status(500).json({
            errors: [{ msg: "Could not update the monitoring job." }],
          });
        } else {
          deleteTextMonitoringJob(job._id);
          createTextMonitoringJob(job);

          return res.status(200).json({
            msg: "Successfully updated the monitoring job.",
          });
        }
      }
    );
  }
);

/**
 * @api {patch} /monitoring/job/text/:id/status Pause or resume a text monitoring job
 */
router.patch(
  "/job/text/:_id/status",
  auth,
  param("_id").isMongoId(),
  body("active").isBoolean(),
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId;

    const { _id } = req.params;
    const { active } = req.body;

    TextMonitoringJob.findById({ _id }, (err, job) => {
      if (err) {
        return res.status(500).json({
          errors: [{ msg: "Could not find the monitoring job." }],
        });
      } else {
        if (job.active === active) {
          return res.status(200).json({
            msg: "The monitoring job is already in the desired state.",
          });
        }

        job.active = active;

        job.save();
        changeStatus(job);
        res.status(200).json({ msg: "Job status changed." });
      }
    });
  }
);

/**
 * @api {delete} /api/job/text/:id Delete a text monitoring job
 */
router.delete(
  "/job/text/:_id",
  auth,
  param("_id").isMongoId(),
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId;

    const { _id } = req.params;

    TextMonitoringJob.findById({ _id, userId }, (err, job) => {
      if (err) {
        return res.status(500).json({
          errors: [{ msg: "Could not find the monitoring job." }],
        });
      } else {
        deleteTextMonitoringJob(job._id);
        job.remove();
        res
          .status(200)
          .json({ msg: "Successfully deleted the monitoring job." });
      }
    });
  }
);

/**
 * @api {get} /api/job/text/:_id Get a single text monitoring job
 */
router.get(
  "/job/text/:_id",
  auth,
  param("_id").isMongoId(),
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId;

    const { _id } = req.params;

    TextMonitoringJob.findById({ _id, userId }, (err, job) => {
      if (err) {
        return res.status(500).json({
          errors: [{ msg: "Could not find the monitoring job." }],
        });
      } else {
        res.status(200).json({ job });
      }
    });
  }
);

/**
 * @api {get} /api/jobs/text Get all visual monitoring jobs for user
 */
router.get(
  "/jobs/text",
  auth,
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId;

    console.log(userId);

    TextMonitoringJob.find({ userId }, (err, jobs) => {
      if (err) {
        return res.status(500).json({
          errors: [{ msg: "Could not find the monitoring jobs." }],
        });
      } else {
        res.status(200).json({ jobs });
      }
    });
  }
);

/**
 * @api {get} /api/jobs/all Get all visual and text monitoring jobs for user
 */
router.get(
  "/jobs/all",
  auth,
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId;

    const jobs = {};

    const visualJobs = await VisualMonitoringJob.find({ userId }).catch(
      (err) => {
        return res.status(500).json({
          errors: [{ msg: "Could not find the visual monitoring jobs." }],
        });
      }
    );

    const textJobs = await TextMonitoringJob.find({ userId }).catch((err) => {
      return res.status(500).json({
        errors: [{ msg: "Could not find the text monitoring jobs." }],
      });
    });

    jobs.visual = visualJobs;
    jobs.text = textJobs;

    res.status(200).json({ jobs });
  }
);

export { router as jobRouter };
