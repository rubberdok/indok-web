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
  cy.request({
    method: "POST",
    url: Cypress.env("graphql_endpoint"),
    body: { query },
  }).then((response) => {
    console.log(response);
    window.document.cookie = `JWT=${response.body.data.authToken}`;
  });
});
