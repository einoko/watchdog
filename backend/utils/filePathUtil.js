import "dotenv/config";

/**
 * Converts the given ID to a file path on the disk.
 * @param {*} id ID of the image to compare.
 * @returns {string} File path to the image.
 */
export const convertIDtoFilePath = (id) => {
  const filesFolder = process.env.FILES_PATH || "./files";
  return `${filesFolder}/${id}.png`;
};

