/* eslint-disable jest/valid-describe */
describe("Cypress", () => {
  it("is working", () => {
    expect(true).to.equal(true);
  });
});
describe(
  "Dashboard Flow Test",
  {
    viewportHeight: 800,
    viewportWidth: 1400,
  },
  () => {
    it("visits the app", () => {
      cy.visit("/");
    });
    it("clicks connect wallet button", () => {
      cy.get(".connect-wallet-btn").first().click();
    });
    it("clicks metamask button", () => {
      cy.get(".web3modal-provider-name").contains("MetaMask").click();
    });
    it("Clicks dashboard button", () => {
      cy.get(".header-btn").contains("dashboard").click();
    });

    describe("Select dashboard pair", () => {
      it("Clicks dashboard pairs icon in sidebar", () => {
        cy.get('[alt="pairs icon"]').click();
      });

      it("Checks redirected to dashboard pairs page", () => {
        cy.location("pathname").should("eq", "/dashboard/pairs");
      });

      it("Checks dashboard pair table visible", () => {
        cy.get(".dashboard-table").should("be.visible");
        cy.get(".dashboard-table-header").should("be.visible");
        cy.get(".dashboard-table-body").should("be.visible");
        cy.get(".dashboard-table-pair-dex").should("be.visible");
      });

      describe("Checks pairs table columns", () => {
        it("Checks 'Tokens' column visible", () => {
          cy.get(".dashboard-table-header")
            .find("div")
            .contains("Tokens")
            .should("be.visible");
        });

        it("Checks 'Wallet Balance' column visible", () => {
          cy.get(".dashboard-table-header")
            .find("div")
            .contains("Pair")
            .should("be.visible");
        });

        it("Checks 'USD Value' column visible", () => {
          cy.get(".dashboard-table-header")
            .find("div")
            .contains("USD Value")
            .should("be.visible");
        });

        it("Checks 'Actions' column visible", () => {
          cy.get(".dashboard-table-header")
            .find("div")
            .contains("Actions")
            .should("be.visible");
        });
      });
    });

    describe("Select dashboard tokens", () => {
      it("Clicks dashboard tokens icon in sidebar", () => {
        cy.get('[alt="tokens icon"]').click();
      });

      it("Checks redirected to dashboard tokens page", () => {
        cy.location("pathname").should("eq", "/dashboard/tokens");
      });

      it("Checks dashboard tokens table visible", () => {
        cy.get(".dashboard-table").should("be.visible");
        cy.get(".dashboard-table-header").should("be.visible");
        cy.get(".dashboard-table-body").should("be.visible");
      });

      describe("Checks tokens table columns", () => {
        it("Checks 'Tokens' column visible", () => {
          cy.get(".dashboard-table-header")
            .find("div")
            .contains("Token")
            .should("be.visible");
        });
        it("Checks 'Wallet Balance' column visible", () => {
          cy.get(".dashboard-table-header")
            .find("div")
            .contains("Wallet Balance")
            .should("be.visible");
        });
        it("Checks 'USD Value' column visible", () => {
          cy.get(".dashboard-table-header")
            .find("div")
            .contains("USD Value")
            .should("be.visible");
        });
        it("Checks 'Actions' column visible", () => {
          cy.get(".dashboard-table-header")
            .find("div")
            .contains("Actions")
            .should("be.visible");
        });
      });
    });

    describe("Select dashboard history", () => {
      it("Clicks dashboard tokens icon in sidebar", () => {
        cy.get('[alt="history icon"]').click();
      });

      it("Checks redirected to dashboard history page", () => {
        cy.location("pathname").should("eq", "/dashboard/history");
      });

      it("Checks dashboard history table visible", () => {
        cy.get(".dashboard-table").should("be.visible");
        cy.get(".dashboard-table-header").should("be.visible");
        cy.get(".dashboard-table-body").should("be.visible");
      });

      describe("Select dashboard history", () => {
        it("Checks 'Date' column visible", () => {
          cy.get(".dashboard-table-header")
            .find("div")
            .contains("Date")
            .should("be.visible");
        });

        it("Checks 'Action' column visible", () => {
          cy.get(".dashboard-table-header")
            .find("div")
            .contains("Action")
            .should("be.visible");
        });

        it("Checks 'Txn Hash' column visible", () => {
          cy.get(".dashboard-table-header")
            .find("div")
            .contains("Txn Hash")
            .should("be.visible");
        });
      });
    });

    describe("Check back button", () => {
      it("Clicks on back button", () => {
        cy.get(".back-arrow").first().click();
      });
      it("Checks redirected to dashboard tokens page", () => {
        cy.location("pathname").should("eq", "/dashboard/tokens");
      });
      it("Clicks on back button again", () => {
        cy.get(".back-arrow").first().click();
      });
      it("Checks redirected to dashboard pairs page", () => {
        cy.location("pathname").should("eq", "/dashboard/pairs");
      });
    });
  }
);
