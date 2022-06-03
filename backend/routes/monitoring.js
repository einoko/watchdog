import express from "express";
import { body, header, param, validationResult } from "express-validator";
import { MonitoringJob, acceptedIntervals } from "../models/monitoringJob.js";
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

/**
 * @api {post} /api/job/visual Create a new visual monitoring job
 */
router.post(
  "/job",
  auth,
  body("name").isString(),
  body("url").isURL(),
  body("jobType").isIn(["visual", "text"]),
  body("interval")
    .isIn(acceptedIntervals)
    .withMessage("Please enter a valid interval."),
  body("threshold").isIn([0.0, 0.01, 0.1, 0.25, 0.5]).optional(),
  body("visual_scrollToElement").optional().isString(),
  body("visual_hideElements").optional().isString(),
  body("visual_crop").optional().isObject(),
  body("text_css").optional().isString(),
  body("text_type").optional().isIn(["any_change", "added", "removed"]),
  body("text_words").optional().isString(),
  header("Authorization").isJWT(),
  async (req, res) => {
    console.log(req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId;

    console.log(req.body);

    await MonitoringJob.create({ userId, ...req.body }, (err, job) => {
      if (err) {
        return res.status(500).json({
          errors: [{ msg: "Could not create the monitoring job." }],
        });
      } else {
        if (job.jobType === "visual") {
          createVisualMonitoringJob(job);
        } else if (job.jobType === "text") {
          createTextMonitoringJob(job);
        }

        return res.status(201).json({
          msg: "Successfully created a new monitoring job.",
        });
      }
    });
  }
);

/**
 * @api {get} /api/job/:id Get a job
 */
router.get(
  "/job/:id",
  auth,
  param("id").isMongoId(),
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId;
    const jobId = req.params.id;

    if (userId === null) {
      return res.status(401).json({
        errors: [{ msg: "Not authorized." }],
      });
    }

    MonitoringJob.findOne({ _id: jobId }, (err, job) => {
      if (err) {
        return res.status(500).json({
          errors: [{ msg: "Could not find the monitoring job." }],
        });
      }

      if (!job) {
        return res.status(404).json({
          errors: [{ msg: "Could not find the monitoring job." }],
        });
      }

      if (job.userId.toString() !== userId && req.isAdmin === false) {
        return res.status(401).json({
          errors: [{ msg: "You are not authorized to view this job." }],
        });
      } else {
        return res.status(200).json({
          job,
        });
      }
    });
  }
);

/**
 * @api {get} /api/jobs Get all jobs
 */
router.get("/jobs", auth, header("Authorization").isJWT(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.userId;

  MonitoringJob.find({ userId }, (err, jobs) => {
    if (err) {
      return res.status(500).json({
        errors: [{ msg: "Could not find the monitoring jobs." }],
      });
    } else {
      return res.status(200).json({
        jobs,
      });
    }
  });
});

/**
 * @api {update} /api/job/visual/:id Change the settings of a visual monitoring job
 */
router.put(
  "/job/:_id",
  auth,
  param("_id").isMongoId(),
  body("name").isString().optional(),
  body("interval")
    .isIn(acceptedIntervals)
    .withMessage("Please enter a valid interval.")
    .optional(),
  body("threshold").isIn([0.0, 0.01, 0.1, 0.25, 0.5]).optional(),
  body("visual_scrollToElement").optional().isString(),
  body("visual_hideElements").optional().isString(),
  body("visual_crop").optional().isObject(),
  body("text_css").optional().isString(),
  body("text_type").optional().isIn(["any_change", "added", "removed"]),
  body("text_words").optional().isArray(),
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId;

    const _id = req.params._id;

    req.body.states = [];

    // Update the job
    MonitoringJob.findOneAndUpdate(
      { _id, userId },
      { $set: req.body },
      { new: true },
      (err, job) => {
        if (err) {
          return res.status(500).json({
            errors: [{ msg: "Could not update the monitoring job." }],
          });
        } else if (!job) {
          return res.status(404).json({
            errors: [{ msg: "Could not find the monitoring job." }],
          });
        } else {
          if (job.jobType === "visual") {
            deleteVisualMonitoringJob(job);
            createVisualMonitoringJob(job);
          } else if (job.jobType === "text") {
            deleteTextMonitoringJob(job);
            createTextMonitoringJob(job);
          }

          return res.status(200).json({
            msg: "Successfully updated the monitoring job.",
          });
        }
      }
    );
  }
);

/**
 * @api {patch} /monitoring/job/visual/:id/status Pause or resume a job.
 */
router.patch(
  "/job/:_id/status",
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

    MonitoringJob.findById({ _id }, (err, job) => {
      if (err) {
        return res.status(500).json({
          errors: [{ msg: "Could not find the monitoring job." }],
        });
      } else {
        if (job.userId.toString() !== userId && req.isAdmin === false) {
          return res.status(401).json({
            errors: [{ msg: "You are not authorized to pause this job." }],
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
 * @api {delete} /api/job/visual/:id Delete a job
 */
router.delete(
  "/job/:_id",
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
    const job = await MonitoringJob.findById(_id);

    if (!job) {
      return res.status(500).json({
        errors: [{ msg: "Could not find the monitoring job." }],
      });
    }

    if (job.userId.toString() !== userId && req.isAdmin === false) {
      return res.status(401).json({
        errors: [
          { msg: "You are not authorized to delete this monitoring job." },
        ],
      });
    }

    if (job.jobType === "visual") {
      await deleteVisualMonitoringJob(job._id);

      job.states.forEach((state) => {
        if (state.image) {
          deleteImage(state.image);
        }
        if (state.diff) {
          deleteImage(state.diff);
        }
      });
    } else {
      await deleteTextMonitoringJob(job._id);
    }

    job.remove();

    res.status(200).json({ msg: "Successfully deleted the monitoring job." });
  }
);

export { router as jobRouter };
