describe('Login Test', () => {
  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl'));
    cy.contains('log in', { matchCase: false }).click();
    cy.fixture('users/ohsmart').then((data) => {
      cy.get('#username').type(data.user_1.username);
      cy.get('#password').type(data.user_1.password);
      cy.get('#kc-login').click();
    });
  });

  it('should navigate to baseUrl and login', () => {

    cy.contains('deposit data', { matchCase: false }).click();
    cy.contains('files', { matchCase: false }).click();
    // generate a 10 mb zip file in memory
    // upload the file using the drag and drop upload function on the page 
  });
});
