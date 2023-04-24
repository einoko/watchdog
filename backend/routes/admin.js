import express from "express";
import { body, header, param, validationResult } from "express-validator";
import { User } from "../models/user.js";
import { MonitoringJob } from "../models/monitoringJob.js";
import { deleteVisualMonitoringJob } from "../services/visualMonitoringService.js";
import { deleteImage } from "../services/imageService.js";
import { deleteTextMonitoringJob } from "../services/textMonitoringService.js";
import "dotenv/config";
import { getSizeOfFolder } from "../services/fileService.js";
import { SiteConfig } from "../models/siteConfig.js";
import { auth } from "../middleware/auth.js";
import { sendTestMail } from "../services/mailService.js";

const router = express.Router();

/**
 * @api {get} /admin/users Get all users
 */
router.get(
  "/admin/users",
  auth,
  header("Authorization").isJWT(),
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const isAdmin = req.isAdmin;

    if (!isAdmin) {
      return res.status(401).json({
        errors: [{ msg: "You are not authorized to perform this action." }],
      });
    }

    User.find({}, (err, users) => {
      if (err) {
        return res.status(500).json({
          errors: [{ msg: "Could not fetch users from the database." }],
        });
      }

      return res.status(200).json({ users });
    });
  }
);

/**
 * @api {get} /admin/user/:id Get a single user and all their jobs
 */
router.get(
  "/admin/user/:id",
  auth,
  param("id").isMongoId(),
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const isAdmin = req.isAdmin;
    const userIdFromUrl = req.params.id;

    if (!isAdmin) {
      return res.status(401).json({
        errors: [{ msg: "Not authorized." }],
      });
    }

    User.findOne({ _id: userIdFromUrl }, (err, user) => {
      if (err) {
        return res.status(500).json({
          errors: [{ msg: "User not found in the database." }],
        });
      }

      MonitoringJob.find({ userId: userIdFromUrl }, (err, jobs) => {
        if (err) {
          return res.status(500).json({
            errors: [{ msg: "Could not fetch jobs from the database." }],
          });
        }

        return res.status(200).json({
          user,
          jobs,
        });
      });
    });
  }
);

/**
 * @api {delete} /admin/user/:id Delete a user
 */
router.delete(
  "/admin/user/:id",
  auth,
  param("id").isMongoId(),
  header("Authorization").isJWT(),
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId;
    const isAdmin = req.isAdmin;

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
  auth,
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const isAdmin = req.isAdmin;

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

/**
 * @api {post} /admin/site-config Update site configuration
 */
router.post(
  "/admin/site-config",
  auth,
  header("Authorization").isJWT(),
  body("openSignup").isBoolean().optional(),
  body("mailService").isString().optional(),
  body("mailUser").isString().optional(),
  body("mailPass").isString().optional(),
  body("mailFrom").isString().optional(),
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const isAdmin = req.isAdmin;

    if (!isAdmin) {
      return res.status(401).json({
        errors: [{ msg: "Not authorized." }],
      });
    }

    SiteConfig.findOneAndUpdate(
      {},
      {
        $set: req.body,
      },
      { new: true },
      (err, siteConfig) => {
        if (err) {
          return res.status(500).json({
            errors: [{ msg: "Could not update site configuration." }],
          });
        }

        return res.status(200).json({
          siteConfig,
        });
      }
    );
  }
);

/**
 * @api {get} /admin/site-config Get site config
 */
router.get(
  "/admin/site-config",
  auth,
  header("Authorization").isJWT(),
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const isAdmin = req.isAdmin;

    if (!isAdmin) {
      return res.status(401).json({
        errors: [{ msg: "Not authorized." }],
      });
    }

    SiteConfig.findOne({}, (err, siteConfig) => {
      if (err) {
        return res.status(500).json({
          errors: [{ msg: "Could not fetch site config from the database." }],
        });
      }

      return res.status(200).json({
        siteConfig,
      });
    });
  }
);

/**
 * @api {post} /admin/test-email Test email configuration
 */
router.post(
  "/admin/test-email",
  auth,
  header("Authorization").isJWT(),
  body("mailService").isString(),
  body("mailUser").isString(),
  body("mailPass").isString(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const isAdmin = req.isAdmin;

    if (!isAdmin) {
      return res.status(401).json({
        errors: [{ msg: "Not authorized." }],
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        errors: [{ msg: "User not found." }],
      });
    }

    const { mailService, mailUser, mailPass, mailFrom } = req.body;

    const mailResponse = await sendTestMail(
      user.email,
      mailService,
      mailUser,
      mailPass,
      mailFrom
    );

    if (mailResponse.error) {
      return res.status(500).json({
        errors: [{ msg: mailResponse.error.response }],
      });
    } else {
      return res.status(200).json({
        msg: "Test mail sent successfully.",
      });
    }
  }
);

export { router as adminRouter };
