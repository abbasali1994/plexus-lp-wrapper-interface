/* eslint-disable jest/valid-describe */
describe("Cypress", () => {
  it("is working", () => {
    expect(true).to.equal(true);
  });
});
describe(
  "Dashboard Flow Test",
  {
    viewportHeight: 900,
    viewportWidth: 400,
  },
  () => {
    it("visits the app", () => {
      cy.visit("/");
    });

    it("Clicks dashboard button", () => {
      cy.get(".header-btn").contains("dashboard").click();
    });

    it("Checks redirected to dashboard page", () => {
      cy.location("pathname").should("eq", "/dashboard");
    });

    it("Checks dashboard links visible", () => {
      cy.get(".main-dashboard-path-name")
        .contains("pairs")
        .scrollIntoView()
        .should("be.visible");
      cy.get(".main-dashboard-path-name")
        .contains("tokens")
        .scrollIntoView()
        .should("be.visible");
      cy.get(".main-dashboard-path-name")
        .contains("history")
        .scrollIntoView()
        .should("be.visible");
    });

    describe("Select dashboard pair", () => {
      it("Clicks dashboard pairs icon in sidebar", () => {
        cy.get('[alt="pairs icon"]').click();
      });

      it("Checks redirected to dashboard pairs page", () => {
        cy.location("pathname").should("eq", "/dashboard/pairs");
      });

      it("Checks dashboard pair page visible", () => {
        cy.get(".dashboard-path-name").contains("pairs").should("be.visible");
        cy.get(".dashboard-lp-view").first().should("be.visible");
        cy.get(".dashboard-pair-btn").contains("Unwrap").should("be.visible");
        cy.get(".dashboard-pair-btn").contains("Remix").should("be.visible");
      });
    });

    describe("Goto dashboard main page", () => {
      it("Clicks on back button", () => {
        cy.get(".back-arrow").first().click();
      });
      it("Checks redirected to dashboard main page", () => {
        cy.location("pathname").should("eq", "/dashboard");
      });
    });

    describe("Select dashboard tokens", () => {
      it("Clicks dashboard tokens icon in sidebar", () => {
        cy.get('[alt="tokens icon"]').click();
      });

      it("Checks redirected to dashboard tokens page", () => {
        cy.location("pathname").should("eq", "/dashboard/tokens");
      });

      it("Checks dashboard tokens page visible", () => {
        cy.get(".dashboard-path-name").contains("tokens").should("be.visible");
        cy.get(".dashboard-lp-view").first().should("be.visible");
        cy.get(".dashboard-token-btn")
          .contains("Generate Sushi LP")
          .should("be.visible");
        cy.get(".dashboard-token-btn")
          .contains("Generate Uni LP")
          .should("be.visible");
      });
    });

    describe("Goto dashboard main page again", () => {
      it("Clicks on back button", () => {
        cy.get(".back-arrow").first().click();
      });
      it("Checks redirected to dashboard main page", () => {
        cy.location("pathname").should("eq", "/dashboard");
      });
    });

    describe("Select dashboard history", () => {
      it("Clicks dashboard history icon in sidebar", () => {
        cy.get('[alt="history icon"]').click();
      });

      it("Checks redirected to dashboard history page", () => {
        cy.location("pathname").should("eq", "/dashboard/history");
      });

      it("Checks dashboard history page visible", () => {
        cy.get(".dashboard-path-name").contains("history").should("be.visible");
        cy.get(".history").first().should("be.visible");
        cy.get(".history-timestamp").first().should("be.visible");
        cy.get(".history-amount").first().should("be.visible");
        cy.get(".history-hash").first().should("be.visible");
      });
    });
  }
);
