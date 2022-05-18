import captureWebsite from "capture-website";
import prependHttp from "prepend-http";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
import { convertIDtoFilePath } from "./filePathUtil.js";

const defaultOptions = {
  width: 1280,
  height: 960,
  blockAds: true,
  scaleFactor: 2,
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36",
};

/**
 * Fetches the screenshot of the given URL and returns the Base64 encoded image.
 * @param url URL to fetch the screenshot from.
 * @returns {Promise<string|null>} Base64 encoded image.
 */
export const captureWebsitePreview = async (url) => {
  try {
    return await captureWebsite.base64(prependHttp(url), defaultOptions);
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * Fetches the screenshot of the given URL and saves it to disk.
 * @param url URL to fetch the screenshot from.
 * @returns {Promise<string|null>} File path to the saved image.
 */
export const captureWebsiteToFile = async (url) => {
  const fileID = uuidv4();
  const filePath = convertIDtoFilePath(fileID);

  try {
    await captureWebsite.file(prependHttp(url), filePath, defaultOptions);
    return filePath;
  } catch (error) {
    console.error(error);
    return null;
  }
};
