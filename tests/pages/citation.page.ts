import { Page } from '@playwright/test';
import { clickAndFill, createMany, fillGroup, GroupField, loadMockDataDropdown } from '../utils';


export class CitationPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async openTab() {
        await this.page.getByRole('button', { name: 'Citation' }).click();
    }

    async setTitle() {
        await clickAndFill(this.page, '^title-[^.]*$', 'Citation Title')
    }

    async setDescription() {
        clickAndFill(this.page, '^description-*', 'Description')
    }

    async setSubtitle(numberOfSubtitles: number) {
        // create empty subtitle fields
        await createMany(this.page, 'add-button-subtitle-*', numberOfSubtitles)

        // fill each subtile with a value
        let index = 1;
        for (const subtitle of await this.page.getByTestId(RegExp("^subtitle-*")).all()) {
            await subtitle.click();
            await subtitle.fill(`subtitle ${index}`);
            index++;
        }
    }

    async setPublisher() {
        await clickAndFill(this.page, '^publisher-*', 'publisher 1')
        await loadMockDataDropdown(this.page, 'publisher.json', '**/organizations?query.advanced=name:*')
        await this.page.keyboard.press('Enter')
    }

    async setAuthor(numberOfAuthors: number) {
        const groupFields: GroupField[] = [
            {
                fieldName: 'name',
                fieldValue: 'name',
                isDropdown: true,
                mockUrl: '**/v3.0/expanded-search/?q=*',
                mockData: 'author.json'
            },
            {
                fieldName: 'affiliation',
                fieldValue: 'affiliation',
                isDropdown: false,
            },
        ]

        await createMany(this.page, 'add-button-author', numberOfAuthors)
        await fillGroup(this.page, 'single-author-group', groupFields)
    }

    async setGrantInformation(numberOfGrants: number) {
        const groupFields: GroupField[] = [
            {
                fieldName: 'grant_agency',
                fieldValue: 'grant agency',
                isDropdown: false,
            },
            {
                fieldName: 'grant_number',
                fieldValue: 'grant number',
                isDropdown: false,
            },
        ]

        await createMany(this.page, 'add-button-grant', numberOfGrants)
        await fillGroup(this.page, 'single-grant-group', groupFields)
    }
}
