describe('Login Test', () => {
  it('should navigate to baseUrl and login', () => {
    cy.kcLogin('user');
    cy.visit('/');
  });
});
