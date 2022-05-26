// @ts-nocheck
import fetch from "node-fetch";

const baseUrl = "http://localhost:3001";

const _fetch = async (method, path, body, token) => {
  body = typeof body === "string" ? body : JSON.stringify(body);
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = token;
  }
  return await fetch(baseUrl + path, { method, body, headers });
};

beforeEach(async () => {
  await new Promise((r) => setTimeout(r, 2000));
});

let userId = "";
let token = "";

describe("Account creation tests", () => {
  test("Create a new account", async () => {
    const res = await _fetch("POST", "/api/account/signup", {
      username: "RustyShackleford",
      email: "rusty@shackleford.com",
      password: "password",
    });
    expect(res.status).toBe(201);

    const data = await res.json();

    expect(data.msg).toBeDefined();
    expect(data.msg).toBe("Account created successfully.");
  });

  test("Account is not created if password is not at least 6 characters", async () => {
    const res = await _fetch("POST", "/api/account/signup", {
      username: "RustyShackleford",
      email: "rusty@shackleford.com",
      password: "pass",
    });
    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors).toBeDefined();
    expect(data.errors[0]["msg"]).toBe(
      "Please enter a password with at least 6 characters."
    );
  });

  test("Account is not created if the user already exists", async () => {
    const res = await _fetch("POST", "/api/account/signup", {
      username: "RustyShackleford",
      email: "rusty@shackleford.com",
      password: "password",
    });

    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors).toBeDefined();
    expect(data.errors[0]["msg"]).toBe(
      "An account with this name already exists."
    );
  });
});

describe("Login tests", () => {
  test("After a succesful login user gets a token", async () => {
    const res = await _fetch("POST", "/api/account/login", {
      username: "RustyShackleford",
      password: "password",
    });
    expect(res.status).toBe(200);

    const data = await res.json();

    userId = data.user.id;
    token = data.token;

    expect(data.token).toBeDefined();
  });

  test("Login fails if the username is invalid", async () => {
    const res = await _fetch("POST", "/api/account/login", {
      username: "aaaaaaaaa",
      password: "password",
    });
    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors).toBeDefined();
    expect(data.errors[0]["msg"]).toBe("Invalid credentials.");
  });

  test("Login fails if the password is invalid", async () => {
    const res = await _fetch("POST", "/api/account/login", {
      username: "RustyShackleford",
      password: "",
    });

    expect(res.status).toBe(400);

    const data = await res.json();

    expect(data.errors).toBeDefined();
    expect(data.errors[0]["msg"]).toBe("Invalid credentials.");
  });
});

describe("Password change test", () => {
  test("Change password", async () => {
    const res = await _fetch(
      "PUT",
      "/api/account",
      {
        username: "RustyShackleford",
        password: "password",
        newPassword: "newpassword",
      },
      token
    );

    expect(res.status).toBe(200);

    const data = await res.json();

    expect(data.msg).toBeDefined();
    expect(data.msg).toBe("Password changed successfully.");
  });

  test("Login with a changed password", async () => {
    const res = await _fetch("POST", "/api/account/login", {
      username: "RustyShackleford",
      password: "newpassword",
    });

    expect(res.status).toBe(200);

    const data = await res.json();

    expect(data.token).toBeDefined();
  });
});

describe("Account deletion tests", () => {
  test("Delete account", async () => {
    const res = await _fetch(
      "DELETE",
      `/api/account/${userId}`,
      {
        username: "RustyShackleford",
      },
      token
    );

    expect(res.status).toBe(200);

    const data = await res.json();

    expect(data.msg).toBeDefined();
    expect(data.msg).toBe("Account deleted successfully.");
  });
});
