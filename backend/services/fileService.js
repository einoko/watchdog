import fs from "fs";
import fastFolderSize from "fast-folder-size/sync.js";

export const saveBufferToFile = (buffer, filePath) => {
  fs.writeFileSync(filePath, buffer);
};

export const readFileFromPath = (filePath) => {
  return fs.readFileSync(filePath);
};

export const deleteFileFromPath = (filePath) => {
  fs.unlinkSync(filePath);
};

export const getSizeOfFolder = (folderPath) => {
  return fastFolderSize(folderPath);
};
