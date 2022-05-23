// @ts-nocheck
import fetch from "node-fetch";

const baseUrl = "http://localhost:3000";

const _fetch = async (method, path, body) => {
  body = typeof body === "string" ? body : JSON.stringify(body);
  const headers = { "Content-Type": "application/json" };
  return await fetch(baseUrl + path, { method, body, headers });
};

describe("CaptureWebsiteUtil tests", () => {
  test("Get a preview image with a valid URL", async () => {
    const res = await _fetch("POST", "/api/preview", {
      url: "https://example.com",
    });
    expect(res.status).toBe(200);

    const data = await res.json();

    expect(data.imageData).toBeDefined();
    expect(typeof data.imageData).toBe("string");
  });

  test("Return an error with an invalid URL", async () => {
    const res = await _fetch("POST", "/api/preview", {
      url: "https://4XY5UazbVPdYM85oCyKujXrchU9ER3AF.net",
    });
    expect(res.status).toBe(500);

    const data = await res.json();

    expect(data.errors).toBeDefined();
    expect(data.errors[0]["msg"]).toBe(
      "Could not fetch a screenshot from the given URL."
    );
  });

  test("Return an error if there is no URL in the body", async () => {
    const res = await _fetch("POST", "/api/preview", {});
    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors).toBeDefined();
    expect(data.errors[0]["msg"]).toBe("Invalid value");
  });
});
