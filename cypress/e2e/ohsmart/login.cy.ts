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
    // generate a 10 mb file in memory
    const blob = new Blob([new ArrayBuffer(1024 * 1024 * 10)], { type: 'application/zip' });
    const file = new File([blob], 'test.zip', { type: 'application/zip' });

    // upload the file using the drag and drop upload function on the page
    cy.get('input[type=file]').attachFile(file);
  });
});
