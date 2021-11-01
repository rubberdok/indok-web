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
const options = {
  method: "POST",
  url: Cypress.env("auth_url"),
  body: {
    username: Cypress.env("auth_username"),
    password: Cypress.env("auth_password"),
    client_id: Cypress.env("auth_client_id"),
    client_secret: Cypress.env("auth_client_secret"),
  },
};

Cypress.Commands.add("login", () => {
  const query = `{authToken}`;
  cy.request({
    method: "POST",
    url: Cypress.env("graphql_endpoint"),
    body: { query },
  }).then((response) => {
    window.document.cookie = `JWT=${response.body.authToken}`;
  });
});
