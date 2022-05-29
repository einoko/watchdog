// @ts-nocheck
import fetch from "node-fetch";
import { connectToDB, closeDB } from "../db";
import "dotenv/config";

const baseUrl = "http://localhost:3001";

const _fetch = async (method, path, body, token) => {
  body = typeof body === "string" ? body : JSON.stringify(body);
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = token;
  }
  if (method === "GET") {
    return await fetch(baseUrl + path, { method, headers });
  }
  return await fetch(baseUrl + path, { method, body, headers });
};

let token = "";

beforeAll(async () => {
  await connectToDB(process.env.MONGODB_URI);

  const res = await _fetch("POST", "/api/account/login", {
    username: "Test",
    password: "testtesttest",
  });
  expect(res.status).toBe(200);

  const data = await res.json();

  token = data.token;
});

describe("Image preview tests", () => {
  test("Get a preview image with a valid URL", async () => {
    const res = await _fetch(
      "POST",
      "/api/preview/image",
      {
        url: "https://example.com",
      },
      token
    );
    expect(res.status).toBe(200);

    const data = await res.json();

    expect(data.imageData).toBeDefined();
    expect(typeof data.imageData).toBe("string");
  });

  test("Return an error with an invalid URL", async () => {
    const res = await _fetch(
      "POST",
      "/api/preview/image",
      {
        url: "https://4XY5UazbVPdYM85oCyKujXrchU9ER3AF.net",
      },
      token
    );
    expect(res.status).toBe(500);

    const data = await res.json();

    expect(data.errors).toBeDefined();
    expect(data.errors[0]["msg"]).toBe(
      "Could not fetch a screenshot from the given URL."
    );
  });

  test("Return an error if there is no URL in the body", async () => {
    const res = await _fetch("POST", "/api/preview/image", {}, token);
    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors).toBeDefined();
    expect(data.errors[0]["msg"]).toBe("Not a valid URL.");
  });
});

describe("Text preview tests", () => {
  test("Get a preview text with a valid URL", async () => {
    const res = await _fetch(
      "POST",
      "/api/preview/text",
      {
        url: "https://example.com",
      },
      token
    );
    expect(res.status).toBe(200);

    const data = await res.json();

    expect(data.text).toBeDefined();
    expect(typeof data.text).toBe("string");
    expect(data.text.startsWith("Example")).toBe(true);
  });

  test("Return an error with an invalid URL", async () => {
    const res = await _fetch(
      "POST",
      "/api/preview/text",
      {
        url: "https://4XY5UazbVPdYM85oCyKujXrchU9ER3AF.net",
      },
      token
    );
    expect(res.status).toBe(500);

    const data = await res.json();

    expect(data.errors).toBeDefined();
    expect(data.errors[0]["msg"]).toBe(
      "Could not fetch any text from the given URL."
    );
  });

  test("Return an error if there is no URL in the body", async () => {
    const res = await _fetch("POST", "/api/preview/text", {}, token);
    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors).toBeDefined();
    expect(data.errors[0]["msg"]).toBe("Not a valid URL.");
  });
});
