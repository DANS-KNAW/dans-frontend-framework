import languageList from '../data/languageList.json';
import type { InitialSectionType } from '@dans-framework/deposit';

const section: InitialSectionType = {
  id: 'citation_metadata',
  title: {
    en: 'Citation Metadata',
    nl: 'Citation Metadata',
  },
  fields: [
    {
      type: 'text',
      name: 'title',
      label: {
        en: 'Title',
        nl: 'Titel',
      },
      required: true,
      description: {
        en: 'Title of the dataset',
        nl: 'Titel van het dataset',
      },
    },
    {
      type: 'autocomplete',
      name: 'subject',
      label: {
        en: 'Subject',
        nl: 'Onderwerp',
      },
      required: true,
      options: [
        {
          label: {
            en: "Agricultural Sciences",
            nl: 'Agrarische wetenschappen',
          },
          value: "Agricultural Sciences",
        },
        {
          label: {
            en: "Arts and Humanities",
            nl: 'Kunst en Geesteswetenschappen',
          },
          value: "Arts and Humanities",
        },
        {
          label: {
            en: 'Astronomy and Astrophysics',
            nl: 'Astronomie en Astrofysica',
          },
          value: 'Astronomy and Astrophysics',
        },
        {
          label: {
            en: 'Business and Management',
            nl: 'Bedrijfskunde en Management',
          },
          value: 'Business and Management',
        },
        {
          label: {
            en: 'Chemistry',
            nl: 'Chemie',
          },
          value: 'Chemistry',
        },
        {
          label: {
            en: 'Computer and Information Science',
            nl: 'Computer- en Informatiewetenschappen',
          },
          value: 'Computer and Information Science',
        },
        {
          label: {
            en: 'Earth and Environmental Sciences',
            nl: 'Aard- en Milieuwetenschappen',
          },
          value: 'Earth and Environmental Sciences',
        },
        {
          label: {
            en: 'Engineering',
            nl: 'Techniek',
          },
          value: 'Engineering',
        },
        {
          label: {
            en: 'Law',
            nl: 'Rechten',
          },
          value: 'Law',
        },
        {
          label: {
            en: 'Mathematical Sciences',
            nl: 'Wiskunde',
          },
          value: 'Mathematical Sciences',
        },
        {
          label: {
            en: 'Medicine, Health and Life Sciences',
            nl: 'Geneeskunde, Gezondheid en Levenswetenschappen',
          },
          value: 'Medicine, Health and Life Sciences',
        },
        {
          label: {
            en: 'Physics',
            nl: 'Natuurkunde',
          },
          value: 'Physics',
        },
        {
          label: {
            en: 'Social Sciences',
            nl: 'Sociale Wetenschappen',
          },
          value: 'Social Sciences',
        },
        {
          label: {
            en: 'Other',
            nl: 'Anders',
          },
          value: 'Other',
        }
      ]
    },
    {
      type: 'text',
      name: 'author',
      label: {
        en: 'Author',
        nl: 'Auteur',
      },
      autofill: 'name',
      required: true,
      description: {
        en: 'Author of the dataset',
        nl: 'Auteur van het dataset',
      },
    },
    {
      type: 'text',
      label: {
        en: 'Email',
        nl: 'Email',
      },
      name: 'contact_email',
      autofill: 'email',
      disabled: true,
    },
    {
      type: 'group',
      label: {
        en: 'Additional Authors',
        nl: 'Extra auteurs',
      },
      name: 'additional_authors',
      repeatable: true,
      description: {
        en: 'Additional authors of the dataset and or software',
        nl: 'Extra auteurs van het dataset en of software',
      },
      fields: [
        {
          type: 'text',
          name: 'additional_author',
          label: {
            en: 'Additional Author',
            nl: 'Extra auteur',
          },
        },
        {
          type: 'autocomplete',
          name: 'additional_author_type',
          label: {
            en: 'Type',
            nl: 'Type',
          },
          options: [
            {
              label: {
                en: 'Dataset author',
                nl: 'Dataset auteur',
              },
              value: 'Dataset author',
            },
            {
              label: {
                en: 'Software author',
                nl: 'Software auteur',
              },
              value: 'Software author',
            },
          ]
        }
      ]
    },
    {
      type: 'text',
      name: 'SWHID',
      label: {
        en: 'Software Heritage ID (SWHID)',
        nl: 'Software Heritage ID (SWHID)',
      },
      description: {
        en: 'The Software Heritage ID (SWHID) of the software',
        nl: 'De Software Heritage ID (SWHID) van de software',
      },
    },
    {
      type: 'text',
      name: 'repository_url',
      label: {
        en: 'Repository URL',
        nl: 'Repository URL',
      },
      description: {
        en: 'The URL of the repository',
        nl: 'De URL van de repository',
      },
    },
    {
      type: 'text',
      name: 'description',
      label: {
        en: 'Description',
        nl: 'Beschrijving',
      },
      required: true,
      multiline: true,
    },
  ],
};

export default section;