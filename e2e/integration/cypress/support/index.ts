// in cypress/support/index.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(): Chainable<Element>;
    getByTestId(testId: string): Chainable<Element>;
  }
}

Cypress.Commands.add("login", () => {
  const query = `{authToken}`;
  cy.request("POST", `${Cypress.env("API_URL")}/graphql/`, { query });
});

Cypress.Commands.add("getByTestId", (testId: string) => {
  return cy.get(`[data-test-id=${testId}]`);
});
