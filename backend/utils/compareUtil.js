import fs from "fs";
import pixelmatch from "pixelmatch";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { PNG } from "pngjs";
import { convertIDtoFilePath } from "./filePathUtil.js";

// Matching threshold of pixelmatch
const threshold = 0.1;

/**
 * Return a PNGObject of an image.
 * @param path Path to the image.
 * @returns {*} PNGObject of an image.
 */
const getPNGObject = (path) => {
  if (fs.existsSync(path)) {
    return PNG.sync.read(fs.readFileSync(path));
  } else {
    throw new Error("Image does not exist");
  }
};

/**
 * Calculate the difference between two images.
 * @param path1 Path to the first image to compare.
 * @param path2 Path to the second image to compare.
 * @returns {number|null} Difference (in percentage) between two images (0.0 - 1.0)
 */
export const calculateDifference = (path1, path2) => {
  try {
    const img1 = getPNGObject(path1);
    const img2 = getPNGObject(path2);

    const { width, height } = img1;
    const diff = new PNG({ width, height });

    const mismatch = pixelmatch(
      img1.data,
      img2.data,
      diff.data,
      width,
      height,
      {
        threshold: threshold,
      }
    );

    return mismatch / (width * height);
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Produce a diff image of two images and save it to disk. (ID1: old, ID2: new)
 * @param path1 Path to the first image to compare.
 * @param path2 Path to the second image to compare.
 * @returns {Promise<string|null>} Filepath of the diff image.
 */
export const createDiffImage = async (path1, path2) => {
  try {
    const img1 = getPNGObject(path1);
    const img2 = getPNGObject(path2);

    const { width, height } = img1;
    const diff = new PNG({ width, height });

    pixelmatch(img1.data, img2.data, diff.data, width, height, {
      threshold: threshold,
      diffColor: [250, 100, 125],
      diffMask: true,
    });

    const diffImageID = uuidv4();
    const diffFilePath = convertIDtoFilePath(diffImageID);

    await sharp(path2)
      .composite([{ input: PNG.sync.write(diff), blend: "screen" }])
      .toFile(diffFilePath)

    return diffFilePath;
  } catch (error) {
    console.error(error);
    return null;
  }
};