describe('Login Test', () => {
  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl'));
  });

  it('should navigate to baseUrl and login', () => {
    cy.kcLogin('user');
    cy.contains('log in', { matchCase: false }).click();
  });
});
