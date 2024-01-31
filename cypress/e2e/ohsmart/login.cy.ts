describe('Login Test', () => {
  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl'));
    cy.contains('log in', { matchCase: false }).click();
    cy.fixture('users/ohsmart').then((data) => {
      cy.get('#username').type(data.ohsmart.username);
      cy.get('#password').type(data.ohsmart.password);
      cy.get('#kc-login').click();
    });
  });

  it('should navigate to baseUrl and login', () => {
    cy.visit(Cypress.config('baseUrl'));
    cy.contains('log in', { matchCase: false }).click();
  });
});
