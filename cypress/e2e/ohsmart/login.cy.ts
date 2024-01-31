describe('Login Test', () => {
  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl'));
    cy.contains('log in', { matchCase: false }).click();
    cy.fixture('ohsmart').then((ohsmart) => {
      cy.get('#username').type(ohsmart.username);
      cy.get('#password').type(ohsmart.password);
      cy.get('#kc-login').click();
    });
  });

  it('should navigate to baseUrl and login', () => {
    cy.visit(Cypress.config('baseUrl'));
    cy.contains('log in', { matchCase: false }).click();
  });
});
