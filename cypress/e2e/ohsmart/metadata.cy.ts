describe('Metadata', () => {
    cy.visit(Cypress.config('baseUrl'));
    cy.contains('log in', { matchCase: false }).click();
    cy.login('users/ohsmart', 'user_1');

    it('Administrative fields', () => {
        // Step 1: Make sure that the administrative MuiPaper is expanded
        cy.get('.MuiAccordionSummary-root').click();

        // Step 2: Select Dutch from the language drop down
        cy.get('#895cca3d-9ed8-435e-9481-6e2716a8c7ff').type('Dutch{enter}');

        // Step 3: Set the embargo date to the current date using the correct format
        const date = Cypress.moment().format('DD-MM-YYYY');
        cy.get('#:r4o:').type(date);

        //<div class="MuiButtonBase-root MuiAccordionSummary-root Mui-expanded MuiAccordionSummary-gutters css-1iji0d4" tabindex="0" role="button" aria-expanded="true" aria-controls="administrative-content" id="administrative-header"><div class="MuiAccordionSummary-content Mui-expanded MuiAccordionSummary-contentGutters css-17o5nyn"><svg class="MuiSvgIcon-root MuiSvgIcon-colorError MuiSvgIcon-fontSizeMedium css-1olk1fx" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ErrorIcon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg><p class="MuiTypography-root MuiTypography-body1 css-9l3uo3">Administrative</p></div><div class="MuiAccordionSummary-expandIconWrapper Mui-expanded css-1fx8m19"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ExpandMoreIcon"><path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"></path></svg></div></div><div class="MuiCollapse-root MuiCollapse-vertical MuiCollapse-entered css-c4sutr" style="min-height: 0px; height: auto; transition-duration: 319ms;"><div class="MuiCollapse-wrapper MuiCollapse-vertical css-hboir5"><div class="MuiCollapse-wrapperInner MuiCollapse-vertical css-8atqhb"><div aria-labelledby="administrative-header" id="administrative-content" role="region" class="MuiAccordion-region"><div class="MuiAccordionDetails-root css-u7qq7e"><div class="MuiGrid2-root MuiGrid2-container MuiGrid2-direction-xs-row MuiGrid2-spacing-xs-2 css-12d6kwy"><div class="MuiGrid2-root MuiGrid2-direction-xs-row MuiGrid2-grid-xs-12 MuiGrid2-grid-md-6 css-1c6omog"><div class="MuiStack-root css-32qh8a"><div class="MuiAutocomplete-root MuiAutocomplete-fullWidth MuiAutocomplete-hasPopupIcon css-vtpdau"><div class="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-feqhe6"><label class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-outlined css-1pbxdyj" data-shrink="false" for="895cca3d-9ed8-435e-9481-6e2716a8c7ff" id="895cca3d-9ed8-435e-9481-6e2716a8c7ff-label">Language *</label><div class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-adornedEnd MuiAutocomplete-inputRoot css-iqhgwm"><input aria-invalid="false" autocomplete="off" id="895cca3d-9ed8-435e-9481-6e2716a8c7ff" type="text" class="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd MuiAutocomplete-input MuiAutocomplete-inputFocused css-1uvydh2" aria-autocomplete="list" aria-expanded="false" autocapitalize="none" spellcheck="false" role="combobox" value=""><div class="MuiAutocomplete-endAdornment css-2iz2x6"><button class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium MuiAutocomplete-popupIndicator css-uge3vf" tabindex="-1" type="button" aria-label="Open" title="Open"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowDropDownIcon"><path d="M7 10l5 5 5-5z"></path></svg><span class="MuiTouchRipple-root css-w0pj6f"></span></button></div><fieldset aria-hidden="true" class="MuiOutlinedInput-notchedOutline css-igs3ac"><legend class="css-yjsfm1"><span>Language *</span></legend></fieldset></div></div></div><svg class="MuiSvgIcon-root MuiSvgIcon-colorError MuiSvgIcon-fontSizeMedium css-47mwun" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ErrorIcon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path></svg></div></div><div class="MuiGrid2-root MuiGrid2-direction-xs-row MuiGrid2-grid-xs-12 MuiGrid2-grid-md-6 css-1c6omog"><div class="MuiStack-root css-32qh8a"><div class="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-1vguq59"><label class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-outlined css-1pbxdyj" data-shrink="false" for=":r4o:" id=":r4o:-label">Embargo date</label><div class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-adornedEnd css-iqhgwm"><input aria-invalid="false" autocomplete="off" id=":r4o:" placeholder="DD-MM-YYYY" type="text" inputmode="text" class="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd css-1uvydh2" value=""><div class="MuiInputAdornment-root MuiInputAdornment-positionEnd MuiInputAdornment-outlined MuiInputAdornment-sizeMedium css-1nvf7g0"><svg class="MuiSvgIcon-root MuiSvgIcon-colorNeutral MuiSvgIcon-fontSizeMedium css-18h067g" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="InfoIcon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg></div><fieldset aria-hidden="true" class="MuiOutlinedInput-notchedOutline css-igs3ac"><legend class="css-yjsfm1"><span>Embargo date</span></legend></fieldset></div></div></div></div><div class="MuiGrid2-root MuiGrid2-direction-xs-row MuiGrid2-grid-xs-12 css-ipi2ni"><div class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root css-s18byi"><div class="MuiCardHeader-root css-1xoaihr"><div class="MuiCardHeader-content css-11qjisw"><span class="MuiTypography-root MuiTypography-h5 MuiCardHeader-title css-1shlyqe">Contact information</span><span class="MuiTypography-root MuiTypography-body1 MuiCardHeader-subheader css-cru6fs">The person to contact regarding the metadata (curator)</span></div></div><div class="MuiCardContent-root css-1qw96cp"><div><div class="MuiCollapse-root MuiCollapse-vertical MuiCollapse-entered css-c4sutr" style="min-height: 0px;"><div class="MuiCollapse-wrapper MuiCollapse-vertical css-hboir5"><div class="MuiCollapse-wrapperInner MuiCollapse-vertical css-8atqhb"><div class="MuiStack-root css-1om5xxi"><div class="MuiGrid2-root MuiGrid2-container MuiGrid2-direction-xs-row MuiGrid2-spacing-xs-2 css-8r0ggg"><div class="MuiGrid2-root MuiGrid2-direction-xs-row MuiGrid2-grid-xs-12 MuiGrid2-grid-md-6 css-1c6omog"><div class="MuiStack-root css-32qh8a"><div class="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-1vguq59"><label class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined MuiFormLabel-colorPrimary Mui-disabled MuiFormLabel-filled MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined css-9c6315" data-shrink="true" for=":r4q:" id=":r4q:-label">Name</label><div class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary Mui-disabled MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-adornedEnd css-iqhgwm"><input aria-invalid="false" disabled="" id=":r4q:" type="text" class="MuiInputBase-input MuiOutlinedInput-input Mui-disabled MuiInputBase-inputAdornedEnd css-1uvydh2" value="Michiel Zuidema"><div class="MuiInputAdornment-root MuiInputAdornment-positionEnd MuiInputAdornment-outlined MuiInputAdornment-sizeMedium css-1nvf7g0"><svg class="MuiSvgIcon-root MuiSvgIcon-colorSuccess MuiSvgIcon-fontSizeMedium css-m1mfin" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CheckCircleIcon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg></div><fieldset aria-hidden="true" class="MuiOutlinedInput-notchedOutline css-igs3ac"><legend class="css-14lo706"><span>Name</span></legend></fieldset></div></div></div></div><div class="MuiGrid2-root MuiGrid2-direction-xs-row MuiGrid2-grid-xs-12 MuiGrid2-grid-md-6 css-1c6omog"><div class="MuiStack-root css-32qh8a"><div class="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-1vguq59"><label class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-outlined MuiFormLabel-colorPrimary MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-outlined css-1pbxdyj" data-shrink="false" for=":r4s:" id=":r4s:-label">Affiliation</label><div class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-adornedEnd css-iqhgwm"><input aria-invalid="false" id=":r4s:" type="text" class="MuiInputBase-input MuiOutlinedInput-input MuiInputBase-inputAdornedEnd css-1uvydh2" value=""><div class="MuiInputAdornment-root MuiInputAdornment-positionEnd MuiInputAdornment-outlined MuiInputAdornment-sizeMedium css-1nvf7g0"><svg class="MuiSvgIcon-root MuiSvgIcon-colorWarning MuiSvgIcon-fontSizeMedium css-5pzt4" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="InfoIcon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path></svg></div><fieldset aria-hidden="true" class="MuiOutlinedInput-notchedOutline css-igs3ac"><legend class="css-yjsfm1"><span>Affiliation</span></legend></fieldset></div></div></div></div><div class="MuiGrid2-root MuiGrid2-direction-xs-row MuiGrid2-grid-xs-12 MuiGrid2-grid-md-6 css-1c6omog"><div class="MuiStack-root css-32qh8a"><div class="MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root css-1vguq59"><label class="MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined MuiFormLabel-colorPrimary Mui-disabled MuiFormLabel-filled MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiInputLabel-outlined css-9c6315" data-shrink="true" for=":r4u:" id=":r4u:-label">Email</label><div class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary Mui-disabled MuiInputBase-fullWidth MuiInputBase-formControl MuiInputBase-adornedEnd css-iqhgwm"><input aria-invalid="false" disabled="" id=":r4u:" type="text" class="MuiInputBase-input MuiOutlinedInput-input Mui-disabled MuiInputBase-inputAdornedEnd css-1uvydh2" value="michiel.zuidema@dans.knaw.nl"><div class="MuiInputAdornment-root MuiInputAdornment-positionEnd MuiInputAdornment-outlined MuiInputAdornment-sizeMedium css-1nvf7g0"><svg class="MuiSvgIcon-root MuiSvgIcon-colorSuccess MuiSvgIcon-fontSizeMedium css-m1mfin" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CheckCircleIcon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg></div><fieldset aria-hidden="true" class="MuiOutlinedInput-notchedOutline css-igs3ac"><legend class="css-14lo706"><span>Email</span></legend></fieldset></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div>
    });


});
