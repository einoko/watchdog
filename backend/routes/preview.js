import express from "express";
import { body, header, validationResult } from "express-validator";
import { captureWebsiteToBuffer } from "../services/captureService.js";
import { Preview } from "../models/preview.js";
import { verifyJWT } from "../utils/JWTUtil.js";

const router = express.Router();

/**
 * @api {post} /preview Fetch a preview of a website and return it in Base64 data.
 */
router.post(
  "/preview",
  body("url").isURL(),
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

    const { url } = req.body;
    const preview = await captureWebsiteToBuffer(url);

    Preview.create({ userId, url, success: preview !== null });

    switch (preview) {
      case null:
        return res.status(500).json({
          errors: [{ msg: "Could not fetch a screenshot from the given URL." }],
        });
      default:
        return res
          .status(200)
          .json({
            imageData: Buffer.from(preview).toString("base64"),
          })
          .send();
    }
  }
);

export { router as previewRouter };
