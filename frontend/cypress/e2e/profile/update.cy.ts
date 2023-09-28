describe("On the profile page", () => {
  before(() => {
    it("should not prompt registration as a registered user", () => {
      cy.session("asbjørn_elevg", () => {
        cy.log("Accessing site");
        cy.visit("/");
        cy.getByTestId("app-bar-login").click();
        cy.origin("https://auth.dataporten.no", () => {
          cy.log("Logging in");
          cy.get(".login-providers li:nth-child(2)").click();
        });
        cy.origin("https://idp.feide.no", () => {
          cy.get("[id=username]").type("eva_student");
          cy.get("[id=password]").type("098asd");
          cy.get("button").get("[type=submit]").click();
        });
      });
    });

    it("should be able to update personal information", () => {
      cy.log("Accessing site");
      cy.visit("/profile");
      //cy.getByTestId("profile-personal-name").should("contain.text", "Eva Student Åsen");
      cy.getByTestId("profile-personal-link").click();
      cy.getByTestId("editUser-firstNameTextField").within(() => cy.get("input").clear().type("Newname"));
      cy.getByTestId("editUser-saveButton").click();
      cy.getByTestId("editUser-successSnackbar").should("exist");
      cy.visit("/profile");
      cy.getByTestId("profile-personal-name").should("contain.text", "Newname");
    });
  });
});
