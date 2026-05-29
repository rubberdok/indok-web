const SITE_MAP_ROUTES = [
  "/",
  "/about",
  "/about/board",
  "/about/itv",
  "/about/organization",
  "/about/organizations/rubberdok",
  "/events",
  "/listings",
  "/booking",
  "/archive",
  "/cabins",
  "/janhus",
  "/janus",
  "/janus/arrangementer",
  "/janus/shop",
  "/baksida",
] as const;

describe("Public site-map smoke", () => {
  SITE_MAP_ROUTES.forEach((route) => {
    it(`loads ${route} without runtime/server error`, () => {
      cy.request({ url: route, failOnStatusCode: false }).then((response) => {
        expect(response.status, `${route} status`).to.be.lessThan(500);
      });

      cy.visit(route, { failOnStatusCode: false });
      cy.contains(/Application error|Internal Server Error|Unhandled Runtime Error|500/i).should("not.exist");
      cy.get("body").should("be.visible");
      cy.document().its("title").should("not.be.empty");
    });
  });
});
