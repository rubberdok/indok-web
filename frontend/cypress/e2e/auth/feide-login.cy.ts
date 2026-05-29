import { getVisibleByTestId } from "../helpers/feide";

const getOperationName = (body: unknown): string | undefined => {
  if (!body || typeof body !== "object") {
    return undefined;
  }

  const maybeBody = body as { operationName?: unknown; query?: unknown };

  if (typeof maybeBody.operationName === "string" && maybeBody.operationName.length > 0) {
    return maybeBody.operationName;
  }

  if (typeof maybeBody.query === "string") {
    const match = maybeBody.query.match(/mutation\s+([A-Za-z_][A-Za-z0-9_]*)/);
    return match?.[1];
  }

  return undefined;
};

const interceptAuthUserMutation = () => {
  cy.intercept("POST", "**/graphql*", (req) => {
    const operationName = getOperationName(req.body);

    if (operationName !== "authUser") {
      req.continue();
      return;
    }

    req.reply({
      statusCode: 200,
      body: {
        data: {
          authUser: {
            __typename: "AuthUser",
            user: {
              __typename: "UserType",
              id: "1",
              feideEmail: "test@example.com",
              email: "test@example.com",
              username: "testuser",
              firstName: "Test",
              lastName: "User",
              dateJoined: "2024-01-01T00:00:00.000Z",
              graduationYear: 2028,
              gradeYear: 2,
              allergies: null,
              phoneNumber: "12345678",
              firstLogin: false,
            },
          },
        },
      },
    });
  });
};

describe("Feide login", () => {
  it("starts login by redirecting to Dataporten after click", () => {
    cy.visit("/");

    getVisibleByTestId("app-bar-login").click();

    cy.location("origin", { timeout: 120000 }).should("eq", "https://auth.dataporten.no");
    cy.location("search").then((search) => {
      const params = new URLSearchParams(search);
      const returnTo = params.get("returnTo");

      const oauthQuery = returnTo ? decodeURIComponent(returnTo) : search;

      expect(oauthQuery).to.include("redirect_uri=");
      expect(oauthQuery).to.include("response_type=code");
      expect(oauthQuery).to.include("authCallback");
    });
  });

  it("completes auth callback flow and redirects to requested page", () => {
    interceptAuthUserMutation();

    cy.visit("/authCallback?code=dummy-code&state=%2Fevents");
    cy.location("pathname", { timeout: 120000 }).should("eq", "/events");
  });
});
