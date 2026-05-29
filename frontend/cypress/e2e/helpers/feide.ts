export const getByTestId = (
  testId: string,
  options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>
) => cy.get(`[data-test-id="${testId}"]`, options);

export const getVisibleByTestId = (
  testId: string,
  options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>
) => getByTestId(testId, options).filter(":visible").first();

export const loginViaFeide = () => {
  return cy.env(["FEIDE_USERNAME", "FEIDE_PASSWORD"]).then((env) => {
    const username = String(env.FEIDE_USERNAME ?? "").trim();
    const password = String(env.FEIDE_PASSWORD ?? "").trim();

    if (!username || !password) {
      throw new Error("Missing FEIDE_USERNAME or FEIDE_PASSWORD Cypress env variables");
    }

    cy.visit("/");
    getVisibleByTestId("app-bar-login").click();

    cy.origin("https://auth.dataporten.no", () => {
      cy.get(".login-providers li:nth-child(2)").click();
    });

    cy.origin("https://idp.feide.no", { args: { username, password } }, ({ username, password }) => {
      Cypress.on("uncaught:exception", (err) => {
        const message = err?.message ?? "";
        if (
          message.includes("publickey-credentials-get") ||
          message.includes("feature is not enabled in this document")
        ) {
          return false;
        }
        return true;
      });

      cy.get("#username", { timeout: 120000 }).clear().type(username);
      cy.get("#password").clear().type(password, { log: false });
      cy.get("[type=submit]").click();
    });
  });
};

export const ensureFeideSession = () => {
  return cy.env(["FEIDE_USERNAME"]).then((env) => {
    const username = String(env.FEIDE_USERNAME ?? "").trim();

    cy.session(
      `feide:${username}`,
      () => {
        loginViaFeide();
        cy.url({ timeout: 120000 }).should("include", "/");
      },
      {
        validate: () => {
          cy.visit("/profile");
          getByTestId("profile-personal-name", { timeout: 120000 }).should("be.visible");
        },
      }
    );
  });
};
