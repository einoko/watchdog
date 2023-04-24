describe("Admin settings", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get("#username").type("admin");
    cy.get("#password").type("adminadminadmin");
    cy.get("button").contains("Sign in").click();
  });

  it("Admin settings are visible", () => {
    cy.visit("http://localhost:3000/settings");
    cy.contains("Admin settings");
    cy.contains("Open Sign Up");
  });

  it("Can access Admin dashboard", () => {
    cy.visit("http://localhost:3000/admin/dashboard");
    cy.contains("CypressTest");
  });

  it("Can view other users and their jobs", () => {
    cy.visit("http://localhost:3000/admin/dashboard");
    cy.get("tbody > tr:nth-child(3) > td:nth-child(4) > a").click();
    cy.contains("CypressTest");
    cy.contains("User has no jobs yet");
  });

  it("Can delete other users", () => {
    cy.visit("http://localhost:3000/admin/dashboard");
    cy.get("tbody > tr:nth-child(3) > td:nth-child(4) > a").click();
    cy.get("button").contains("Delete user").click();
    cy.get("button").contains("Delete").click();
  });
});
