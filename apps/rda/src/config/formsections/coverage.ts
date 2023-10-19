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
      name: 'geolocation',
      label: {
        en: 'Geolocation',
        nl: 'Geolocatie',
      },
      required: true,
      description: {
        en: 'The location(s) that the deposit deals with',
        nl: 'De locatie(s) waar het deposit over gaat',
      },
      options: 'geonames',
      multiselect: true,
    },
    {
      type: 'group',
      name: 'date_time',
      label: {
        en: 'Data Time and Date',
        nl: 'Data Tijd en Datum',
      },
      repeatable: true,
      description: {
        en: 'The dates and times the deposit deals with',
        nl: 'De data en tijden waarover het deposit gaat',
      },
      fields: [
        {
          type: 'date',
          format: 'DD-MM-YYYY HH:mm',
          name: 'start',
          label: {
            en: 'Start',
            nl: 'Start',
          },
          required: true,
          description: {
            en: 'The start of a period the deposit covers',
            nl: 'Start van een periode waar het deposit over gaat',
          },
        },
        {
          type: 'date',
          format: 'DD-MM-YYYY HH:mm',
          name: 'end',
          label: {
            en: 'End',
            nl: 'Eind',
          },
          description: {
            en: 'The end of a period the deposit covers',
            nl: 'Eind van een periode waar het deposit over gaat',
          },
        }
      ]
    },
    {
      type: 'autocomplete',
      name: 'keywords',
      label: {
        en: 'Keywords',
        nl: 'Trefwoorden',
      },
      required: true,
      description: {
        en: 'List of relevant keywords',
        nl: 'Een lijst van relevante trefwoorden',
      },
      multiApiValue: 'domains',
      options: ['domains'],
      multiselect: true,
      allowFreeText: false,
    },
    {
      type: 'autocomplete',
      name: 'keywordsDomain',
      label: {
        en: 'Keywords - Domain',
        nl: 'Trefwoorden - Domein',
      },
      required: true,
      description: {
        en: 'List of relevant keywords',
        nl: 'Een lijst van relevante trefwoorden',
      },
      options: 'domains',
      multiselect: true,
      allowFreeText: false,
    },
    {
      type: 'autocomplete',
      name: 'keywordsOrigin',
      label: {
        en: 'Keywords - Origin',
        nl: 'Trefwoorden - Herkomst',
      },
      required: true,
      description: {
        en: 'List of relevant keywords',
        nl: 'Een lijst van relevante trefwoorden',
      },
      options: "rdaworkinggroups",
      multiselect: true,
      allowFreeText: false,
    },
    {
      type: 'autocomplete',
      name: 'keywordsPathways',
      label: {
        en: 'Keywords - Pathways',
        nl: 'Trefwoorden - Trajecten',
      },
      required: false,
      description: {
        en: 'List of relevant keywords',
        nl: 'Een lijst van relevante trefwoorden',
      },
      options: "pathways",
      multiselect: true,
      allowFreeText: false,
    },
    {
      type: 'autocomplete',
      name: 'keywordsGorc',
      label: {
        en: 'Keywords - GORC',
        nl: 'Trefwoorden - GORC',
      },
      required: true,
      description: {
        en: 'Links to Global Open Research Commons Elements and Features',
        nl: 'Links naar Global Open Research Commons Elementen en Features',
      },
      options: 'gorc',
      multiselect: true,
      allowFreeText: false,
    },
  ],
};

export default section;