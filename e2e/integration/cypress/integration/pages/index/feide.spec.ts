describe("SSO login", () => {
  it("should be accessible when not logged in", () => {
    cy.visit("/");
    cy.getByTestId("login").click();
    cy.get("h1").should("contain.text", "Feide");
  });

  it("should not prompt registration registered", () => {
    cy.log("Accessing site");
    cy.visit("/").then(() => {
      cy.get("h1").should("contain", "Industriell");
      cy.getByTestId("[data-testid=login]")
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
    cy.get("h4").contains("Eva Student Åsen").should("exist");
    cy.log("Logged in");
  });
});
