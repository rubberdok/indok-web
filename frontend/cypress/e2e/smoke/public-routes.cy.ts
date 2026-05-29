const PUBLIC_ROUTES = ["/events", "/listings", "/booking", "/about"] as const;

describe("Public route smoke", () => {
  PUBLIC_ROUTES.forEach((route) => {
    it(`loads ${route} without server error`, () => {
      cy.request({ url: route, failOnStatusCode: false }).then((response) => {
        expect(response.status).to.be.oneOf([200, 301, 302, 304]);
      });

      cy.visit(route);
      cy.location("pathname").should("include", route);
      cy.contains(/Application error|Internal Server Error|500/i).should("not.exist");
      cy.get("body").should("be.visible");
    });
  });
});
