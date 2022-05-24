// @ts-nocheck
import {jest} from '@jest/globals'
import { getWebsiteText } from "../services/textService.js";

describe("Get Website Text tests", () => {
  test("Get the text of a website (valid URL)", async () => {
    jest.useFakeTimers();
    const text = await getWebsiteText("https://example.com");

    expect(text).toBeDefined();
    expect(typeof text).toBe("string");
    expect(text).toContain("Example Domain");
  });

  test("Return null if the URL is invalid (or no text captured)", async () => {
    jest.useFakeTimers();
    const text = await getWebsiteText(
      "https://4XY5UazbVPdYM85oCyKujXrchU9ER3AF.net"
    );

    expect(text).toBe(null);
  });
});
