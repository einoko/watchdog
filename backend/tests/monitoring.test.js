// @ts-nocheck
import fetch from "node-fetch";
import { MonitoringJob } from "../models/monitoringJob";
import { connectToDB } from "../db";
import "dotenv/config";

const baseUrl = "http://localhost:3000";

const _fetch = async (method, path, body, token) => {
  body = typeof body === "string" ? body : JSON.stringify(body);
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = token;
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

describe("Job creation tests", () => {
  test("Create a new job", async () => {
    const res = await _fetch(
      "POST",
      "/api/job",
      {
        name: "Test job",
        url: "https://example.com",
        interval: "week",
      },
      token
    );

    expect(res.status).toBe(201);

    const data = await res.json();

    expect(data.msg).toBeDefined();
    expect(data.msg).toBe("Successfully created a new monitoring job.");

    const job = await MonitoringJob.findOne({
      where: {
        name: "Test job",
        url: "https://example.com",
      },
    });

    expect(job).toBeDefined();
    expect(job.name).toBe("Test job");
  });

  test("Job is not created if no URL is provided", async () => {
    const res = await _fetch(
      "POST",
      "/api/job",
      {
        name: "Test job",
        interval: "week",
      },
      token
    );

    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors).toBeDefined();
    expect(data.errors[0]["msg"]).toBe("Invalid value");
  });

  test("Job is not created if bad interval is provided", async () => {
    const res = await _fetch(
      "POST",
      "/api/job",
      {
        name: "Test job",
        interval: "googol years",
        url: "https://example.com",
      },
      token
    );

    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors).toBeDefined();
    expect(data.errors[0]["msg"]).toBe("Please enter a valid interval.");
  });
});
