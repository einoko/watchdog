import express from "express";
import { param, validationResult } from "express-validator";
import { VisualMonitoringJob } from "../models/visualMonitoringJob.js";
import { TextMonitoringJob } from "../models/textMonitoringJob.js";
import { verifyJWT } from "../utils/JWTUtil.js";
import { deleteVisualMonitoringJob } from "../services/visualMonitoringService.js";
import { deleteImage } from "../services/imageService.js";
import { deleteTextMonitoringJob } from "../services/textMonitoringService.js";

const router = express.Router();

/**
 * @api {get} /emailCancel/:token Cancel a job via email
 */
router.get(
  "/emailCancel/:token",
  param("token").isBase64(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const token = Buffer.from(req.params.token, "base64").toString("ascii");
    let decoded = verifyJWT(token);

    if (decoded.errors.length > 0) {
      return res.status(401).json({ errors: decoded.errors });
    }

    decoded = decoded.decoded;

    if (decoded.type === "visual") {
      const job = await VisualMonitoringJob.findById({ _id: decoded.id });

      if (!job) {
        return res.status(500).json({
          errors: [{ msg: "Could not find the monitoring job." }],
        });
      }

      deleteVisualMonitoringJob(job._id);

      job.states.forEach((state) => {
        if (state.image) {
          deleteImage(state.image);
        }
        if (state.diff) {
          deleteImage(state.diff);
        }
      });

      job.remove();

      res.status(200).json({ msg: "Successfully deleted the monitoring job." });
    } else if (decoded.type === "text") {
      TextMonitoringJob.findById({ _id: decoded.id }, (err, job) => {
        if (err) {
          return res.status(500).json({
            errors: [{ msg: "Could not find the monitoring job." }],
          });
        } else {
          deleteTextMonitoringJob(job._id);
          job.remove();
          res
            .status(200)
            .json({ msg: "Successfully deleted the monitoring job." });
        }
      });
    } else {
      return res.status(401).json({
        errors: [{ msg: "Job was not deleted." }],
      });
    }
  }
);

export { router as emailCancelRouter };
