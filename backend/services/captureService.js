import captureWebsite from "capture-website";
import prependHttp from "prepend-http";

/**
 * Captures a screenshot of a website and returns the image as a buffer.
 * @param {*} url URL of the website to capture.
 * @param {*} additionalOptions Additional options to pass to capture-website.
 * @returns Promise<Buffer> Buffer of the image.
 */
export const captureWebsiteToBuffer = async (url, additionalOptions) => {
  const options = {
    ...additionalOptions,
    width: 1280,
    height: 960,
    blockAds: true,
    scaleFactor: 2,
    type: "png",
    fullPage: false,
    launchOptions: {
      executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
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
