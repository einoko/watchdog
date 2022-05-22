import { v4 as uuidv4 } from "uuid";
import { convertIDtoFilePath } from "../utils/filePathUtil.js";
import { saveBufferToFile } from "./fileService.js";
import { Image } from "../models/image.js";

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
