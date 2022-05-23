// @ts-nocheck
import * as compareUtil from "../utils/compareUtil.js";
import { captureWebsiteToBuffer } from "../services/captureService.js";

describe("Calculate difference between two images", () => {
  test("Difference is calculated for two valid images", async () => {
    const image1 = await captureWebsiteToBuffer("https://example.com");
    const image2 = await captureWebsiteToBuffer("https://google.com");

    const difference = await compareUtil.calculateDifference(image1, image2);
    expect(difference).toBeGreaterThan(0.1);
  });

  test("Null is returned if images were not compared", async () => {
    const image1 = await captureWebsiteToBuffer("https://example.com");
    const image2 = null;

    const difference = await compareUtil.calculateDifference(image1, image2);
    expect(difference).toBe(null);
  });
});

describe("Create a diff image", () => {
  test("Diff image is created for two valid images", async () => {
    const image1 = await captureWebsiteToBuffer("https://example.com");
    const image2 = await captureWebsiteToBuffer("https://google.com");

    const diffImage =  compareUtil.createDiffImage(image1, image2);
    expect(diffImage).toBeDefined();
  });

  test("Null is returned if images were not compared", async () => {
    const image1 = await captureWebsiteToBuffer("https://example.com");
    const image2 = null;

    const diffImage = await compareUtil.createDiffImage(image1, image2);
    expect(diffImage).toBe(null);
  });
});
