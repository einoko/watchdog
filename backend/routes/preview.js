import express from "express";
import { body, validationResult } from "express-validator";
import getPreview from "../controllers/previewController.js";
const router = express.Router();

router.post("/preview", body("url").isURL(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { url } = req.body;
  const preview = await getPreview(url);

  if (preview === null) {
    return res
      .status(500)
      .json({ errors: [{ msg: "Could not fetch a screenshot from the given URL." }] });
  } else {
    return res.status(200).json({
      imageData: preview,
    }).send();
  }
});

export { router as previewRouter };
