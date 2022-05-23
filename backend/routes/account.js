import express from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/user.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const router = express.Router();

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

router.post(
  "/account/signin",
  body("email").isEmail(),
  body("password"),
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
              Authorization: token,
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

export { router as accountRouter };
