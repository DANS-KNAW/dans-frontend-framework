import type { InitialSectionType } from '@dans-framework/deposit';

const relationships = [
  "Conforms to",
  "Has Format",
  "Has part",
  "References",
  "Replaces",
  "Requires",
  "Has version",
  "Is format of",
  "Is part of",
  "Is referenced by",
  "Is replaced by",
  "Is required by",
  "Is version of",
];

const section: InitialSectionType = {
  id: 'relations',
  title: {
    en: 'Relations',
    nl: 'Relaties',
  },
  fields: [
    {
      type: 'autocomplete',
      label: {
        en: 'Audience',
        nl: 'Publiek',
      },
      name: 'audience',
      multiselect: true,
      description: {
        en: 'Humanities; Arts and Culture; History of Arts and Architecture (for example)',
        nl: 'Bijvoorbeeld geesteswetenschappen, kunst en cultuur, etc.',
      },
      options: 'narcis',
    },
    {
      type: 'group',
      label: {
        en: 'Related to',
        nl: 'Gerelateerd aan',
      },
      name: 'relation',
      repeatable: true,
      description: {
        en: 'Other interviews, publications, projects',
        nl: 'Andere interviews, publicaties, projecten',
      },
      fields: [
        {
          type: 'autocomplete',
          label: {
            en: 'Type of relation',
            nl: 'Type relatie',
          },
          name: 'relation_type',     
          description: {
            en: 'The type of relation to this external item',
            nl: 'Type relatie met dit externe item',
          },
          options: relationships.map((r: string) => ({label: r, value: r})),
        },
        {
          type: 'text',
          label: {
            en: 'Related item',
            nl: 'Gerelateerd item',
          },
          name: 'relation_item',     
          description: {
            en: 'Title of an external item related to this dataset',
            nl: 'Titel van een extern item gerelateerd aan deze dataset',
          },
        },
        {
          type: 'text',
          label: {
            en: 'Item reference',
            nl: 'Item referentie',
          },
          name: 'relation_reference',
          placeholder: 'https://...',
          validation: 'uri',
          description: {
            en: 'A web link or PID reference for this external item',
            nl: 'Een weblink of PID referentie naar dit externe item',
          },
        },
      ],
    },
  ],
};

export default section;