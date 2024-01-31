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
        // Generate a 10 MB file in memory
        const size = 1024 * 1024 * 10; // 10 MB
        const buffer = new ArrayBuffer(size);
        const uint8Array = new Uint8Array(buffer);
        for (let i = 0; i < size; i++) {
            uint8Array[i] = 0; // or any other value to fill the file with
        }

        cy.contains('save', { matchCase: false }).click();

    });
});
