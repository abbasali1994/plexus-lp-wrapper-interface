/* eslint-disable jest/valid-describe */
describe("Cypress", () => {
  it("is working", () => {
    expect(true).to.equal(true);
  });
});
describe(
  "Home Page Flow Test",
  {
    viewportHeight: 800,
    viewportWidth: 1200,
  },
  () => {
    it("visits the app", () => {
      cy.visit("/", { timeout: 5000 });
    });
    describe("Select input token", () => {
      it("Clicks select token button", () => {
        cy.get(".select-token").first().click();
      });
      it("Select input token", () => {
        cy.get(".token").find("span").contains("ETH").click();
      });
    });
    describe("Select lp token 1", () => {
      it("Clicks select token button", () => {
        cy.get(".lp-token1").click();
      });
      it("Selects input token", () => {
        cy.get(".token").find("span").contains("ETH").click();
      });
    });
    describe("Select lp token 2", () => {
      it("Clicks select token button", () => {
        cy.get(".lp-token2").click();
      });
      it("Selects input token", () => {
        cy.get(".token").find("span").contains("USDC").click();
      });
    });
    describe("Set input amount", () => {
      it("Selects input token", () => {
        cy.get("span").contains("max").click();
      });
    });
    
    describe("Confirm lp generation", () => {
      it("Clicks submit button", () => {
        cy.get(".confirm-lp").click();
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

    describe("Generate new lp tokens", () => {
      it("Clicks generate new token button", () => {
        cy.get("button").contains("Generate New LP Tokens").click();
      });
      it("Checks redirected to home page", () => {
        cy.location("pathname").should("eq", "/");
      });
    });
  }
);
