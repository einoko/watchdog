import fs from "fs";

export const saveBufferToFile = (buffer, filePath) => {
  fs.writeFileSync(filePath, buffer);
};

export const deleteFileFromPath = (filePath) => {
  fs.unlinkSync(filePath);
}
