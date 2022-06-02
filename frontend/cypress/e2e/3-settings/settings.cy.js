describe("Change settings", () => {
  it("Change email", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("#username").type("Test");
    cy.get("#password").type("testtest");
    cy.get("button").contains("Sign in").click();
    cy.visit("http://localhost:3000/settings");
    cy.get("#email").clear();
    cy.get("#email").type("test@test.com");
    cy.get("button").contains("Change Email").click();
    cy.contains("Email changed successfully.");
  });

  it("Verify email has changes", () => {
    cy.visit("http://localhost:3000/login");
    cy.get("#username").type("Test");
    cy.get("#password").type("testtest");
    cy.get("button").contains("Sign in").click();
    cy.visit("http://localhost:3000/settings");
    cy.get("#email").should("have.value", "test@test.com");
  });
});
