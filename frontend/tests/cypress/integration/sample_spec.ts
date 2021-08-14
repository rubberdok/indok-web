describe("My First Test", () => {
  it("Does not do much!", () => {
    cy.visit("http://localhost:3000/").then(() => {
      cy.get("h1").should("contain", "Industriell");
    });
  });
});
