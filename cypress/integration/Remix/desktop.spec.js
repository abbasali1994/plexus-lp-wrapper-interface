/* eslint-disable jest/valid-describe */
describe("Cypress", () => {
  it("is working", () => {
    expect(true).to.equal(true);
  });
});
describe(
  "Remix Page Flow Test",
  {
    viewportHeight: 800,
    viewportWidth: 1400,
  },
  () => {
    it("visits the app", () => {
      cy.visit("/remix", { timeout: 5000 });
    });
    describe("Select pair token", () => {
      it("Clicks select token button", () => {
        cy.get("#remix-row-0").first().click();
      });
    });
    describe("Select lp token 1", () => {
      it("Clicks select token button", () => {
        cy.get(".lp-token1").first().click();
      });
      it("Selects input token", () => {
        cy.get(".token").find("span").contains("ETH").click();
      });
    });
    describe("Select lp token 2", () => {
      it("Clicks select token button", () => {
        cy.get(".select-token-text").contains("Select a Token").click();
      });
      it("Selects input token", () => {
        cy.get(".token").find("span").contains("USDC").click();
      });
    });
    describe("Confirm Remix", () => {
      it("Clicks Remix button", () => {
        cy.get(".input-btn").click();
      });
    });
    describe("Confirm privacy policy", () => {
      it("Clicks submit button", () => {
        cy.get(".confirm-privacy-btn").click();
      });
    });
    describe("Confirm txn", () => {
      it("Clicks submit button", () => {
        cy.get(".confirm-tx").click();
      });
    });
    describe("Awaiting txn modal visible", () => {
      it("Checks awaiting txn modal visible", () => {
        cy.get(".awaiting-txn-header").should("be.visible");
        cy.get(".awaiting-txn-body").should("be.visible");
        cy.get(".awaiting-txn-desc").should("be.visible");
        cy.get(".awaiting-txn-text").should("be.visible");
        cy.get(".awaiting-txn-confirm").should("be.visible");
      });
    });
    describe("Awaiting txn modal close", () => {
      it("Checks awaiting txn modal closed", () => {
        cy.get(".awaiting-txn-header", { timeout: 10000 }).should("not.exist");
      });
    });
    describe("Txn success page visible", () => {
      it("Checks txn success page visible", () => {
        cy.get(".txn-success").should("be.visible");
        cy.get(".success-txt").should("be.visible");
        cy.get(".txn-submitted-etherscan").should("be.visible");
        cy.get(".txn-details").should("be.visible");
      });
    });

    describe("Remix More lp tokens", () => {
      it("Clicks Remix More token button", () => {
        cy.get("button", { timeout: 3000 }).contains("Remix More LP Tokens").click();
      });
      it("Checks redirected to home page", () => {
        cy.location("pathname").should("eq", "/remix");
      });
    });
  }
);
