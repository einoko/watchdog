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
  param("token").isString(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const token = req.params.token;

    let job = await VisualMonitoringJob.findOne({ cancelToken: token });

    if (!job) {
      job = await TextMonitoringJob.findOne({ cancelToken: token });

      if (!job) {
        return res.status(400).json({
          errors: [{ msg: "Could not find a job with that token." }],
        });
      }

      deleteTextMonitoringJob(job._id);
      job.remove();
      res
        .status(200)
        .json({ msg: "Successfully canceled the monitoring job." });
    } else {
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

      res
        .status(200)
        .json({ msg: "Successfully canceled the monitoring job." });
    }
  }
);

export { router as emailCancelRouter };
