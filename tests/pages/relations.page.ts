import { Page } from '@playwright/test';
import { clickAndFillApiDropdown, createMany, fillGroup, GroupField } from '../utils';

export class RelationsPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async openTab() {
        await this.page.getByRole('button', { name: 'Relations' }).click();
    }

    async setAudience(){
        await clickAndFillApiDropdown(this.page, 'audience', 'chemistry', 'audience.json', '**/search?query=*')
    }

    async setRelatedTo(numberOfRelations: number){
        const groupFields: GroupField[] = [
            {
                fieldName: 'relation_type',
                fieldValue: 'Conforms to',
                isDropdown: true
            },
            {
                fieldName: 'relation_item',
                fieldValue: 'related item',
                isDropdown: false,
            },
            {
                fieldName: 'relation_reference',
                fieldValue: 'https://dans.knaw.nl',
                isDropdown: false,
                isUrlField: true
            }
        ]

        await createMany(this.page, 'add-button-relation', numberOfRelations)
        await fillGroup(this.page, 'single-relation', groupFields)
    }

}