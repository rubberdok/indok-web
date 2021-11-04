describe("User Logins", () => {
  before(() => {
    Cypress.Cookies.debug(true);
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce("JWT");
  });

  it("should prompt registration when not registered", () => {
    cy.login();
    cy.log("Accessing site");
    cy.getCookies();
    cy.visit("/profile").then(() => {
      cy.get("h4").contains("Eva Student Åsen").should("exist");
    });
    cy.getCookies();
  });
});
