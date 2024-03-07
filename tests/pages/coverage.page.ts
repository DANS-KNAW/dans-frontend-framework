import { Page } from '@playwright/test';
import { clickAndFillApiDropdown, createMany, fillGroup, GroupField } from '../utils';

export class CoveragePage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async openTab() {
        await this.page.getByRole('button', { name: 'Coverage' }).click();
    }

    async setLocation() {
        await clickAndFillApiDropdown(this.page, 'subject_keywords', 'subjectKeywords', 'country.json', '**/searchJSON?q=*&username=*')
    }

    async setPeriods(numberOfPeriods: number) {
        const groupFields: GroupField[] = [
            {
                fieldName: 'subject_date_time_start',
                fieldValue: '1234',
                isDropdown: false,
                isDateField: true
            },
            {
                fieldName: 'subject_date_time_end',
                fieldValue: '5678',
                isDropdown: false,
                isDateField: true
            }
        ]

        await createMany(this.page, 'add-button-subject_date_time', numberOfPeriods)
        await fillGroup(this.page, 'single-subject_date_time', groupFields)
    }
}
