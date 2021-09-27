describe("My First Test", () => {
  it("Does not do much!", () => {
    cy.visit("http://localhost:3000/").then(() => {
      cy.get("h1").should("contain", "Industriell");
      cy.get("[data-testid=login]")
        .click()
        .then(() => {
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
  });
});
