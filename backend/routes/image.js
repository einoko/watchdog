import express from "express";
import { param, validationResult } from "express-validator";
import { Image } from "../models/image.js";
import sharp from "sharp";
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

      // Resize image to low quality JPEG
      sharp(data)
        .toFormat("jpeg")
        .jpeg({ quality: 50 })
        .toBuffer((err, buffer) => {
          if (err) {
            return res.status(500).json({
              errors: [{ msg: "An error occurred while fetching image." }],
            });
          }

          res.set("Content-Type", "image/jpeg");
          res.send(buffer);
        });
    });
  });
});

export { router as imageRouter };
