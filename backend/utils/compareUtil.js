import pixelmatch from "pixelmatch";
import sharp from "sharp";
import { PNG } from "pngjs";

// Matching threshold of pixelmatch
const threshold = 0.1;

/**
 * Calculates the pixel difference between two images.
 * @param {*} oldBuffer Buffer of the old image.
 * @param {*} newBuffer Buffer of the new image.
 * @returns Promise{number} Difference (0.0-1.0) between the two images.
 */
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

/**
 * Create a diff image from two images.
 * @param {*} oldBuffer Buffer of the old image.
 * @param {*} newBuffer Buffer of the new image.
 * @returns Buffer of the diff image.
 */
export const createDiffImage = async (oldBuffer, newBuffer) => {
  try {
    const oldPNG = PNG.sync.read(oldBuffer);
    const newPNG = PNG.sync.read(newBuffer);

    const { width, height } = oldPNG;
    const diff = new PNG({ width, height });

    pixelmatch(oldPNG.data, newPNG.data, diff.data, width, height, {
      threshold,
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
