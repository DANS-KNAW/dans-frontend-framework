import type { InitialSectionType } from '@dans-framework/deposit';

const section: InitialSectionType = {
  id: 'coverage',
  title: {
    en: 'Coverage',
    nl: 'Dekking',
  },
  fields: [
    {
      type: 'autocomplete',
      label: {
        en: 'Subject keywords',
        nl: 'Trefwoorden bij onderwerp',
      },
      name: 'subject_keywords',
      required: true,
      multiselect: true,
      description: {
        en: 'List of relevant keywords: Audiovisual-specific',
        nl: 'Een lijst van audiovisueelspecifieke relevante trefwoorden',
      },
      options: 'getty',
      allowFreeText: true,
      value: [{
        label: 'oral history (discipline)',
        value: 'http://vocab.getty.edu/page/aat/300054402',
        mandatory: true,
      }],
    },
    {
      type: 'autocomplete',
      label: {
        en: 'Location(s) covered in the interview',
        nl: 'Locatie(s) besproken in het interview',
      },
      name: 'subject_location',
      required: true,
      multiselect: true,
      description: {
        en: 'The location(s) that the interview material deals with',
        nl: 'De locatie(s) waar het interview over gaat',
      },
      options: 'geonames',
    },
    {
      type: 'group',
      label: {
        en: 'Period covered in the interview',
        nl: 'Periode besproken in het interview',
      },
      name: 'subject_date_time',
      repeatable: true,
      description: {
        en: 'The dates and times the interview material deals with',
        nl: 'De data en tijden waarover het interview gaat',
      },
      fields: [
        {
          type: 'date',
          format: 'YYYY',
          formatOptions: ['YYYY', 'MM-YYYY', 'DD-MM-YYYY', 'DD-MM-YYYY HH:mm'],
          label: {
            en: 'Start of period',
            nl: 'Begin van periode',
          },
          name: 'subject_date_time_start',
          required: true,
          description: {
            en: 'The start of a period the interview covers',
            nl: 'Start van een periode waar het interview over gaat',
          },
        },
        {
          type: 'date',
          format: 'YYYY',
          formatOptions: ['YYYY', 'MM-YYYY', 'DD-MM-YYYY', 'DD-MM-YYYY HH:mm'],
          label: {
            en: 'End of period',
            nl: 'Eind van periode',
          },
          name: 'subject_date_time_end',         
          description: {
            en: 'The end of a period the interview covers',
            nl: 'Eind van een periode waar het interview over gaat',
          },
        },
      ],
    },
  ],
};

export default section;