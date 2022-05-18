import { captureWebsitePreview } from "../utils/captureWebsiteUtil.js";

const getPreview = async (url) => {
  return await captureWebsitePreview(url);
};

export default getPreview;
