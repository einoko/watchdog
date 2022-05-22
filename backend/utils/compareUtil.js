import pixelmatch from "pixelmatch";
import sharp from "sharp";
import { PNG } from "pngjs";
import { saveImage } from "../services/imageService.js";

// Matching threshold of pixelmatch
const threshold = 0.1;

export const calculateDifference = async (oldBuffer, newBuffer) => {
  try {
    const oldPNG = PNG.sync.read(oldBuffer);
    const newPNG = PNG.sync.read(newBuffer);

    const { width, height } = oldPNG;
    const diff = new PNG({ width, height });

    const mismatch = pixelmatch(
      oldPNG.data,
      newPNG.data,
      diff.data,
      width,
      height,
      {
        threshold,
      }
    );

    return mismatch / (width * height);
  } catch (error) {
    return null;
  }
};

export const createDiffImage = async (oldBuffer, newBuffer) => {
  try {
    const oldPNG = PNG.sync.read(oldBuffer);
    const newPNG = PNG.sync.read(newBuffer);

    const { width, height } = oldPNG;
    const diff = new PNG({ width, height });

    pixelmatch(oldPNG.data, newPNG.data, diff.data, width, height, {
      threshold: threshold,
      diffColor: [250, 100, 125],
      diffMask: true,
    });

    const diffImageBuffer = await sharp(newBuffer)
      .composite([{ input: PNG.sync.write(diff), blend: "screen" }])
      .toBuffer();

    return diffImageBuffer;
  } catch (error) {
    console.error(error);
    return null;
  }
};
