/// <reference types="cypress" />

context("Local Storage", () => {
    beforeEach(() => {
        cy.visit("https://example.cypress.io/commands/local-storage");
    });
});
