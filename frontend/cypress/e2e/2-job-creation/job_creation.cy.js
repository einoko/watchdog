describe("Create jobs", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get("#username").type("Test");
    cy.get("#password").type("testtest");
    cy.get("button").contains("Sign in").click();
  });

  it("should create a job", () => {
    cy.get("#name").type("Test job");
    cy.get("#url").type("https://randomword.com/");
    cy.get("button").contains("Start monitoring").click();
    cy.url().should("include", "/jobs");
    cy.contains("Test job");
  });

  it("job should be active", () => {
    cy.visit("http://localhost:3000/jobs");
    cy.contains("a", "Test job").click();
    cy.contains("Active");
  });

  it("should create the first state", () => {
    cy.wait(10000);
    cy.visit("http://localhost:3000/jobs");
    cy.contains("a", "Test job").click();
    cy.contains("Job created");
    cy.contains("Latest screenshot");
  });

  it("should pause a job", () => {
    cy.visit("http://localhost:3000/jobs");
    cy.contains("a", "Test job").click();
    cy.contains("Pause job").click();
    cy.contains("Resume job");
  });

  it("should resume a job", () => {
    cy.visit("http://localhost:3000/jobs");
    cy.contains("a", "Test job").click();
    cy.contains("Resume job").click();
    cy.contains("Pause job");
  });

  it("should detect a change", () => {
    cy.wait(10000);
    cy.visit("http://localhost:3000/jobs");
    cy.contains("a", "Test job").click();
    cy.contains("Difference detected");
    cy.contains("Detected 1 change so far");
  });

  it("should delete a job", () => {
    cy.visit("http://localhost:3000/jobs");
    cy.contains("a", "Test job").click();
    cy.contains("Delete job").click();
    cy.get("#confirm_delete").click();
    cy.url().should("include", "/jobs");
  });
});
