import express from "express";
import { body, header, validationResult } from "express-validator";
import { captureWebsiteToBuffer } from "../services/captureService.js";
import { Preview } from "../models/preview.js";
import { getWebsiteText } from "../services/textService.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/**
 * @api {post} /preview Fetch a preview of a website and return it in Base64 data.
 */
router.post(
  "/preview/image",
  auth,
  body("url").isURL().withMessage("Not a valid URL."),
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId;

    const { url, scrollToElement, hideElements, disableJavaScript } = req.body;

    const additionalOptions = {};

    if (scrollToElement) {
      additionalOptions.scrollToElement = {
        element: scrollToElement,
        offset: 0,
        offsetFrom: "top",
      };
    }

    if (hideElements) {
      additionalOptions.hideElements = hideElements;
    }

    if (disableJavaScript) {
      additionalOptions.isJavaScriptEnabled = false;
    }

    const preview = await captureWebsiteToBuffer(url, additionalOptions);

    await Preview.create({ userId, url, success: preview !== null });

    if (!preview) {
      return res.status(500).json({
        errors: [{ msg: "Could not fetch an image from the given URL." }],
      });
    }

    const imageData = preview.toString("base64");

    // Return as a JSON blob so Firefox can display it
    return res
      .status(200)
      .header({
        "Content-Type": "application/json",
      })
      .json({
        imageData: `data:image/png;base64,${imageData}`,
      })
      .send();
  }
);

router.post(
  "/preview/text",
  auth,
  body("url").isURL().withMessage("Not a valid URL."),
  header("Authorization").isJWT(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.userId;

    const { url, textCSS } = req.body;

    const fullText = await getWebsiteText(url, textCSS);

    await Preview.create({ userId, url, success: fullText !== null });

    switch (fullText) {
      case null:
        return res.status(500).json({
          errors: [{ msg: "Could not fetch any text from the given URL." }],
        });
      default:
        return res
          .status(200)
          .json({
            text: fullText,
          })
          .send();
    }
  }
);

export { router as previewRouter };
