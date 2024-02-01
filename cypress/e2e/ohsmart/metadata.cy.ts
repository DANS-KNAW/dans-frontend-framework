describe('Metadata Tests', () => {
    before(() => {
        cy.visit(Cypress.config('baseUrl'));
        cy.contains('log in', { matchCase: false }).click();
        cy.login('users/ohsmart', 'user_1');
    });

    it('Test metadata depost', () => {
        navigateToDepositPage()
        fillOutAdministrativeTab()
    });

    function navigateToDepositPage(){
        cy.contains('deposit data', { matchCase: false }).click();

    }

    function fillOutAdministrativeTab(){
        // click the on  dropdown menu, it has a placeholder value "language *"
        cy.get('#895cca3d-9ed8-435e-9481-6e2716a8c7ff').click();

        // select the Dutch language
        cy.get('.dropdown-menu').contains('Dutch').click();
    }

    function fillOutCitationTab(){
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
