// @ts-nocheck
import fetch from "node-fetch";
import { MonitoringJob } from "../models/monitoringJob.js";
import { connectToDB, closeDB } from "../db";
import { executeVisualMonitoringJob } from "../services/visualMonitoringService.js";
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
let job = null;
let originalStates = 0;

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

beforeEach(async () => {
  await new Promise((r) => setTimeout(r, 5000));
});

afterAll(async () => {
  await closeDB();
});

describe("Initial preparation tests", () => {
  test("Create a new visual job", async () => {
    const res = await _fetch(
      "POST",
      "/api/job",
      {
        name: "Random visual test",
        jobType: "visual",
        url: "https://randomword.com",
        threshold: 0.0,
        interval: "week",
      },
      token
    );

    expect(res.status).toBe(201);

    const data = await res.json();

    expect(data.msg).toBeDefined();
    expect(data.msg).toBe("Successfully created a new monitoring job.");

    const job = await MonitoringJob.findOne({ name: "Random visual test" });

    expect(job).toBeDefined();
    expect(job.name).toBe("Random visual test");
  });

  test("Get all jobs", async () => {
    const res = await _fetch("GET", "/api/jobs", null, token);

    expect(res.status).toBe(200);

    const data = await res.json();

    expect(data.jobs.length).toBe(1);
  });
});

describe("Test visual monitoring", () => {
  test("New state was created", async () => {
    const freshJob = await MonitoringJob.findOne({
      name: "Random visual test",
    });
    job = freshJob;
    originalStates = freshJob.states.length;

    expect(originalStates).toBe(1);
  });

  test("Run the job", async () => {
    await executeVisualMonitoringJob(job);
  });

  test("Another state was created", async () => {
    const freshJob = await MonitoringJob.findOne({
      name: "Random visual test",
    });

    expect(freshJob.states.length).toBe(originalStates + 1);
  });
});
