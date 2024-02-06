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
        // Select Dutch language from dropdown
        cy.get('label').contains('Language *', { matchCase: false }).parent().find('input').click().type('Dutch');
        // Set Dutch language
        cy.contains('Dutch').click();

        // Your task is to fill in the yesterday's date in the Embargo Date field. Do this in the following steps.
        // Search for the date field by the label "embargo date", do not match case
        // Select the date field and fill in yesterday's date in the DD-MM-YYYY format

        // here is an html snippet that contains the label and field
        // <label class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiFormLabel-filled MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined css-9c6315" data-shrink="true" for=":r3o:" id=":r3o:-label">Embargo date</label><div class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-adornedEnd css-iqhgwm"><input aria-invalid="false" autocomplete="off" id=":r3o:" placeholder="DD-MM-YYYY" type="text" inputmode="text" class="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd css-1uvydh2" value="DD-MM-YYYY"><div class="MuiInputAdornment-root MuiInputAdornment-positionEnd MuiInputAdornment-outlined MuiInputAdornment-sizeMedium css-1nvf7g0"><svg class="MuiSvgIcon-root MuiSvgIcon-colorNeutral MuiSvgIcon-fontSizeMedium css-18h067g" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="InfoIcon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg></div><fieldset aria-hidden="true" class="MuiOutlinedInput-notchedOutline css-igs3ac"><legend class="css-14lo706"><span>Embargo date</span></legend></fieldset></div>
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
