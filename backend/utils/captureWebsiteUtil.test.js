// @ts-nocheck
import * as captureWebsiteUtil from "./captureWebsiteUtil.js";

describe("Capture website to file", () => {
  test("Capture website from a valid URL", async () => {
    const filePath = await captureWebsiteUtil.captureWebsiteToFile(
      "https://example.com"
    );
    expect(filePath).toMatch(/\.\/files\//);
  });
});
