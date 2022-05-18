import captureWebsite from 'capture-website';
import prependHttp from 'prepend-http';

/**
 * Fetches the screenshot of the given URL and returns the Base64 encoded image.
 * @param url URL to fetch the screenshot from.
 * @returns {Promise<string|null>} Base64 encoded image.
 */
const captureWebsitePreview = async (url) => {
  const options = {
    width: 1280,
    height: 960,
    blockAds: true,
    scaleFactor: 2,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
  };

  try {
    return await captureWebsite.base64(prependHttp(url), options);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default captureWebsitePreview;