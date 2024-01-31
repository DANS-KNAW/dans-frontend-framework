describe('Login Test', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('baseUrl'));
  });

  it('should navigate to baseUrl and login', () => {
    cy.kcLogin('user');
  });
});
