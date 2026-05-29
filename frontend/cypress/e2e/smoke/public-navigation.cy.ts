import { getVisibleByTestId } from "../helpers/feide";

describe("Public navigation smoke", () => {
  it("loads the landing page", () => {
    cy.visit("/");
    cy.contains("h1", /Industriell Økonomi/i).should("be.visible");
    getVisibleByTestId("app-bar-login").should("be.visible");
  });

  it("navigates to about page from app bar", () => {
    cy.visit("/");
    cy.contains("a", /^Om oss$/)
      .filter(":visible")
      .first()
      .click();
    cy.url().should("include", "/about");
    cy.contains(/Om oss|Hovedstyret|Organisasjon/i).should("be.visible");
  });
});
