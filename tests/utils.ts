import { Locator, Page } from '@playwright/test';
import exp from 'constants';

/**
 * Groupfield holds data that makes filling groups easy. See fillGroup for more details.
 * 
 * fieldName, name of the field you wish to select
 * fieldValue, value to be filled in the selected field
 * isDropdown, is this field a dropdown?
 * mockUrl, url to mock (for dropdown that calls an api)
 * mockData, file that contains mock data (for dropdown that calls an api)
 * isDateField, is this a date/time field?
 */
export interface GroupField {
    fieldName: string;
    fieldValue: string;
    isDropdown: boolean;
    mockUrl?: string;
    mockData?: string;
    isDateField?: boolean;
    isUrlField?: boolean;
}

/**
 * Navigate to the service page and log in.
 * @param page Playwright page
 * @param url url of the page to navigate to
 * @param username valid username
 * @param password valid password for username
 * @returns Playwright page
 */
export async function login(page: Page, url: string, username: string, password: string) {
    await page.goto(url);
    await page.locator('div').filter({ hasText: /^Log in$/ }).getByRole('button').click();
    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Username').press('Tab');
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click()
    return page
}

/**
 * Navigate to the deposit form
 * @param page Playwright page
 * @returns Playwright page
 */
export async function goToForm(page: Page) {
    await page.getByRole('button', { name: 'Deposit data' }).click();
    return page
}

/**
 * Navigate to service page, login, and navigate to the form.
 * @param page Playwright page
 * @param url url of the page to navigate to
 * @param username valid username
 * @param password valid password for username
 * @returns Playwright page
 */
export async function loginAndGoToForm(page: Page, url: string, username: string, password: string) {
    await login(page, url, username, password);
    await goToForm(page);
    return page
}

/**
 * Click on a textfield and fill a value
 * @param page Playwright page
 * @param testIdRegExp RegEx used to locate the textfield
 * @param value Value to be filled in the textfield
 */
export async function clickAndFill(page: Page, testIdRegExp: string, value: string) {
    await page.getByTestId(RegExp(testIdRegExp)).click();
    await page.getByTestId(RegExp(testIdRegExp)).fill(value);
}

/**
 * Fill a value in a dropdown that calls an API.
 * Note, this function is for fields that are not part of a group.
 * 
 * @param page Playwright page
 * @param testIdRegExp RegEx used to locate the textfield
 * @param value Value to be filled in the textfield
 * @param mockData file name
 * @param mockUrl partial url
 */
export async function clickAndFillApiDropdown(page: Page, testIdRegExp: string, value: string, mockData: string, mockUrl: string) {
    await clickAndFill(page, testIdRegExp, value)
    await loadMockDataDropdown(page, mockData, mockUrl)
    await page.getByRole('option', { name: value }).click();
}

/**
 * Fill a value in a dropdown that has predefined values.
 * Note, this function is for fields that are not part of a group.
 * 
 * @param page Playwright page
 * @param testIdRegExp RegEx used to locate the textfield
 * @param value Value to be filled in the textfield
 */
export async function clickAndFillDropdown(page: Page, testIdRegExp: string, value: string) {
    await clickAndFill(page, testIdRegExp, value)
    await page.getByRole('option', { name: new RegExp(value) }).click();
}

/**
 * Create many additional fields by clicking the "add another" button
 * @param page Playwright page
 * @param testIdRegExp RegEx used to locate the textfield
 * @param amount Amount of (additional) fields to create
 */
export async function createMany(page: Page, testIdRegExp: string, amount: number) {
    for (let i = 1; i < amount; i++) {
        await page.getByTestId(RegExp(testIdRegExp)).click();
    }
}

/**
 * Fill an entire group in one go. This function depends on groupFields to be set correctly
 * @param page Playwright page
 * @param groupName Name of the group
 * @param groupFields Array of groupFields (one for each field in the group)
 */
export async function fillGroup(page: Page, groupName: string, groupFields: GroupField[]) {
    // select all groups by their name
    let index = 1;
    for (const group of await page.getByTestId(new RegExp(groupName)).all()) {

        // fill each field in the group
        for (const groupField of groupFields) {
            // select field from locator
            const field = group.getByTestId(new RegExp(`^${groupField.fieldName}-[^.]*$`)).nth(0)
            await field.click()

            // handle dropdown menu
            if (groupField.isDropdown) {
                await handleGroupDropdown(page, group, groupName, groupField, index, field)
                continue
            }

            if (groupField.isDateField === true) {
                // handle date/time field
                await field.pressSequentially(groupField.fieldValue, { delay: 50 })
                continue
            }

            if (groupField.isUrlField) {
                // only fill the url
                await field.fill(groupField.fieldValue);
                continue

            }

            // fill field
            await field.fill(`${groupName} ${groupField.fieldValue} ${index}`);

        }
        await giveConsent(group)
        index++;
    }
}

/**
 * Handle dropdown menus.
 * @param page Playwright page
 * @param groupField GroupField interface
 */
async function handleGroupDropdown(page: Page, group: Locator, groupName: string, groupField: GroupField, index: number, field: Locator) {

    // This dropdown loads its options via an API call
    // fill groupname fieldValue and index in this field
    // Press enter to select the value that was just filled (ignores api results)
    if (groupField.mockUrl) {
        await field.fill(`${groupName} ${groupField.fieldValue} ${index}`);
        await loadMockDataDropdown(page, groupField.mockData, groupField.mockUrl)
        // mock values currently don't work well. Pressing enter sets the value that was set using the fill call.
        await page.keyboard.press('Enter')
    // This dropdown has predefined values
    // Only fill the fieldValue then select the option (option must match exactly)
    } else {
        await field.pressSequentially(groupField.fieldValue, { delay: 100 })
        await page.getByRole('option', { name: groupField.fieldValue }).click();
    }
}

/**
 * Mocks a call to an API that loads data for a dropdown.
 * // TODO: properly mock the values for each dropdown
 * @param page Playwright page
 * @param mockData file name
 * @param mockUrl partial url
 */
export async function loadMockDataDropdown(page: Page, mockData: GroupField["mockData"], mockUrl: GroupField["mockUrl"]) {
    const mockJson = require(`./mock-data/${mockData}`)
    await page.route(mockUrl, route => route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockJson),
    }));
}

/**
 * Give concent where possible. Only some groups have a concent checkbox.
 * @param page Playwright page
 * @param groupField GroupField interface
 */
async function giveConsent(group: Locator) {
    try {
        await group.getByTestId(new RegExp('.*_consent-*')).getByLabel('Consent given').check({ timeout: 100 });
    } catch (error) {
        console.log('Consent box not found, proceeding without action.');
    }
}
