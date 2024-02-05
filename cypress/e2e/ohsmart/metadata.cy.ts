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
        // You are working on an end to end test using Cypress. Read the full instructions before you start working on a solution
        // click on the dropdown menu inside this diff and select the Dutch language. You will find a html snippet on the next line.
        // The dropdown does not have a static id. You need to use an alternative way to select it.
        // <input aria-invalid="false" autocomplete="off" id="d9b7494c-1010-4ded-bea4-df1510984236" type="text" class="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd MuiAutocomplete-input MuiAutocomplete-inputFocused css-1uvydh2" aria-autocomplete="list" aria-expanded="false" autocapitalize="none" spellcheck="false" role="combobox" value=""><div class="MuiAutocomplete-endAdornment css-2iz2x6"><button class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium MuiAutocomplete-popupIndicator css-uge3vf" tabindex="-1" type="button" aria-label="Open" title="Open"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowDropDownIcon"><path d="M7 10l5 5 5-5z"></path></svg><span class="MuiTouchRipple-root css-w0pj6f"></span></button></div><fieldset aria-hidden="true" class="MuiOutlinedInput-notchedOutline css-igs3ac"><legend class="css-yjsfm1"><span>Language *</span></legend></fieldset>

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
