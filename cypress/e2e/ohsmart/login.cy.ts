describe('Login Test', () => {
  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl'));
    cy.contains('log in', { matchCase: false }).click();
    // fill in user name using the username from the fixture ohsmart, the username field has id username
    // fill in password using the password from the fixture ohsmart, the passwword field has id password
    // click sign in button, the button has id kc-login
  });

  it('should navigate to baseUrl and login', () => {
    // cy.visit(Cypress.config('baseUrl'));
    cy.contains('log in', { matchCase: false }).click();
  });
});
