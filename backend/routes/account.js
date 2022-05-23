import express from "express";
import { body, header, validationResult } from "express-validator";
import { User } from "../models/user.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { verifyJWT } from "../utils/JWTUtil.js";
import { MonitoringJob } from "../models/monitoringJob.js";
import { deleteMonitoringJob } from "../services/monitoringService.js";
import { deleteImage } from "../services/imageService.js";

const router = express.Router();

/**
 * @api {post} /api/account/signup Sign up a new user
 */
router.post(
  "/account/signup",
  body("email").isEmail().withMessage("Please enter a valid email address."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Please enter a password with at least 6 characters."),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    User.findOne({ email }, (err, user) => {
      if (err) {
        return res.status(500).json({
          errors: [{ msg: "An error occurred while signing up." }],
        });
      }

      if (user) {
        return res.status(400).json({
          errors: [{ msg: "An account with this email already exists." }],
        });
      }

      argon2.hash(password).then((hash) => {
        const newUser = new User({
          email,
          password: hash,
        });

        newUser.save((err) => {
          if (err) {
            return res.status(500).json({
              errors: [{ msg: "An error occurred while signing up." }],
            });
          }

          return res.status(201).json({ msg: "Account created successfully." });
        });
      });
    });
  }
);

/**
 * @api {post} /api/account/login Log in a user
 */
router.post(
  "/account/login",
  body("email").isEmail().withMessage("Please enter a valid email address."),
  body("password").isString(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    User.findOne({ email }, (err, user) => {
      if (err) {
        return res.status(500).json({
          errors: [{ msg: "An error occurred while signing in." }],
        });
      }

      if (!user) {
        return res.status(400).json({
          errors: [{ msg: "No account with this email exists." }],
        });
      }

      argon2.verify(user.password, password).then((match) => {
        if (!match) {
          return res.status(400).json({
            errors: [{ msg: "Invalid credentials." }],
          });
        }

        const payload = {
          user: {
            id: user.id,
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
                email: user.email,
              },
            });
          }
        );
      });
    });
  }
);

/**
 * @api {put} /api/account Change user password
 */
router.put(
  "/account",
  body("email").isEmail(),
  body("password").isString(),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Please enter a password with at least 6 characters."),
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

    const { email, password, newPassword } = req.body;

    User.findOne({ _id: userId }, (err, user) => {
      if (err) {
        return res.status(500).json({
          errors: [{ msg: "User not found in the database." }],
        });
      }

      if (!user) {
        return res.status(400).json({
          errors: [{ msg: "No account with this email exists." }],
        });
      }

      argon2.verify(user.password, password).then((match) => {
        if (!match) {
          return res.status(400).json({
            errors: [{ msg: "Invalid credentials." }],
          });
        }

        argon2.hash(newPassword).then((hash) => {
          user.password = hash;
          user.email = email;

          user.save((err) => {
            if (err) {
              return res.status(500).json({
                errors: [{ msg: "An error occurred while saving password." }],
              });
            }

            return res
              .status(200)
              .json({ msg: "Password changed successfully." });
          });
        });
      });
    });
  }
);

/**
 * @api {delete} /api/account Delete user account
 */
router.delete("/account", header("Authorization").isJWT(), (req, res) => {
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
  });

  // Delete all monitoring jobs and files associated with the user
  MonitoringJob.find({ user: userId }, (err, jobs) => {
    if (err) {
      return res.status(500).json({
        errors: [{ msg: "An error occurred while deleting account." }],
      });
    }
    if (jobs.length > 0) {
      for (const job of jobs) {
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
      }
    }
  });

  User.findOne({ _id: userId }, (err, user) => {
    if (err) {
      return res.status(500).json({
        errors: [{ msg: "User not found in the database." }],
      });
    }

    user.remove((err) => {
      if (err) {
        return res.status(500).json({
          errors: [{ msg: "An error occurred while deleting account." }],
        });
      }

      return res.status(200).json({ msg: "Account deleted successfully." });
    });
  });
});

export { router as accountRouter };