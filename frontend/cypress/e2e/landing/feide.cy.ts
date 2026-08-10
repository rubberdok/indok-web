describe("SSO login", () => {
  const loginViaFeide = (username: string, password: string) => {
    cy.origin("https://auth.dataporten.no", () => {
      cy.log("Logging in");
      cy.get(".login-providers li:nth-child(2)").click();
    });

    cy.origin("https://idp.feide.no", { args: { username, password } }, ({ username, password }) => {
      Cypress.on("uncaught:exception", (err) => {
        const message = err?.message ?? "";
        if (
          message.includes("publickey-credentials-get") ||
          message.includes("feature is not enabled in this document")
        ) {
          return false;
        }
        return true;
      });

      cy.get("[id=username]").type(username);
      cy.get("[id=password]").type(password);
      cy.get("[type=submit]").click();
    });
  };

  it("should not prompt registration as a registered user", () => {
    cy.session("asbjørn_elevg", () => {
      cy.log("Accessing site");
      cy.visit("/");
      cy.getByTestId("app-bar-login").click();
      loginViaFeide("asbjorn_elevg", "098asd");
      cy.contains("[data-test-id=profile-personal-name]", "Asbjørn ElevG Hansen");
      cy.log("Logged in");
    });
  });

  it("should prompt registration when not registered", () => {
    cy.session("cecilie_elevvgs", () => {
      cy.log("Accessing site");
      cy.visit("/");
      cy.getByTestId("app-bar-login").click();
      loginViaFeide("cecilie_elevvgs", "098asd");

      cy.get("body").then(($body) => {
        if ($body.find("[data-test-id=registerUser-title]").length > 0) {
          cy.getByTestId("registerUser-title").should("contain.text", "Registrering");
          cy.getByTestId("registerUser-firstNameTextField").within(() => {
            cy.get("input").clear();
            cy.get("input").type("Abba");
          });
          cy.getByTestId("registerUser-lastNameTextField").within(() => {
            cy.get("input").clear();
            cy.get("input").type("Baab");
          });
          cy.getByTestId("registerUser-saveButton").click();
          cy.contains("[data-test-id=profile-personal-name]", "Abba Baab");
        } else {
          cy.getByTestId("profile-personal-name").should("exist");
        }
      });
    });
  });
});
