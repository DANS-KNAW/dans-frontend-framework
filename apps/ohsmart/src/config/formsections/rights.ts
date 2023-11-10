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
      allowFreeText: true,
      label: {
        en: 'Rights holder',
        nl: 'Rechthebbende',
      },
      name: 'rightsholder',
      required: true,
      description: {
        en: 'State the organisation or individual that is holder of the intellectual property rights. For datasets, these rights are usually vested in the organisation thet employs the data creator(s). Note that the depositor (account used to deposit the data and metadata will be contacted for access requests, and must have the consent of the rights holder to publish the data.',
        nl: 'Vermeld de organisatie of individu die de intellectuele eigendomsrechten bezit. Voor datasets liggen deze rechten meestal bij de organisatie die de maker(s) van de data in dienst heeft. Let op: de deposant (het account dat wordt gebruikt om de data en metadata te deponeren) wordt gecontacteerd voor toegangsverzoeken en moet de toestemming van de rechthebbende hebben om de data te publiceren.',
      },
      multiApiValue: 'orcid',
      options: ['ror', 'orcid'],
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
        nl: 'Eén van de volgende specifieke licenties',
      },
      options: [
        {
          label: {
            en: 'DANS Licence',
            nl: 'DANS Licentie',
          },
          value: 'https://dans.knaw.nl/wp-content/uploads/2022/01/DANS_Licence_EN.pdf',
        },
        {
          label: 'CC0-1.0',
          value: 'https://creativecommons.org/publicdomain/zero/1.0/',
        },
        {
          label: 'CC-BY-4.0',
          value: 'https://creativecommons.org/licenses/by/4.0/',
        },
        {
          label: 'CC-BY-SA-4.0',
          value: 'https://creativecommons.org/licenses/by-sa/4.0/',
        },
        {
          label: 'CC BY-NC 4.0',
          value: 'https://creativecommons.org/licenses/by-nc/4.0/',
        },
        {
          label: 'CC BY-ND 4.0',
          value: 'https://creativecommons.org/licenses/by-nd/4.0/',
        },
        {
          label: 'CC BY-NC-ND 4.0',
          value: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
        },
        {
          label: 'CC BY-NC-SA 4.0',
          value: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
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