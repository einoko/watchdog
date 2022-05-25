import { v4 as uuidv4 } from "uuid";
import { convertIDtoFilePath } from "../utils/filePathUtil.js";
import {
  deleteFileFromPath,
  readFileFromPath,
  saveBufferToFile,
} from "./fileService.js";
import { Image } from "../models/image.js";
import sharp from "sharp";

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
};

export const compressImage = async (imageID) => {
  const image = await Image.findById(imageID);
  const imageBuffer = readFileFromPath(image.path);
  const compressedImageBuffer = await sharp(imageBuffer)
    .resize({ width: 680 })
    .toFormat("jpeg", { mozjpeg: true })
    .toBuffer();
  return compressedImageBuffer;
};


export const getFullLink = (imageID) => {
  return `${process.env.APP_URL}/api/image/${imageID}`;
}
