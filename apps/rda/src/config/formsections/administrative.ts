import type { InitialSectionType } from "@dans-framework/deposit";

// Form section config for publisher.
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
        {
          label: "Research Data Alliance - Related Documents",
          value: "rda-related",
          url: "https://zenodo.org/communities/rda-related",
        },
        {
          label: "RDA TIGER",
          value: "rda-tiger",
          url: "https://zenodo.org/communities/rda-tiger",
        },
      ],
      value: {
        label: "Research Data Alliance",
        value: "rda",
        url: "https://zenodo.org/communities/rda",
      },
    },
    {
      type: "text",
      name: "doi",
      label:  {
        en: "Exisiting Digital Object Identifier",
        nl: "Al bestaande Digital Object Identifier",
      },
      description: {
        en: "Fill this in if you already have a Digital Object Identifier for this deposit, otherwise leave blank.",
        nl: "Vul dit in als u al een Digitaal Object Identifier voor dit deposit heeft. Laat anders leeg.",
      },
      noIndicator: true,
    },
  ],
};

export default section;
