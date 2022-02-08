describe("On the profile page", () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce("JWT");
  });

  it("should be able to update personal information", () => {
    cy.log("Accessing site");
    cy.visit("/profile");
    cy.getByTestId("profile-personal-name").should("contain.text", "Eva Student Åsen");
    cy.getByTestId("profile-personal-link").click();
    cy.getByTestId("editUser-firstNameTextField").within(() => cy.get("input").clear().type("Newname"));
    cy.getByTestId("editUser-saveButton").click();
    cy.getByTestId("editUser-successSnackbar").should("exist");
    cy.visit("/profile");
    cy.getByTestId("profile-personal-name").should("contain.text", "Newname");
  });
});
