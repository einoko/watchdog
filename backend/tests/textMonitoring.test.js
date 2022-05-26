// @ts-nocheck
import fetch from "node-fetch";
import { TextMonitoringJob } from "../models/textMonitoringJob.js";
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
let jobID = "";

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
  await new Promise((r) => setTimeout(r, 2000));
});

afterAll(async () => {
  await closeDB();
});

describe("Text job creation tests", () => {
  test("Create a new job", async () => {
    const res = await _fetch(
      "POST",
      "/api/job/text",
      {
        name: "Test job",
        url: "https://example.com",
        interval: "week",
        type: "added",
        words: ["example"],
      },
      token
    );

    expect(res.status).toBe(201);

    const data = await res.json();

    expect(data.msg).toBeDefined();
    expect(data.msg).toBe("Successfully created a new monitoring job.");

    const job = await TextMonitoringJob.findOne({
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
      "/api/job/text",
      {
        name: "Test job",
        interval: "week",
        type: "added",
        words: ["example"],
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
      "/api/job/text",
      {
        name: "Test job",
        interval: "googol years",
        url: "https://example.com",
        type: "added",
        words: ["example"],
      },
      token
    );

    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors).toBeDefined();
    expect(data.errors[0]["msg"]).toBe("Please enter a valid interval.");
  });
});

describe("Job reading tests", () => {
  test("Get all jobs", async () => {
    const res = await _fetch("GET", "/api/jobs/text", null, token);

    expect(res.status).toBe(200);

    const data = await res.json();

    expect(data.jobs).toBeDefined();
    expect(data.jobs.length).toBe(1);

    jobID = data.jobs[0]._id;
  });

  test("Get a job by ID", async () => {
    const res = await _fetch("GET", `/api/job/text/${jobID}`, null, token);

    expect(res.status).toBe(200);

    const data = await res.json();

    expect(data.job).toBeDefined();
    expect(data.job._id).toBe(jobID);
  });

  test("Get a job by ID that does not exist", async () => {
    const res = await _fetch("GET", `/api/job/text/123456789`, null, token);

    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors).toBeDefined();
    expect(data.errors[0]["msg"]).toBe("Invalid value");
  });

  test("Get all jobs with bad token", async () => {
    const res = await _fetch("GET", "/api/jobs/text", null, "bad token");

    expect(res.status).toBe(401);

    const data = await res.json();

    expect(data.errors).toBeDefined();
    expect(data.errors[0]["msg"]).toBe("Invalid token.");
  });
});

describe("Job updating tests", () => {
  test("Update a job", async () => {
    const res = await _fetch(
      "PUT",
      `/api/job/text/${jobID}`,
      {
        name: "Test job",
        url: "https://example.com",
        interval: "month",
        type: "added",
        words: ["another"],
      },
      token
    );

    expect(res.status).toBe(200);

    const data = await res.json();

    expect(data.msg).toBeDefined();
    expect(data.msg).toBe("Successfully updated the monitoring job.");

    const job = await TextMonitoringJob.findOne({
      where: {
        id: jobID,
      },
    });

    expect(job).toBeDefined();
    expect(job.interval).toBe("month");
    expect(job.words[0]).toBe("another");
  });

  test("Update a job with bad interval", async () => {
    const res = await _fetch(
      "PUT",
      `/api/job/text/${jobID}`,
      {
        name: "Test job",
        url: "https://example.com",
        interval: "googol years",
        type: "added",
        words: ["example"],
      },
      token
    );

    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors).toBeDefined();
    expect(data.errors[0]["msg"]).toBe("Please enter a valid interval.");
  });

  test("Update a job that does not exist", async () => {
    const res = await _fetch(
      "PUT",
      `/api/job/text/123456789`,
      {
        name: "Test job",
        url: "https://example.com",
        interval: "month",
        type: "added",
        words: ["new"],
      },
      token
    );

    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors).toBeDefined();
    expect(data.errors[0]["msg"]).toBe("Invalid value");
  });

  test("Update a job with bad token", async () => {
    const res = await _fetch(
      "PUT",
      `/api/job/text/${jobID}`,
      {
        name: "Test job",
        url: "https://example.com",
        interval: "week",
        type: "added",
        words: ["example"],
      },
      "bad token"
    );

    expect(res.status).toBe(401);

    const data = await res.json();

    expect(data.errors).toBeDefined();
    expect(data.errors[0]["msg"]).toBe("Invalid token.");
  });
});

describe("Job deletion tests", () => {
  test("Delete a job", async () => {
    const res = await _fetch("DELETE", `/api/job/text/${jobID}`, {}, token);

    expect(res.status).toBe(200);

    const data = await res.json();

    expect(data.msg).toBeDefined();
    expect(data.msg).toBe("Successfully deleted the monitoring job.");

    const job = await TextMonitoringJob.findOne({
      where: {
        id: jobID,
      },
    });

    expect(job).toBeNull();
  });

  test("Delete a job that does not exist", async () => {
    const res = await _fetch("DELETE", `/api/job/text/123456789`, {}, token);

    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors).toBeDefined();
    expect(data.errors[0]["msg"]).toBe("Invalid value");
  });

  test("Delete a job with bad token", async () => {
    const res = await _fetch(
      "DELETE",
      `/api/job/text/${jobID}`,
      {},
      "bad token"
    );

    expect(res.status).toBe(401);

    const data = await res.json();

    expect(data.errors).toBeDefined();
    expect(data.errors[0]["msg"]).toBe("Invalid token.");
  });
});
