import type { InitialSectionType } from "@dans-framework/deposit";

const section: InitialSectionType = {
  id: "citation",
  title: {
    en: "Citation",
    nl: "Citaten",
  },
  fields: [
    {
      type: "text",
      name: "title",
      label: {
        en: "Title",
        nl: "Titel",
      },
      required: true,
      description: {
        en: "Title of the deposit",
        nl: "Titel van het deposit",
      },
    },
    {
      type: "text",
      name: "subtitle",
      label: {
        en: "Subtitle",
        nl: "Ondertitel",
      },
      description: {
        en: "Optional subtitle for the deposit",
        nl: "Optionele ondertitel bij het deposit",
      },
      repeatable: true,
    },
    {
      type: "autocomplete",
      name: "publisher",
      label: {
        en: "Publisher",
        nl: "Uitgever",
      },
      required: true,
      description: {
        en: "Institution - often the rights holder",
        nl: "Instituut - vaak de rechthebbende",
      },
      options: "ror",
    },
    {
      type: "text",
      name: "version",
      label: {
        en: "Version",
        nl: "Versie",
      },
      description: {
        en: "Version of the resource (e.g., 1.0.0). Semantic versioning is recommended.",
        nl: "Versie van de resource (bijv. 1.0.0). Semantische versiebeheer wordt aanbevolen.",
      },
    },
    {
      type: "date",
      name: "publicationDate",
      label: {
        en: "Publication date",
        nl: "Publicatiedatum",
      },
      required: true,
      description: {
        en: "Date of publication",
        nl: "Datum van publicatie",
      },
      format: "DD-MM-YYYY",
      autofill: "dateNow",
    },
    {
      type: "text",
      name: "description",
      label: {
        en: "Description",
        nl: "Beschrijving",
      },
      multiline: true,
      required: true,
      description: {
        en: "Some context on the deposit.",
        nl: "Wat context bij het deposit.",
      },
    },
    {
      type: "autocomplete",
      name: "firstAuthor",
      label: {
        en: "Author",
        nl: "Auteur",
      },
      required: true,
      options: "orcid",
      allowFreeText: true,
      description: {
        en: "Author for this deposit. Every submission requires at least one author to be specified. Additional contributors can be added in the Contributors section below.",
        nl: "Auteur voor dit deposit. Elke inzending vereist dat ten minste één auteur wordt opgegeven. Extra bijdragers kunnen worden toegevoegd in de sectie Bijdragers hieronder.",
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
      type: "group",
      name: "contributors",
      label: {
        en: "Contributors",
        nl: "Bijdragers",
      },
      description: {
        en: "Add one or more contributors.",
        nl: "Voeg een of meerdere bijdragers toe",
      },
      repeatable: true,
      fields: [
        {
          type: "autocomplete",
          name: "contributor",
          toggleRequired: ["contributorType"],
          label: {
            en: "Contributor",
            nl: "Bijdrager",
          },
          description: {
            en: "Orcid of the contributor",
            nl: "Orcid van de bijdrager",
          },
          options: "orcid",
          allowFreeText: true,
        },
        {
          type: "autocomplete",
          name: "contributorType",
          toggleRequired: ["contributor"],
          label: {
            en: "Contributor type",
            nl: "Type bijdrager",
          },
          description: {
            en: "Type of contribution",
            nl: "Type bijdrage",
          },
          options: [
            {
              label: {
                en: "Author",
                nl: "Auteur",
              },
              value: "Author",
            },
            {
              label: {
                en: "Contact Person",
                nl: "Contactpersoon",
              },
              value: "ContactPerson",
            },
            {
              label: {
                en: "Data Collector",
                nl: "Data Verzamelaar",
              },
              value: "DataCollector",
            },
            {
              label: {
                en: "Data Curator",
                nl: "Data Curator",
              },
              value: "DataCurator",
            },
            {
              label: {
                en: "Data Manager",
                nl: "Data Beheerder",
              },
              value: "DataManager",
            },
            {
              label: {
                en: "Distributor",
                nl: "Distributeur",
              },
              value: "Distributor",
            },
            {
              label: {
                en: "Editor",
                nl: "Redacteur",
              },
              value: "Editor",
            },
            {
              label: {
                en: "Hosting Institution",
                nl: "Hostende Instelling",
              },
              value: "HostingInstitution",
            },
            {
              label: {
                en: "Other",
                nl: "Overige",
              },
              value: "Other",
            },
            {
              label: {
                en: "Producer",
                nl: "Producent",
              },
              value: "Producer",
            },
            {
              label: {
                en: "Project Leader",
                nl: "Projectleider",
              },
              value: "ProjectLeader",
            },
            {
              label: {
                en: "Project Manager",
                nl: "Projectmanager",
              },
              value: "ProjectManager",
            },
            {
              label: {
                en: "Project Member",
                nl: "Projectlid",
              },
              value: "ProjectMember",
            },
            {
              label: {
                en: "Registration Agency",
                nl: "Registratieagentschap",
              },
              value: "RegistrationAgency",
            },
            {
              label: {
                en: "Registration Authority",
                nl: "Registratieautoriteit",
              },
              value: "RegistrationAuthority",
            },
            {
              label: {
                en: "Related Person",
                nl: "Gerelateerde Persoon",
              },
              value: "RelatedPerson",
            },
            {
              label: {
                en: "Researcher",
                nl: "Onderzoeker",
              },
              value: "Researcher",
            },
            {
              label: {
                en: "Research Group",
                nl: "Onderzoeksgroep",
              },
              value: "ResearchGroup",
            },
            {
              label: {
                en: "Rights Holder",
                nl: "Rechthebbende",
              },
              value: "RightsHolder",
            },
            {
              label: {
                en: "Sponsor",
                nl: "Sponsor",
              },
              value: "Sponsor",
            },
            {
              label: {
                en: "Supervisor",
                nl: "Supervisor",
              },
              value: "Supervisor",
            },
            {
              label: {
                en: "Work Package Leader",
                nl: "Werkpakketleider",
              },
              value: "WorkPackageLeader",
            },
          ],
        },
      ],
    },
  ],
};

export default section;
