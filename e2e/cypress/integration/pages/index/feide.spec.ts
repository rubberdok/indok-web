describe("SSO login", () => {
  it("should not prompt registration as a registered user", () => {
    cy.session("asbjørn_elevg", () => {
      cy.log("Accessing site");
      cy.visit("/").then(() => {
        cy.getByTestId("login").click();
        cy.log("Logging in");
        cy.clearCookies();
        cy.clearCookies();
        cy.reload();
        cy.contains("Feide test users")
          .click()
          .then(() => {
            cy.get("[id=username]").type("asbjorn_elevg");
            cy.get("[id=password]").type("1qaz");
          });
        cy.get("button").get("[type=submit]").click();
        cy.getByTestId("profile-personal-name").should("contain.text", "Asbjørn ElevG Hansen");
        cy.log("Logged in");
      });
    });
  });

  it("should prompt registration when not registered", () => {
    cy.session("cecilie_elevvgs", () => {
      cy.log("Accessing site");
      cy.visit("/");
      cy.getByTestId("login").click();
      cy.log("Logging in");
      cy.contains("Feide test users").click();
      cy.get("[id=username]").type("cecilie_elevvgs");
      cy.get("[id=password]").type("3edc");
      cy.get("button").get("[type=submit]").click();
      cy.getByTestId("registerUser-title").should("contain.text", "Registrering");
      cy.getByTestId("registerUser-firstNameTextField").within(() => cy.get("input").clear().type("Abba"));
      cy.getByTestId("registerUser-lastNameTextField").within(() => cy.get("input").clear().type("Baab"));
      cy.getByTestId("registerUser-saveButton").click();
      cy.getByTestId("profile-personal-name").should("contain.text", "Abba Baab");
    });
  });
});
