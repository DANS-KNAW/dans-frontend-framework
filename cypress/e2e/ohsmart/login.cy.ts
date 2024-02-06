describe('Login Test', () => {
    beforeEach(() => {
        cy.visit(Cypress.config('baseUrl'));
        cy.contains('log in', { matchCase: false }).click();
        cy.login('users/ohsmart', 'user_1');
    });

    it('should navigate to baseUrl and login', () => {

        cy.contains('deposit data', { matchCase: false }).click();
        cy.contains('files', { matchCase: false }).click();
    });
});
