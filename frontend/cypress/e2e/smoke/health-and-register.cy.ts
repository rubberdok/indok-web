import { getByTestId } from "../helpers/feide";
import { mockAuthenticatedGraphQL } from "../helpers/graphqlAuthMocks";

describe("Health and register smoke", () => {
  it("responds healthy on Next API health endpoint", () => {
    cy.request("/api/health").its("body").should("deep.equal", { healthy: true });
  });

  it("renders register form controls", () => {
    mockAuthenticatedGraphQL();

    cy.visit("/register");
    getByTestId("registerUser-title").should("contain.text", "Registrering");
    getByTestId("registerUser-firstNameTextField").find("input").should("be.visible");
    getByTestId("registerUser-lastNameTextField").find("input").should("be.visible");
    getByTestId("registerUser-saveButton").should("be.visible");
  });
});
