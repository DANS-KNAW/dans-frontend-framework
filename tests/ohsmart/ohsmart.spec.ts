import { test } from '@playwright/test';

import { AdministrativePage } from '../pages/administrative.page';
import { CitationPage } from '../pages/citation.page';
import { OralHistorySpecificPage } from '../pages/oral.history.specific';
import { CoveragePage } from '../pages/coverage.page';
import { RelationsPage } from '../pages/relations.page';
import { RightsPage } from '../pages/rights.page';

import { loginAndGoToForm } from '../utils';

test('Test all ohsmart tabs/fields', async ({ page }) => {
    loginAndGoToForm(page, 'https://ohsmart.dansdemo.nl', 'demouser@test.com', 'IkBenDemoUser!')

    const administrativePage = new AdministrativePage(page);
    await administrativePage.fillOut()

    const citationPage = new CitationPage(page);
    await citationPage.openTab()
    await citationPage.setTitle()
    await citationPage.setDescription()
    await citationPage.setSubtitle(3)
    await citationPage.setPublisher()
    await citationPage.setAuthor(3)
    await citationPage.setGrantInformation(3)

    const oralHistorySpecificPage = new OralHistorySpecificPage(page);
    await oralHistorySpecificPage.openTab()
    await oralHistorySpecificPage.setInterviewee()
    await oralHistorySpecificPage.setInterviewers(3)
    await oralHistorySpecificPage.setInterpreters(3)
    await oralHistorySpecificPage.setOthersPresent(3)
    await oralHistorySpecificPage.setRecordingBy(3)
    await oralHistorySpecificPage.setDateAndTime(3)
    await oralHistorySpecificPage.setTranscribers(3)
    await oralHistorySpecificPage.setSectionLessElements()

    const coveragePage = new CoveragePage(page)
    await coveragePage.openTab()
    await coveragePage.setLocation()
    await coveragePage.setPeriods(3)

    const relationsPage = new RelationsPage(page)
    await relationsPage.openTab()
    await relationsPage.setAudience()
    await relationsPage.setRelatedTo(3)

    const rightsPage = new RightsPage(page)
    await rightsPage.openTab()
    await rightsPage.setRights()

    await page.getByTestId('save-form').click();

});