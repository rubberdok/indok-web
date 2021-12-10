describe("SSO login", () => {
  it("should not prompt registration registered", () => {
    cy.log("Accessing site");
    cy.visit("/").then(() => {
      cy.getByTestId("hero-title").should("contain.text", "Industriell Økonomi og Teknologiledelse");
      cy.getByTestId("login")
        .click()
        .then(() => {
          cy.log("Logging in");
          cy.contains("Feide test users")
            .click()
            .then(() => {
              cy.get("[id=username]").type("eva_student");
              cy.get("[id=password]").type("5tgb");
            })
            .then(() => {
              cy.get("button").get("[type=submit]").click();
            });
        });
      cy.getByTestId("profile-fullName").should("contain.text", "Eva Student Åsen");
      cy.log("Logged in");
    });
  });

  it("should prompt registration when not registered", () => {
    cy.log("Accessing site");
    cy.visit("/").then(() => {
      cy.getByTestId("login")
        .click()
        .then(() => {
          cy.log("Logging in");
          cy.contains("Feide test users")
            .click()
            .then(() => {
              cy.get("[id=username]").type("cecilie_elevvgs");
              cy.get("[id=password]").type("3edc");
            })
            .then(() => {
              cy.get("button").get("[type=submit]").click();
            });
        });
    });
    cy.getByTestId("registerUser-title").should("contain.text", "Registrering");
    cy.getByTestId("registerUser-firstNameTextField").get("input").clear().type("Abba");
    cy.getByTestId("registerUser-lastNameTextField").get("input").clear().type("Baab");
    cy.getByTestId("registerUser-saveButton").click();
    cy.getByTestId("profile-personal-name").should("contain.text", "Abba Baab");
  });
});
