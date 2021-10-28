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

Cypress.Commands.add("ssoUserLogin", () => {
  return new Cypress.Promise((resolve, reject) => {
    const ssoUserLogin = async () => {
      const params = new URLSearchParams();
      params.append("username", `${username}`);
      params.append("password", `${password}`);

      const response = await fetch(`${ssoUserLoginUrl}`, {
        method: "POST",
        body: params,
      }).then((res) => {
        if (!res.ok) {
          reject(res.statusText);
        }
        return res;
      });
      return response;
    };
    ssoUserLogin().then(resolve);
  });
});
