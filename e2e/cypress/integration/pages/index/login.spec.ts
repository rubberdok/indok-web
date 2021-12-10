describe("User Logins", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce("JWT");
  });

  it("should prompt registration when not registered", () => {
    cy.log("Accessing site");
    cy.visit("/profile").then(() => {
      cy.getByTestId("profile-personal-name").should("contain.text", "Eva Student Åsen");
    });
  });
});
