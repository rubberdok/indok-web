describe("Protected profile route", () => {
  it("redirects unauthenticated users to Feide", () => {
    cy.visit("/profile", { failOnStatusCode: false });
    cy.url().should("include", "auth.dataporten.no");
  });
});
