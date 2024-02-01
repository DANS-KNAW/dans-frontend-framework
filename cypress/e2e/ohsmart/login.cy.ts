describe('Login Test', () => {
    beforeEach(() => {
        cy.visit(Cypress.config('baseUrl'));
        cy.contains('log in', { matchCase: false }).click();
        cy.login('users/ohsmart', 'user_1');
    });

    it('should navigate to baseUrl and login', () => {

        cy.contains('deposit data', { matchCase: false }).click();
        cy.contains('files', { matchCase: false }).click();


        const fileName = 'largeFile.pdf';
        const sizeInMB = 100;

        cy.generateLargeFile(fileName, sizeInMB).then(file => {
            cy.get('[data-cy="dropzone"]') // replace with your drag & drop area selector
                .attachFile({
                    fileContent: file,
                    fileName: fileName,
                    mimeType: 'application/pdf',
                    encoding: 'utf-8',
                }, {
                    subjectType: 'drag-n-drop',
                });
        });

        cy.contains('save', { matchCase: false }).click();

    });
});
