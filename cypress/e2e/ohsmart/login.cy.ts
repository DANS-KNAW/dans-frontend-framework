describe('Login Test', () => {
  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl'));
  });

  it('should navigate to baseUrl and login', () => {
    cy.kcLogin('user');
    // after requesting a token click the log in button. This button does not have an id so look for a string "log in". Make sure to be case insensitive
  });
});
