describe("Change settings", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get("#username").type("Test");
    cy.get("#password").type("testtest");
    cy.get("button").contains("Sign in").click();
  });

  it("Change email", () => {
    cy.visit("http://localhost:3000/settings");
    cy.get("#email").clear();
    cy.get("#email").type("test@test.com");
    cy.get("button").contains("Change Email").click();
    cy.contains("Email changed successfully.");
  });

  it("Verify email has changed", () => {
    cy.visit("http://localhost:3000/settings");
    cy.get("#email").should("have.value", "test@test.com");
  });

  it("Should not contain Admin settings", () => {
    cy.visit("http://localhost:3000/settings");
    cy.get("a").contains("Open admin dashboard").should("not.exist");
  })
});
