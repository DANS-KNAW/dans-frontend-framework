import type { InitialSectionType } from "@dans-framework/deposit";

const section: InitialSectionType = {
  id: "administrative",
  title: {
    en: "Administrative",
    nl: "Administratief",
  },
  fields: [
    {
      type: "text",
      name: "depositor",
      label: {
        en: "Depositor",
        nl: "Depositor",
      },
      required: true,
      description: {
        en: "The person who deposits the dataset",
        nl: "De persoon die het dataset deponeert",
      },
      autofill: "name",
      disabled: true,
    },
    {
      type: "date",
      name: "created",
      label: {
        en: "Created",
        nl: "Aangemaakt",
      },
      required: true,
      description: {
        en: "Date of creation of the deposit",
        nl: "Datum van aanmaak van het deposit",
      },
      format: "DD-MM-YYYY",
      autofill: "dateNow",
      disabled: true,
    },
    {
      type: "date",
      name: "modified",
      label: {
        en: "Modified",
        nl: "Gewijzigd",
      },
      required: false,
      description: {
        en: "Date of last modification of the deposit",
        nl: "Datum van laatste wijziging van het deposit",
      },
      format: "DD-MM-YYYY",
      autofill: "dateNow",
    },
    {
      type: "date",
      name: "available",
      label: {
        en: "Available",
        nl: "Beschikbaar",
      },
      required: false,
      description: {
        en: "Date of availability of the deposit",
        nl: "Datum van beschikbaarheid van het deposit",
      },
      format: "DD-MM-YYYY",
      autofill: "dateNow",
    },
    {
      type: "autocomplete",
      name: "language",
      label: {
        en: "Language",
        nl: "Taal",
      },
      required: true,
      description: {
        en: "Language of the deposit",
        nl: "Taal van het deposit",
      },
      options: "languageList",
      value: { label: "English", value: "en" },
    },
    {
      type: "autocomplete",
      required: true,
      label: {
        en: "Zenodo Community",
        nl: "Zenodo Community",
      },
      name: "zenodoCommunity",
      description: {
        en: "The Zenodo community to which the deposit belongs",
        nl: "De Zenodo community waartoe het deposit behoort",
      },
      options: [
        {
          label: "Research Data Alliance",
          value: "rda",
          url: "https://zenodo.org/communities/rda",
        },
        // {
        //   label: "Research Data Alliance - Related Documents",
        //   value: "rda-related",
        //   url: "https://zenodo.org/communities/rda-related",
        // },
        // {
        //   label: "RDA TIGER",
        //   value: "rda-tiger",
        //   url: "https://zenodo.org/communities/rda-tiger",
        // },
      ],
      value: {
        label: "Research Data Alliance",
        value: "rda",
        url: "https://zenodo.org/communities/rda",
      },
    },
    {
      type: "text",
      name: "maintenancePlan",
      label: {
        en: "Maintenance and Retirement Plan",
        nl: "Onderhouds- en Bewaarplan",
      },
      multiline: true,
      fullWidth: true,
      description: {
        en: "Describe how this deposit will be maintained over time and under what conditions it will be retired.",
        nl: "Beschrijf hoe dit deposit in de loop van de tijd zal worden onderhouden en onder welke voorwaarden het zal worden beëindigd.",
      },
    },
  ],
};

export default section;
