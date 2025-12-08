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
      type: "autocomplete",
      name: "resourceType",
      label: {
        en: "Resource Type",
        nl: "Resource Type",
      },
      required: true,
      description: {
        en: "The type of resource being deposited",
        nl: "Het type resource dat wordt gedeponeerd",
      },
      options: [
        {
          label: {
            en: "Dataset",
            nl: "Gegevensset",
          },
          value: "dataset",
        },
        {
          label: {
            en: "Event",
            nl: "Evenement",
          },
          value: "event",
        },
        {
          label: {
            en: "Image",
            nl: "Afbeelding",
          },
          value: "image",
        },
        {
          label: {
            en: "Image / Diagram",
            nl: "Afbeelding / Diagram",
          },
          value: "image-diagram",
        },
        {
          label: {
            en: "Image / Drawing",
            nl: "Afbeelding / Tekening",
          },
          value: "image-drawing",
        },
        {
          label: {
            en: "Image / Figure",
            nl: "Afbeelding / Figuur",
          },
          value: "image-figure",
        },
        {
          label: {
            en: "Image / Other",
            nl: "Afbeelding / Overig",
          },
          value: "image-other",
        },
        {
          label: {
            en: "Image / Photo",
            nl: "Afbeelding / Foto",
          },
          value: "image-photo",
        },
        {
          label: {
            en: "Image / Plot",
            nl: "Afbeelding / Plot",
          },
          value: "image-plot",
        },
        {
          label: {
            en: "Lesson",
            nl: "Les",
          },
          value: "lesson",
        },
        {
          label: {
            en: "Model",
            nl: "Model",
          },
          value: "model",
        },
        {
          label: {
            en: "Other",
            nl: "Overig",
          },
          value: "other",
        },
        {
          label: {
            en: "Physical object",
            nl: "Fysiek object",
          },
          value: "physicalobject",
        },
        {
          label: {
            en: "Poster",
            nl: "Poster",
          },
          value: "poster",
        },
        {
          label: {
            en: "Presentation",
            nl: "Presentatie",
          },
          value: "presentation",
        },
        {
          label: {
            en: "Publication",
            nl: "Publicatie",
          },
          value: "publication",
        },
        {
          label: {
            en: "Publication / Annotation collection",
            nl: "Publicatie / Annotatie verzameling",
          },
          value: "publication-annotationcollection",
        },
        {
          label: {
            en: "Publication / Book",
            nl: "Publicatie / Boek",
          },
          value: "publication-book",
        },
        {
          label: {
            en: "Publication / Book chapter",
            nl: "Publicatie / Boekhoofdstuk",
          },
          value: "publication-section",
        },
        {
          label: {
            en: "Publication / Conference paper",
            nl: "Publicatie / Conferentiepaper",
          },
          value: "publication-conferencepaper",
        },
        {
          label: {
            en: "Publication / Conference proceeding",
            nl: "Publicatie / Conferentieverslag",
          },
          value: "publication-conferenceproceeding",
        },
        {
          label: {
            en: "Publication / Data paper",
            nl: "Publicatie / Gegevenspaper",
          },
          value: "publication-datapaper",
        },
        {
          label: {
            en: "Publication / Dissertation",
            nl: "Publicatie / Dissertatie",
          },
          value: "publication-dissertation",
        },
        {
          label: {
            en: "Publication / Journal",
            nl: "Publicatie / Tijdschrift",
          },
          value: "publication-journal",
        },
        {
          label: {
            en: "Publication / Journal article",
            nl: "Publicatie / Tijdschriftartikel",
          },
          value: "publication-article",
        },
        {
          label: {
            en: "Publication / Other",
            nl: "Publicatie / Overig",
          },
          value: "publication-other",
        },
        {
          label: {
            en: "Publication / Output management plan",
            nl: "Publicatie / Outputbeheersplan",
          },
          value: "publication-datamanagementplan",
        },
        {
          label: {
            en: "Publication / Patent",
            nl: "Publicatie / Patent",
          },
          value: "publication-patent",
        },
        {
          label: {
            en: "Publication / Peer review",
            nl: "Publicatie / Peer review",
          },
          value: "publication-peerreview",
        },
        {
          label: {
            en: "Publication / Preprint",
            nl: "Publicatie / Preprint",
          },
          value: "publication-preprint",
        },
        {
          label: {
            en: "Publication / Project deliverable",
            nl: "Publicatie / Projectresultaat",
          },
          value: "publication-deliverable",
        },
        {
          label: {
            en: "Publication / Project milestone",
            nl: "Publicatie / Projectmijlpaal",
          },
          value: "publication-milestone",
        },
        {
          label: {
            en: "Publication / Proposal",
            nl: "Publicatie / Voorstel",
          },
          value: "publication-proposal",
        },
        {
          label: {
            en: "Publication / Report",
            nl: "Publicatie / Rapport",
          },
          value: "publication-report",
        },
        {
          label: {
            en: "Publication / Software documentation",
            nl: "Publicatie / Softwaredocumentatie",
          },
          value: "publication-softwaredocumentation",
        },
        {
          label: {
            en: "Publication / Standard",
            nl: "Publicatie / Standaard",
          },
          value: "publication-standard",
        },
        {
          label: {
            en: "Publication / Taxonomic treatment",
            nl: "Publicatie / Taxonomische behandeling",
          },
          value: "publication-taxonomictreatment",
        },
        {
          label: {
            en: "Publication / Technical note",
            nl: "Publicatie / Technische notitie",
          },
          value: "publication-technicalnote",
        },
        {
          label: {
            en: "Publication / Thesis",
            nl: "Publicatie / Thesis",
          },
          value: "publication-thesis",
        },
        {
          label: {
            en: "Publication / Working paper",
            nl: "Publicatie / Werkdocument",
          },
          value: "publication-workingpaper",
        },
        {
          label: {
            en: "Software",
            nl: "Software",
          },
          value: "software",
        },
        {
          label: {
            en: "Software / Computational notebook",
            nl: "Software / Computationeel notebook",
          },
          value: "software-computationalnotebook",
        },
        {
          label: {
            en: "Video/Audio",
            nl: "Video/Audio",
          },
          value: "video",
        },
        {
          label: {
            en: "Workflow",
            nl: "Werkstroom",
          },
          value: "workflow",
        },
      ],
      value: {
        label: "Publication",
        value: "publication",
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
