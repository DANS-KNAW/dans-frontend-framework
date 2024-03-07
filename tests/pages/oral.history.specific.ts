import { Page } from '@playwright/test';
import { clickAndFill, clickAndFillApiDropdown, createMany, fillGroup, GroupField} from '../utils';

export class OralHistorySpecificPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async openTab() {
        await this.page.getByRole('button', { name: 'Oral-history specific' }).click();
    }

    async setInterviewee() {
        const extraFields = ['preferred_name', 'dob', 'function']
        const groupFields = generatePersonGroupFields("interviewee", extraFields)
        await fillGroup(this.page, 'single-interviewee-group', groupFields)
    }

    async setInterviewers(numberOfInterviewers: number) {
        await createMany(this.page, 'add-button-interviewer', numberOfInterviewers)
        const extraFields = ['preferred_name', 'dob', 'function']
        const groupFields = generatePersonGroupFields("interviewer", extraFields)
        await fillGroup(this.page, 'single-interviewer-group', groupFields)
    }

    async setInterpreters(numberOfInterpreters: number) {
        await createMany(this.page, 'add-button-interpreter', numberOfInterpreters)
        const extraFields = ['function']
        const groupFields = generatePersonGroupFields("interpreter", extraFields)
        await fillGroup(this.page, 'single-interpreter-group', groupFields)
    }

    async setOthersPresent(numberOfOtherPresent: number) {
        await createMany(this.page, 'add-button-others', numberOfOtherPresent)
        const extraFields = ['function']
        const groupFields = generatePersonGroupFields("others", extraFields)
        await fillGroup(this.page, 'single-others-group', groupFields)
    }

    async setRecordingBy(numberOfRecorders: number) {
        await createMany(this.page, 'add-button-recorded_by', numberOfRecorders)
        const groupFields = generatePersonGroupFields("recorded_by", [])
        await fillGroup(this.page, 'single-recorded_by-group', groupFields)
    }

    async setDateAndTime(numberOfDates: number) {
        const groupFields: GroupField[] = [
            {
                fieldName: 'interview_date_time_start',
                fieldValue: '131220001225', //  13-12-2000 12:25
                isDropdown: false,
                isDateField: true
            },
            {
                fieldName: 'interview_date_time_end',
                fieldValue: '131220011225', //  13-12-2001 12:25
                isDropdown: false,
                isDateField: true
            }
        ]

        await createMany(this.page, 'add-button-interview_date_time', numberOfDates)
        await fillGroup(this.page, 'single-interview_date_time-group', groupFields)
    }

    async setTranscribers(numberOfTranscribers: number) {
        await createMany(this.page, 'add-button-transcript_human', numberOfTranscribers)
        const groupFields = generatePersonGroupFields('transcript_human', ['function'])
        await fillGroup(this.page, 'single-transcript_human-group', groupFields)
    }

    async setSectionLessElements() {
        await clickAndFillApiDropdown(this.page, 'interview_location', 'Kingdom of the Netherlands', 'country.json', '**/searchJSON?q=*&username=*')

        // select and fill Recording format, the regex picks up two elements
        await this.page.getByTestId(RegExp('recording_format')).first().click();
        await this.page.getByTestId(RegExp('recording_format')).first().pressSequentially('mp3');
        await this.page.getByRole('option', { name: new RegExp('mp3') }).click();

        await clickAndFill(this.page, 'recording_equipment', 'recording equipment')
        await clickAndFill(this.page, 'transcript_machine', 'transcript machine')
    }
}

/**
 * Generate GroupField for people/roles like author, interviewer, etc.
 * 
 * There are a couple of default fields that are shared by all people/roles.
 * If needed, you can supply additional fields.
 * 
 * @param role Role of the person
 * @param additionalFields Additional fields for this role
 * @returns GroupField
 */
function generatePersonGroupFields(role: string, additionalFields: string[]): GroupField[] {
    // All possible fields, including optional and required
    const allFields = {
        first_name: { fieldValue: 'first name', isDropdown: false, isDateField: false},
        last_name: { fieldValue: 'last name', isDropdown: false, isDateField: false },
        preferred_name: { fieldValue: 'preferred name', isDropdown: false, isDateField: false },
        dob: { fieldValue: '13-12-1970', isDropdown: false, isDateField: true },
        function: { fieldValue: 'function', isDropdown: false, isDateField: false},
        affiliation: { fieldValue: 'affiliation', isDropdown: false, isDateField: false },
    };

    const defaultFieldNames = ['first_name', 'last_name', 'affiliation'];
    const additionalFieldNames = [...new Set([...defaultFieldNames, ...additionalFields])];

    return additionalFieldNames.map(fieldName => ({
        fieldName: `${role}_${fieldName}`,
        fieldValue: allFields[fieldName].fieldValue,
        isDropdown: allFields[fieldName].isDropdown,
        isDateField: allFields[fieldName].isDateField,
    }));
}