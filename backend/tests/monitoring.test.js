// @ts-nocheck
import fetch from "node-fetch";
import { MonitoringJob } from "../models/monitoringJob.js";
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

describe("Job creation tests", () => {
  test("Create a new visual job", async () => {
    const res = await _fetch(
      "POST",
      "/api/job",
      {
        name: "Visual test job",
        jobType: "visual",
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
        name: "Visual test job",
        jobType: "visual",
        url: "https://example.com",
      },
    });

    expect(job).toBeDefined();
    expect(job.name).toBe("Visual test job");
  });

  test("Job is not created if no URL is provided", async () => {
    const res = await _fetch(
      "POST",
      "/api/job",
      {
        name: "No URL",
        url: "",
        interval: "week",
        jobType: "visual",
      },
      token
    );

    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors[0].msg).toBeDefined();
    expect(data.errors[0].msg).toBe("Invalid value");

    const job = await MonitoringJob.findOne({
      name: "No URL"
    });

    expect(job).toBeNull();
  });

  test("Job is not created if bad interval is provided", async () => {
    const res = await _fetch(
      "POST",
      "/api/job",
      {
        name: "Visual test job",
        url: "https://example.com",
        interval: "googol years",
        jobType: "visual",
      },
      token
    );

    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors[0].msg).toBeDefined();
    expect(data.errors[0].msg).toBe("Please enter a valid interval.");
  });

  test("Job is not created if bad jobType is provided", async () => {
    const res = await _fetch(
      "POST",
      "/api/job",
      {
        name: "Visual test job",
        url: "https://example.com",
        interval: "week",
        jobType: "something else",
      },
      token
    );

    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors[0].msg).toBeDefined();
    expect(data.errors[0].msg).toBe("Invalid value");
  });

  test("Job is not created if no name is provided", async () => {
    const res = await _fetch(
      "POST",
      "/api/job",
      {
        name: "",
        url: "https://example.com",
        interval: "week",
        jobType: "visual",
      },
      token
    );

    expect(res.status).toBe(500);

    const data = await res.json();

    expect(data.errors[0].msg).toBeDefined();
    expect(data.errors[0].msg).toBe("Could not create the monitoring job.");
  });

  test("Job is not created if no jobType is provided", async () => {
    const res = await _fetch(
      "POST",
      "/api/job",
      {
        name: "Visual test job",
        url: "https://example.com",
        interval: "week",
      },
      token
    );

    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors[0].msg).toBeDefined();
    expect(data.errors[0].msg).toBe("Invalid value");
  });

  test("Job is not created if no interval is provided", async () => {
    const res = await _fetch(
      "POST",
      "/api/job",
      {
        name: "Visual test job",
        url: "https://example.com",
        interval: "",
        jobType: "visual",
      },
      token
    );

    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors[0].msg).toBeDefined();
    expect(data.errors[0].msg).toBe("Please enter a valid interval.");
  });
});

describe("Job reading tests", () => {
  test("Get all jobs", async () => {
    const res = await _fetch("GET", "/api/jobs", null, token);

    expect(res.status).toBe(200);

    const data = await res.json();

    expect(data.jobs.length).toBe(1);
    jobID = data.jobs[0]._id;
  });

  test("Get a specific job", async () => {
    const res = await _fetch("GET", `/api/job/${jobID}`, null, token);

    expect(res.status).toBe(200);

    const data = await res.json();

    expect(data.job.name).toBe("Visual test job");
  });

  test("Get a specific job that doesn't exist", async () => {
    const res = await _fetch("GET", "/api/job/1234567890", null, token);

    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors[0].msg).toBeDefined();
    expect(data.errors[0].msg).toBe("Invalid value");
  });
})

describe("Job updating tests", () => {
  test("Update a job", async () => {
    const res = await _fetch(
      "PUT",
      `/api/job/${jobID}`,
      {
        name: "Updated test job",
        url: "https://example.com",
        interval: "week",
        jobType: "visual",
      },
      token
    );

    expect(res.status).toBe(200);

    const data = await res.json();

    expect(data.msg).toBeDefined();
    expect(data.msg).toBe("Successfully updated the monitoring job.");

    const job = await MonitoringJob.findOne({name: "Updated test job"});

    expect(job).toBeDefined();
    expect(job.name).toBe("Updated test job");
  });

  test("Update a job that doesn't exist", async () => {
    const res = await _fetch(
      "PUT",
      "/api/job/1234567890",
      {
        name: "Updated test job",
        url: "https://example.com",
        interval: "week",
        jobType: "visual",
      },
      token
    );

    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors[0].msg).toBeDefined();
    expect(data.errors[0].msg).toBe("Invalid value");
  });
});

describe("Job deleting tests", () => {
  test("Delete a job", async () => {
    const res = await _fetch(
      "DELETE",
      `/api/job/${jobID}`,
      {},
      token
    );

    expect(res.status).toBe(200);

    const data = await res.json();

    expect(data.msg).toBeDefined();
    expect(data.msg).toBe("Successfully deleted the monitoring job.");

    const job = await MonitoringJob.findOne({name: "Updated test job"});

    expect(job).toBeNull();
  });

  test("Delete a job that doesn't exist", async () => {
    const res = await _fetch(
      "DELETE",
      "/api/job/1234567890",
      {},
      token
    );

    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors[0].msg).toBeDefined();
    expect(data.errors[0].msg).toBe("Invalid value");
  });
});
