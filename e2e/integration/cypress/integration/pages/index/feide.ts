describe("SSO login", () => {
  it("should be accessible when not logged in", () => {
    cy.visit("/");
    cy.get("[data-testid=login]").click();
    cy.get("h1").should("contain.text", "Feide");
  });

  it("attempt to access api", () => {
    cy.visit("http://localhost:8000/graphql");
    cy.get("[id=editor]").should("exist");
  });
});
