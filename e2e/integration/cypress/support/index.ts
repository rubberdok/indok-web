// in cypress/support/index.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(): Chainable<Element>;
  }
}

Cypress.Commands.add("login", () => {
  const query = `{authToken}`;
  cy.request("POST", `${Cypress.env("API_URL")}/graphql/`, { query });
});
