describe("User Logins", () => {
  before(() => {
    cy.login();
  });

  it("should prompt registration when not registered", () => {
    cy.log("Accessing site");
    cy.visit("/profile").then(() => {
      cy.get("h4").contains("Eva Student Åsen").should("exist");
    });
  });
});
