// create a before each method that browses to the baseUrl. You can find the url in the config file.
// make sure to get the url via cypress env.


describe('Login Test', () => {
  it('should navigate to baseUrl and login', () => {
    cy.visit('https://ohsmart.dansdemo.nl/');
    cy.kcLogin('user');
  });
});
