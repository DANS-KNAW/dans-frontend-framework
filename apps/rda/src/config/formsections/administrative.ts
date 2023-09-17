import languageList from '../data/languageList.json';
import type { InitialSectionType } from '@dans-framework/deposit';

const section: InitialSectionType = {
  id: 'administrative',
  title: {
    en: 'Administrative',
    nl: 'Administratief',
  },
  fields: [
    {
      type: 'text',
      name: 'identifier',
      label: {
        en: 'Identifier',
        nl: 'Identificatie',
      },
      required: true,
      description: {
        en: 'Unique identifier for the dataset',
        nl: 'Unieke identificatie voor het dataset',
      },
    },
    {
      type: 'text',
      name: 'depositor',
      label: {
        en: 'Depositor',
        nl: 'Depositor',
      },
      required: true,
      description: {
        en: 'The person who deposits the dataset',
        nl: 'De persoon die het dataset deponeert',
      },
      autofill: 'name',
      disabled: true,
    },
    {
      type: 'date',
      name: 'created',
      label: {
        en: 'Created',
        nl: 'Aangemaakt',
      },
      required: true,
      description: {
        en: 'Date of creation of the deposit',
        nl: 'Datum van aanmaak van het deposit',
      },
      format: 'DD-MM-YYYY HH:mm',
    },
    {
      type: 'date',
      name: 'modified',
      label: {
        en: 'Modified',
        nl: 'Gewijzigd',
      },
      required: true,
      description: {
        en: 'Date of last modification of the deposit',
        nl: 'Datum van laatste wijziging van het deposit',
      },
      format: 'DD-MM-YYYY HH:mm',
    },
    {
      type: 'date',
      name: 'available',
      label: {
        en: 'Available',
        nl: 'Beschikbaar',
      },
      required: true,
      description: {
        en: 'Date of availability of the deposit',
        nl: 'Datum van beschikbaarheid van het deposit',
      },
      format: 'DD-MM-YYYY HH:mm',
    },
    {
      type: 'autocomplete',
      name: 'language',
      label: {
        en: 'Language',
        nl: 'Taal',
      },
      required: true,
      description: {
        en: 'Language of the deposit',
        nl: 'Taal van het deposit',
      },
      options: languageList,
    },
  ],
};

export default section;