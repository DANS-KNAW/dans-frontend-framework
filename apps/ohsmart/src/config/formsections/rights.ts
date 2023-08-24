const section = {
  id: 'rights',
  title: {
    en: 'Rights, licencing and re-use',
    nl: 'Rechten, licenties en hergebruik',
  },
  fields: [
    {
      type: 'autocomplete',
      freetext: true,
      label: {
        en: 'Rights holder',
        nl: 'Rechthebbende',
      },
      name: 'rightsholder',
      required: true,
      description: {
        en: 'Name of the organisation or individual(s) owning the work',
        nl: 'Naam van de organisatie of personen die eigenaar zijn van het werk',
      },
      multiApiValue: 'orcid',
      options: ['ror', 'orcid'],
      allowFreeText: true,
    },
    {
      type: 'autocomplete',
      label: {
        en: 'Licence',
        nl: 'Licentie',
      },
      name: 'licence_type',
      required: true,
      description: {
        en: 'One of a number of specific licences',
        nl: 'Eén of meerdere specifieke licenties',
      },
      options: [
        {
          label: {
            en: 'DANS Licence',
            nl: 'DANS Licentie',
          },
          value: 'dans-licence',
        },
      ],
    },
    {
      type: 'radio',
      label: {
        en: 'Does this submission contain personal data?',
        nl: 'Bevat deze dataset persoonlijke gegevens?',
      },
      name: 'personal_data',
      required: true,
      layout: 'row',
      value: 'personal_data_true',
      options: [
        {
          value: 'personal_data_true',
          label: {
            en: 'Yes',
            nl: 'Ja',
          },
        },
        {
          value: 'personal_data_false',
          label: {
            en: 'No',
            nl: 'Nee',
          },
        },
        {
          value: 'personal_data_unknown',
          label: {
            en: 'Unknown',
            nl: 'Onbekend',
          },
        },
      ],
    },
  ],
};

export default section;