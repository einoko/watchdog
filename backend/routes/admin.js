import express from "express";
import { header, param, validationResult } from "express-validator";
import { verifyJWT } from "../utils/JWTUtil.js";
import { User } from "../models/user.js";
import { MonitoringJob } from "../models/monitoringJob.js";
import { deleteVisualMonitoringJob } from "../services/visualMonitoringService.js";
import { deleteImage } from "../services/imageService.js";
import { deleteTextMonitoringJob } from "../services/textMonitoringService.js";
import fs from "fs";
import path from "path";
import "dotenv/config";
import { getSizeOfFolder } from "../services/fileService.js";

const router = express.Router();

/**
 * @api {get} /admin/users Get all users
 */
router.get("/admin/users", header("Authorization").isJWT(), (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userToken = verifyJWT(req.headers.authorization);

  if (userToken.errors.length > 0) {
    return res.status(401).json({ errors: userToken.errors });
  }

  const userId = userToken.decoded.user.id;

  User.findOne({ _id: userId }, (err, user) => {
    if (err) {
      return res.status(500).json({
        errors: [{ msg: "User not found in the database." }],
      });
    }

    if (!user) {
      return res.status(401).json({
        errors: [{ msg: "You are not authorized to view this page." }],
      });
    }

    if (user.isAdmin) {
      User.find({}, (err, users) => {
        if (err) {
          return res.status(500).json({
            errors: [{ msg: "Could not fetch users from the database." }],
          });
        }

        return res.status(200).json({ users });
      });
    } else {
      return res.status(401).json({
        errors: [{ msg: "Not authorized." }],
      });
    }
  });
});

/**
 * @api {get} /admin/user/:id Get a single user and all their jobs
 */
router.get(
  "/admin/user/:id",
  param("id").isMongoId(),
  header("Authorization").isJWT(),
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userToken = verifyJWT(req.headers.authorization);

    if (userToken.errors.length > 0) {
      return res.status(401).json({ errors: userToken.errors });
    }

    const userId = userToken.decoded.user.id;
    const userIdFromUrl = req.params.id;

    User.findOne({ _id: userId }, (err, user) => {
      if (err) {
        return res.status(500).json({
          errors: [{ msg: "User not found in the database." }],
        });
      }

      if (user.isAdmin) {
        User.findOne({ _id: userIdFromUrl }, (err, user) => {
          if (err) {
            return res.status(500).json({
              errors: [{ msg: "User not found in the database." }],
            });
          }

          MonitoringJob.find({ userId: userIdFromUrl }, (err, jobs) => {
            if (err) {
              return res.status(500).json({
                errors: [
                  { msg: "Could not fetch jobs from the database." },
                ],
              });
            }

            return res.status(200).json({
              user,
              jobs,
            });
          });
        });
      } else {
        return res.status(401).json({
          errors: [{ msg: "Not authorized." }],
        });
      }
    });
  }
);

/**
 * @api {delete} /admin/user/:id Delete a user
 */
router.delete(
  "/admin/user/:id",
  param("id").isMongoId(),
  header("Authorization").isJWT(),
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userToken = verifyJWT(req.headers.authorization);

    if (userToken.errors.length > 0) {
      return res.status(401).json({ errors: userToken.errors });
    }

    const userId = userToken.decoded.user.id;

    User.findOne({ _id: userId }, (err, user) => {
      if (err) {
        return res.status(500).json({
          errors: [{ msg: "User not found in the database." }],
        });
      }

      if (user.isAdmin) {
        User.findOneAndRemove({ _id: req.params.id }, (err, user) => {
          if (err) {
            return res.status(500).json({
              errors: [{ msg: "Could not delete user from the database." }],
            });
          }

          // Delete all jobs associated with the user
          MonitoringJob.find({ user: req.params.id }, (err, jobs) => {
            if (err) {
              return res.status(500).json({
                errors: [
                  { msg: "Could not fetch visual jobs from the database." },
                ],
              });
            }

            if (jobs.length > 0) {
              for (const job of jobs) {
                if (job.jobType === "visual") {
                  deleteVisualMonitoringJob(job._id);

                  job.states.forEach((state) => {
                    if (state.image) {
                      deleteImage(state.image);
                    }
                    if (state.diff) {
                      deleteImage(state.diff);
                    }
                  });
                } else {
                  deleteTextMonitoringJob(job._id);
                }

                job.remove();
              }
            }
          });
          return res.status(200).json({
            msg: "User deleted successfully.",
          });
        });
      } else {
        return res.status(401).json({
          errors: [{ msg: "Not authorized." }],
        });
      }
    });
  }
);

/**
 * @api {get} /admin/statistics Get statistics
 */
router.get(
  "/admin/statistics",
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
    const isAdmin = userToken.decoded.user.isAdmin;

    if (!isAdmin) {
      return res.status(401).json({
        errors: [{ msg: "Not authorized." }],
      });
    }

    const userCount = await User.countDocuments();
    const jobCount = await MonitoringJob.countDocuments();

    const visualJobCount = await MonitoringJob.countDocuments({
      jobType: "visual",
    });

    const textJobCount = await MonitoringJob.countDocuments({
      jobType: "text",
    });

    const imageFolderSize = getSizeOfFolder(process.env.FILES_PATH);

    return res.status(200).json({
      userCount,
      jobCount,
      visualJobCount,
      textJobCount,
      imageFolderSize,
    });
  }
);

export { router as adminRouter };
