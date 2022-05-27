import captureWebsite from "capture-website";
import prependHttp from "prepend-http";

const defaultOptions = {
  width: 1280,
  height: 960,
  blockAds: true,
  scaleFactor: 2,
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36",
};

/**
 * Captures a screenshot of a website and returns the image as a buffer.
 * @param {*} url URL of the website to capture.
 * @param {*} additionalOptions Additional options to pass to capture-website.
 * @returns Promise<Buffer> Buffer of the image.
 */
export const captureWebsiteToBuffer = async (url, additionalOptions) => {
  const options = {
    ...defaultOptions,
    ...additionalOptions,
  };

  try {
    const buffer = await captureWebsite.buffer(prependHttp(url), options);
    return buffer;
  } catch (error) {
    if (
      error.message.includes("Error: failed to find element matching selector")
    ) {
      // In case of a bad CSS selector, we try again without the CSS selector.
      delete options.scrollToElement;
      return captureWebsiteToBuffer(url, options);
    }
    return null;
  }
};
