// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

declare namespace Cypress {
  interface Chainable {
    login(): Chainable<Response<{ body: { data: { authToken: string } } }>>;
    getByTestId(testId: string): Chainable<Element>;
  }
}

Cypress.Commands.add("login", () => {
  const query = `{authToken}`;
  cy.log("Logging in...");
  cy.request("POST", `${Cypress.env("API_URL")}/graphql/`, { query }).then(
    (res) => cy.log(`Logged in with token ${res.body.data.authToken}`)
  );
});

Cypress.Commands.add("getByTestId", (testId: string) => {
  return cy.get(`[data-test-id=${testId}]`);
});
