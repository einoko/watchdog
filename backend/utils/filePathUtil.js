import "dotenv/config";

export const convertIDtoFilePath = (id) => {
  const filesFolder = process.env.FILES_PATH || "./files"
  return `${filesFolder}/${id}.png`;
}