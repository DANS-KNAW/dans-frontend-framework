describe('Metadata Tests', () => {
    before(() => {
        cy.visit(Cypress.config('baseUrl'));
        cy.contains('log in', { matchCase: false }).click();
        cy.login('users/ohsmart', 'user_1');
    });

    it('Test metadata depost', () => {
        navigateToDepositPage()
        fillOutAdministrativeTab()
        fillOutCitationTab()
    });

    function navigateToDepositPage(){
        cy.contains('deposit data', { matchCase: false }).click();

    }

    function fillOutAdministrativeTab(){
        // Select Dutch language from dropdown
        cy.get('label').contains('Language *', { matchCase: false }).parent().find('input').click().type('Dutch');
        // Set Dutch language
        cy.contains('Dutch').click();

        // Get yesterday's date in DD-MM-YYYY format
        let yesterday = new Date(Date.now() - 24*60*60*1000);
        let dd = String(yesterday.getDate()).padStart(2, '0');
        let mm = String(yesterday.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = yesterday.getFullYear();
        let formattedDate = dd + '-' + mm + '-' + yyyy;

        // Fill in the yesterday's date in the Embargo Date field
        cy.get('label').contains('embargo date', { matchCase: false }).parent().find('input').type(formattedDate);

        // Set the affiliation
        cy.get('label').contains('affiliation', { matchCase: false }).parent().find('input').type("DANS Cypress");

    }

    function fillOutCitationTab(){
        // Open the Citation menu
        cy.contains('citation', { matchCase: false }).click();

        // Set the title
        cy.get('label').contains('title', { matchCase: false }).parent().find('input').type("Citation Title");

        // Set the description
        // the following line runs in to this error: "cy.type() can only be called on a single element. Your subject contained 2 elements."
        // Your task is to resolve the error. You can find the required html in the snippet file
        cy.get('label').contains('Description', { matchCase: false }).parent().find('textarea').first().type("Citation Description");
        





    }

    function fillOutOralHistorySpecificTab(){
    }

    function fillOutCoverageTab(){
    }

    function fillOutRelationsTab(){
    }

    function fillOutRightsLiencingReuseTab(){
    }

    

});
