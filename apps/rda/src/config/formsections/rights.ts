import type { InitialSectionType } from '@dans-framework/deposit';

const section: InitialSectionType = {
  id: 'rights',
  title: {
    en: 'Rights, licencing and re-use',
    nl: 'Rechten, licenties en hergebruik',
  },
  fields: [
    {
      type: 'autocomplete',
      name: 'rightsholder',
      label: {
        en: 'Rights holder',
        nl: 'Rechthebbende',
      },
      required: true,
      description: {
        en: 'Name of the organisation or individual(s) owning the work',
        nl: 'Naam van de organisatie of personen die eigenaar zijn van het werk',
      },
      multiApiValue: 'orcid',
      options: ['ror', 'orcid'],
    },
    {
      type: 'autocomplete',
      name: 'accessTypes',
      label: {
        en: 'Access types',
        nl: 'Toegangstypen',
      },
      required: true,
      description: {
        en: 'The access types that apply to this deposit',
        nl: 'De toegangstypen die van toepassing zijn op dit deposit',
      },
      options: [
        {
          label: {
            en: 'Open',
            nl: 'Open',
          },
          value: 'open',
        },
        {
          label: {
            en: 'Embargoed',
            nl: 'Embargoed',
          },
          value: 'embargoed',
        },
        {
          label: {
            en: 'Restricted',
            nl: 'Beperkt',
          },
          value: 'restricted',
        },
        {
          label: {
            en: 'Closed',
            nl: 'Gesloten',
          },
          value: 'closed',
        }
      ], 
    },
    {
      type: 'autocomplete',
      name: 'licence',
      label: {
        en: 'Licence',
        nl: 'Licentie',
      },
      required: true,
      description: {
        en: 'One of a number of specific licences',
        nl: 'Eén of meerdere specifieke licenties',
      },
      options: 'licenses',
    },
  ],
};

export default section;