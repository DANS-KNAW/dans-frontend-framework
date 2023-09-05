import type { InitialSectionType } from '@dans-framework/deposit';

const section: InitialSectionType = {
  id: 'citation',
  title: {
    en: 'Citation',
    nl: 'Citaten',
  },
  fields: [
    {
      type: 'text',
      label:  {
        en: 'Title',
        nl: 'Titel',
      },
      name: 'title',
      required: true,
      description:  {
        en: 'Title of the interview',
        nl: 'Titel van het interview',
      },
    },
    {
      type: 'text',
      label:  {
        en: 'Subtitle',
        nl: 'Ondertitel',
      },
      name: 'subtitle',
      description:  {
        en: 'Optional subtitle for the interview',
        nl: 'Optionele ondertitel bij het interview',
      },
    },
    {
      type: 'text',
      label: {
        en: 'Description',
        nl: 'Beschrijving',
      },
      name: 'description',
      multiline: true,
      required: true,
      description: {
        en: 'Some context on the interview. What is the role and relevance of the interviewee in the project? What led to the interview being conducted? Summary of what was discussed in the interview, with time breakdown, and describe important events in the interview. Improves discoverability and reusability of the interview data. Briefly describe the setting and atmosphere of the interview to indicate what does not emerge when only the text is read.',
        nl: 'Wat context bij het interview. Wat is de rol en relevantie van de geinterviewde bij dit project? Waarom is dit interview afgenomen? Samenvatting van wat er besproken is in het interview, met een tijdindicatie. Beschrijf belangrijke gebeurtenissen in hter interview. Verbetert zichtbaarheid en herbruikbaarheid van de data. Beschrijf kort de setting en sfeer van het interview om meer dan alleen de tekst die gelezen wordt duidelijk te maken.'
      },
    },
    {
      type: 'autocomplete',
      label: {
        en: 'Subject',
        nl: 'Onderwerp',
      },
      name: 'subject',
      required: true,
      multiselect: true,
      description: {
        en: 'Broad data station end use community or domain',
        nl: '',
      },
      options: 'narcis',
      value: [{
        label: 'Humanities',
        value: 'https://www.narcis.nl/classification/D30000',
        id: 'D30000',
      }],
    },
    {
      type: 'autocomplete',
      label: {
        en: 'Publisher',
        nl: 'Uitgever',
      },
      name: 'publisher',
      required: true,
      description: {
        en: 'Institution - often the rights holder',
        nl: 'Instituut - vaak de rechthebbende',
      },
      options: 'ror',
      allowFreeText: true,
    },
    {
      type: 'text',
      label: {
        en: 'Depositor',
        nl: 'Indiener',
      },
      name: 'depositor',
      disabled: true,
      autofill: 'email',
    },
    {
      type: 'group',
      label: {
        en: 'Author',
        nl: 'Auteur',
      },
      name: 'author',
      repeatable: true,
      description: {
        en: 'Add one or more authors.',
        nl: 'Voeg een of meerdere auteurs toe',
      },
      fields: [
        {
          type: 'autocomplete',
          label: {
            en: 'Name',
            nl: 'Naam',
          },
          name: 'name',
          required: true,
          description: {
            en: 'First and last name',
            nl: 'Voor en achternaam',
          },
          options: 'orcid',
          allowFreeText: true,
        },
        {
          type: 'text',
          label: {
            en: 'Affiliation',
            nl: 'Affiliatie',
          },
          name: 'affiliation',
          required: true,
          description: {
            en: '',
            nl: '',
          },
        },
      ]
    },
    {
      type: 'group',
      label: {
        en: 'Grant information',
        nl: 'Beursinformatie',
      },
      name: 'grant',
      repeatable: true,
      description: {
        en: 'Optional information if a grant was involved in financing the project',
        nl: 'Optionele informatie als het project met behulp van subsidie tot stand is gekomen',
      },
      fields: [
        {
          type: 'text',
          label: {
            en: 'Grant agency',
            nl: 'Subsidieverstrekker',
          },
          name: 'grant_agency',
        },
        {
          type: 'text',
          label: {
            en: 'Grant number/identifier',
            nl: 'Dossiernummer van de verstrekte subsidie',
          },
          name: 'grant_number',
        },
      ]
    },   
  ],
};

export default section;