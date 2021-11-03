describe("SSO login", () => {
  it("should be accessible when not logged in", () => {
    cy.visit("/");
    cy.get("[data-testid=login]").click();
    cy.get("h1").should("contain.text", "Feide");
  });
});
