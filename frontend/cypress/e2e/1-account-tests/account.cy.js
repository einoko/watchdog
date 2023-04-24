describe("Login", () => {
  it("should login with valid credentials", () => {
    cy.visit("localhost:3000/login");
    cy.get("#username").type("Test");
    cy.get("#password").type("testtest");
    cy.get("button").contains("Sign in").click();
    cy.contains("New monitoring job");
  });

  it("should login with invalid credentials", () => {
    cy.visit("localhost:3000/login");
    cy.get("#username").type("Test");
    cy.get("#password").type("testtesttest");
    cy.get("button").contains("Sign in").click();
    cy.contains("Invalid credentials");
  });
});

describe("Signup", () => {
  it("should signup with valid credentials", () => {
    cy.visit("localhost:3000/register");
    cy.get("#username").type("CypressTest");
    cy.get("#email").type("test@email.com");
    cy.get("#password").type("testtest");
    cy.get("button").contains("Sign up").click();
    cy.contains("Account created");
  });

  it("should not create an account if the username exists", () => {
  cy.visit("localhost:3000/register");
    cy.get("#username").type("CypressTest");
    cy.get("#email").type("test@email.com");
    cy.get("#password").type("testtest");
    cy.get("button").contains("Sign up").click();
    cy.contains("An account with this name already exists");
  });

  it("should not create an with too short password", () => {
    cy.visit("localhost:3000/register");
      cy.get("#username").type("CypressTest");
      cy.get("#email").type("test@email.com");
      cy.get("#password").type("test");
      cy.get("button").contains("Sign up").click();
      cy.contains("Please enter a password with at least 6 characters");
    });
});
