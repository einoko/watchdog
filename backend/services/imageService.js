import { v4 as uuidv4 } from "uuid";
import { convertIDtoFilePath } from "../utils/filePathUtil.js";
import { deleteFileFromPath, saveBufferToFile } from "./fileService.js";
import { Image } from "../models/image.js";
import fs from "fs";

/**
 * Saves image buffer to disk and database.
 * @param {*} imageBuffer
 * @returns Object of the saved image.
 */
export const saveImage = async (imageBuffer) => {
  const filePath = convertIDtoFilePath(uuidv4());
  saveBufferToFile(imageBuffer, filePath);

  const image = new Image({
    path: filePath,
  });
  await image.save();

  return image;
};

/**
 * Deletes image from disk and database.
 * @param {*} imageID ID of the image to delete.
 */
export const deleteImage = async (imageID) => {
  const image = await Image.findById(imageID);
  deleteFileFromPath(image.path);
  await image.remove();
}

/**
 * Reads image from disk and returns it as a buffer.
 * @param {*} imageID ID of the image to read.
 * @returns Buffer of the image.
 */
export const readImage = async (imageID) => {
  const image = await Image.findById(imageID);
  if (!image) {
    console.error(`Could not find image with ID ${imageID}`);
    return null;
  }

  const imagePath = image.path;

  if (!fs.existsSync(imagePath)) {
    console.error(`Image ${imageID} not found`);
    return null;
  } else {
    const imageBuffer = fs.readFileSync(imagePath);
    return imageBuffer;
  }
};
