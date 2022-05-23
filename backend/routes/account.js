import express from "express";
import { body, validationResult } from "express-validator";
import { User } from "../models/user.js";
import argon2 from "argon2";

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

export { router as accountRouter };
