import fs from "fs";

export const saveBufferToFile = (buffer, filePath) => {
  fs.writeFileSync(filePath, buffer);
};

export const readFileFromPath = (filePath) => {
  return fs.readFileSync(filePath);
};

export const deleteFileFromPath = (filePath) => {
  fs.unlinkSync(filePath);
}
