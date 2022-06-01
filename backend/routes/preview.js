import express from "express";
import { body, header, validationResult } from "express-validator";
import { captureWebsiteToBuffer } from "../services/captureService.js";
import { Preview } from "../models/preview.js";
import { User } from "../models/user.js";
import { verifyJWT } from "../utils/JWTUtil.js";
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

    const userToken = verifyJWT(req.headers.authorization);

    if (userToken.errors.length > 0) {
      return res.status(401).json({ errors: userToken.errors });
    }

    const userId = userToken.decoded.user.id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({
        errors: [{ msg: "No account with this username exists." }],
      });
    }

    const { url, scrollToElement, hideElements } = req.body;

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

    const preview = await captureWebsiteToBuffer(url, additionalOptions);

    await Preview.create({ userId, url, success: preview !== null });

    switch (preview) {
      case null:
        return res.status(500).json({
          errors: [{ msg: "Could not fetch a screenshot from the given URL.", param: "url" }],
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

    const userToken = verifyJWT(req.headers.authorization);

    if (userToken.errors.length > 0) {
      return res.status(401).json({ errors: userToken.errors });
    }

    const userId = userToken.decoded.user.id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({
        errors: [{ msg: "No account with this username exists." }],
      });
    }

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
