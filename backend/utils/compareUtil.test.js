// @ts-nocheck
import * as compareUtil from "./compareUtil.js";

describe("Calculate difference between two images", () => {
  test("Difference is calculated for two valid images", async () => {
    const image1 = "./test_files/082d8515-6e60-4306-aac5-53b5f9980d1e.png";
    const image2 = "./test_files/c506284f-486f-4fe4-9eca-3c90b9ed6f49.png";

    const difference = compareUtil.calculateDifference(image1, image2);
    expect(difference).toBeGreaterThan(0.03);
  });

  test("Null is returned if images were not compared", async () => {
    const image1 = "./test_files/aaa.png";
    const image2 = "./test_files/bbb.png";

    const difference = compareUtil.calculateDifference(image1, image2);
    expect(difference).toBe(null);
  });
});
