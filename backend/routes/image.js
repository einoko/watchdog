import express from "express";
import { param, validationResult } from "express-validator";
import { Image } from "../models/image.js";
import fs from "fs";

const router = express.Router();

/**
 * @api {get} /image/:id Get an image
 */
router.get("/image/:id", param("id").isMongoId(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const imageId = req.params.id;

  Image.findOne({ _id: imageId }, (err, image) => {
    if (err) {
      return res.status(500).json({
        errors: [{ msg: "An error occurred while fetching image." }],
      });
    }

    if (!image) {
      return res.status(404).json({
        errors: [{ msg: "Image not found." }],
      });
    }

    fs.readFile(image.path, (err, data) => {
      if (err) {
        return res.status(500).json({
          errors: [{ msg: "An error occurred while fetching image." }],
        });
      }

      res.writeHead(200, { "Content-Type": "image/png" });
      res.end(data);
    });
  });
});

export { router as imageRouter };
