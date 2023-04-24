import express from "express";
import { param, validationResult } from "express-validator";
import { Image } from "../models/image.js";
import sharp from "sharp";
import fs from "fs";

const router = express.Router();

/**
 * @api {get} /image/:id Get an image
 */
router.get("/image/:id", param("id").isMongoId(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const imageId = req.params.id;

  const image = await Image.findOne({ _id: imageId });

  if (!image) {
    return res.status(404).json({
      errors: [{ msg: "Image not found." }],
    });
  }

  const data = fs.readFileSync(image.path);

  // Compress image using JPEG
  try {
    const buffer = await sharp(data)
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toBuffer();

    res.set("Content-Type", "image/jpeg");
    res.send(buffer);
  } catch (err) {
    return res.status(500).json({
      errors: [{ msg: "An error occurred while fetching image." }],
    });
  }
});

export { router as imageRouter };
