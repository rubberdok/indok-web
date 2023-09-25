describe("SSO login", () => {
  it("should not prompt registration as a registered user", () => {
    cy.session("asbjørn_elevg", () => {
      cy.log("Accessing site");
      cy.visit("/");
      cy.getByTestId("app-bar-login").click();
      cy.origin("https://auth.dataporten.no", () => {
        cy.log("Logging in");
        cy.get(".login-providers li:nth-child(2)").click();
      });
      cy.origin("https://feide.no", () => {
        cy.get("[id=username]").type("asbjorn_elevg");
        cy.get("[id=password]").type("098asd");
        cy.get("button").get("[type=submit]").click();
      });
      cy.contains("[data-test-id=profile-personal-name]", "Asbjørn ElevG Hansen");
      cy.log("Logged in");
    });
  });

  it("should prompt registration when not registered", () => {
    cy.session("cecilie_elevvgs", () => {
      cy.log("Accessing site");
      cy.visit("/");
      cy.getByTestId("app-bar-login").click();
      cy.origin("https://auth.dataporten.no", () => {
        cy.log("Logging in");
        cy.get(".login-providers li:nth-child(2)").click();
      });
      cy.origin("https://feide.no", () => {
        cy.get("[id=username]").type("cecilie_elevvgs");
        cy.get("[id=password]").type("098asd");
        cy.get("button").get("[type=submit]").click();
      });
      cy.getByTestId("registerUser-title").should("contain.text", "Registrering");
      cy.getByTestId("registerUser-firstNameTextField").within(() => cy.get("input").clear().type("Abba"));
      cy.getByTestId("registerUser-lastNameTextField").within(() => cy.get("input").clear().type("Baab"));
      cy.getByTestId("registerUser-saveButton").click();
      cy.contains("[data-test-id=profile-personal-name]", "Abba Baab");
    });
  });
});
