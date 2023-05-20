import captureWebsite from "capture-website";
import prependHttp from "prepend-http";
import fetch from "node-fetch";

const queryNames = {
  scrollToElement: "scroll_to_element",
  hideElements: "hide_elements",
  isJavaScriptEnabled: "javascript_enabled",
};

const getParams = (url, additionalOptions) => {
  const params = new URLSearchParams();

  params.append("url", prependHttp(url));

  if (additionalOptions) {
    Object.keys(additionalOptions).forEach((key) => {
      params.append(queryNames[key], additionalOptions[key]);
    });
  }

  return params;
};

/**
 * Captures a screenshot of a website and returns the image as a buffer.
 * @param {*} url URL of the website to capture.
 * @param {*} additionalOptions Additional options to pass to capture-website.
 * @returns Promise<Buffer> Buffer of the image.
 */
export const captureWebsiteToBuffer = async (url, additionalOptions) => {
  const params = getParams(url, additionalOptions);

  try {
    const buffer = await fetch(
      `http://archiver:8081/screenshot?${params.toString()}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => Buffer.from(arrayBuffer));
    return buffer;
  } catch (error) {
    return null;
  }
};
