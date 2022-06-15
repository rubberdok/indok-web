Cypress.Commands.add("login", () => {
  cy.request("GET", `${Cypress.env("API_URL")}/test-session/`).then((res) =>
    cy.log(`Logged in as ${res.body.username}`)
  );
});

Cypress.Commands.add("getByTestId", (testId: string) => {
  return cy.get(`[data-test-id=${testId}]`);
});
