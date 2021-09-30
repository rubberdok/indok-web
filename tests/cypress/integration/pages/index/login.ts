describe("User Logins", () => {
  it("should prompt registration when not registered", () => {
    cy.log("Accessing site");
    cy.visit("/").then(() => {
      cy.get("h1").should("contain", "Industriell");
      cy.get("[data-testid=login]")
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
    });
    cy.log("Logged in");
  });

  it("should fail", () => {
    cy.log("This test should fail");
    cy.visit("/").then(() => {
      cy.get("h1").should("contain", "Datateknologi");
    });
  });
});
