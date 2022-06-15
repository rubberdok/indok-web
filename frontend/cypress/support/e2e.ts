// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      login: () => Chainable<Response<{ body: { data: { username: string } } }>>;
      getByTestId: (testId: string) => Chainable<Element>;
    }
  }
}

Cypress.Commands.add("login", () => {
  cy.request("GET", `${Cypress.env("API_URL")}/test-session/`).then((res) =>
    cy.log(`Logged in as ${res.body.username}`)
  );
});

Cypress.Commands.add("getByTestId", (testId: string) => {
  return cy.get(`[data-test-id=${testId}]`);
});
