import express from "express";
import { body, header, param, validationResult } from "express-validator";
import { User } from "../models/user.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { MonitoringJob } from "../models/monitoringJob.js";
import { deleteVisualMonitoringJob } from "../services/visualMonitoringService.js";
import { deleteImage } from "../services/imageService.js";
import { auth } from "../middleware/auth.js";
import { deleteTextMonitoringJob } from "../services/textMonitoringService.js";
import { SiteConfig } from "../models/siteConfig.js";
import "dotenv/config";

const router = express.Router();

/**
 * @api {post} /api/account/signup Sign up a new user
 */
router.post(
  "/account/signup",
  body("username").isString(),
  body("email").isEmail().withMessage("Please enter a valid email address."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Please enter a password with at least 6 characters."),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const siteConfig = await SiteConfig.findOne({});

    if (!siteConfig.openSignup) {
      return res.status(401).json({
        errors: [{ msg: "Signup is not open." }],
      });
    }

    const { username, email, password } = req.body;

    try {
      const user = await User.findOne({ username });

      if (user) {
        return res.status(400).json({
          errors: [{ msg: "An account with this name already exists." }],
        });
      }

      const hash = await argon2.hash(password);

      const newUser = new User({
        username,
        email,
        password: hash,
        isAdmin: process.env.ADMIN_USERNAME === username,
      });

      await newUser.save();

      return res.status(201).json({ msg: "Account created successfully." });
    } catch (err) {
      return res.status(500).json({
        errors: [{ msg: "An error occurred while signing up." }],
      });
    }
  }
);

/**
 * @api {post} /api/account/login Log in a user
 */
router.post(
  "/account/login",
  body("username").isString(),
  body("password").isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(400).json({
          errors: [{ msg: "Invalid credentials." }],
        });
      }

      const match = await argon2.verify(user.password, password);

      if (!match) {
        return res.status(400).json({
          errors: [{ msg: "Invalid credentials." }],
        });
      }

      const payload = {
        user: {
          id: user.id,
          isAdmin: user.isAdmin,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "30d" },
        (err, token) => {
          if (err) {
            return res.status(500).json({
              errors: [{ msg: "An error occurred while signing in." }],
            });
          }

          return res.status(200).json({
            token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
            },
          });
        }
      );
    } catch (err) {
      return res.status(500).json({
        errors: [{ msg: "An error occurred while signing in." }],
      });
    }
  }
);

/**
 * @api {post} /api/account/change-password Change user password
 */
router.post(
  "/account/change-password",
  auth,
  body("username").isString(),
  body("password").isString(),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Please enter a password with at least 6 characters."),
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId;

    const { username, password, newPassword } = req.body;

    try {
      const user = await User.findOne({ _id: userId });

      if (!user) {
        return res.status(400).json({
          errors: [{ msg: "No account with this username exists." }],
        });
      }

      const match = await argon2.verify(user.password, password);

      if (!match) {
        return res.status(400).json({
          errors: [{ msg: "Invalid credentials." }],
        });
      }

      const hash = await argon2.hash(newPassword);

      user.password = hash;
      user.username = username;

      await user.save();

      return res.status(200).json({ msg: "Password changed successfully." });
    } catch (err) {
      return res.status(500).json({
        errors: [{ msg: "Could not change password." }],
      });
    }
  }
);

/**
 * @api {post} /api/account/change-email Change user email
 */
router.post(
  "/account/change-email",
  auth,
  body("username").isString(),
  body("email").isEmail(),
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email } = req.body;

    try {
      const user = await User.findOne({ _id: req.userId, username });

      if (!user) {
        return res.status(400).json({
          errors: [{ msg: "No account with this username exists." }],
        });
      }

      user.email = email;

      await user.save();

      return res.status(200).json({ msg: "Email changed successfully." });
    } catch (err) {
      return res.status(500).json({
        errors: [{ msg: "An error occurred while changing email." }],
      });
    }
  }
);

/**
 * @api {get} /api/account/:id Get account information
 */
router.get("/account/:id", auth, async (req, res) => {
  const userId = req.params.id;

  const user = await User.findOne({ _id: userId });

  if (!user) {
    return res.status(404).json({
      errors: [{ msg: "Account not found." }],
    });
  }

  return res.status(200).json({
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

/**
 * @api {delete} /api/account/:id Delete user account
 */
router.delete(
  "/account/:_id",
  auth,
  param("_id").isMongoId(),
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId;

    if (userId !== req.params._id) {
      return res.status(401).json({
        errors: [{ msg: "You are not authorized to delete this account." }],
      });
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        errors: [{ msg: "Account not found." }],
      });
    }

    const jobs = await MonitoringJob.find({ user: userId });

    if (jobs.length > 0) {
      for (const job of jobs) {
        if (job.jobType === "visual") {
          await deleteVisualMonitoringJob(job._id);

          job.states.forEach(async (state) => {
            if (state.image) {
              await deleteImage(state.image);
            }
            if (state.diff) {
              await deleteImage(state.diff);
            }
          });
        } else {
          await deleteTextMonitoringJob(job._id);
        }

        await job.remove();
      }
    }

    await user.remove();

    return res.status(200).json({ msg: "Account deleted successfully." });
  }
);

export { router as accountRouter };
