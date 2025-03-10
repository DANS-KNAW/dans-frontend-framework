import type { InitialSectionType } from "@dans-framework/deposit";

const section: InitialSectionType = {
  id: "relations",
  title: {
    en: "Relations",
    nl: "Relaties",
  },
  fields: [
    {
      type: "group",
      name: "relatedWorks",
      label: {
        en: "Related Works",
        nl: "Gerelateerde Werken",
      },
      repeatable: true,
      description: {
        en: "Relation type to the related work",
        nl: "Relatie type naar het gerelateerde werk",
      },
      fields: [
        {
          type: "autocomplete",
          name: "relationType",
          label: {
            en: "Relation",
            nl: "Relatie",
          },
          required: true,
          multiselect: true,
          description: {
            en: "Other PID's, publications, projects",
            nl: "Andere PID's, publicaties, projecten",
          },
          options: [
            {
              label: {
                en: "Is Cited By",
                nl: "Wordt Geciteerd Door",
              },
              value: "isCitedBy",
            },
            {
              label: {
                en: "Cites",
                nl: "Citeert",
              },
              value: "cites",
            },
            {
              label: {
                en: "Is Supplement To",
                nl: "Is Een Supplement Op",
              },
              value: "isSupplementTo",
            },
            {
              label: {
                en: "Is Supplemented By",
                nl: "Wordt Aangevuld Door",
              },
              value: "isSupplementedBy",
            },
            {
              label: {
                en: "Is Continued By",
                nl: "Wordt Voortgezet Door",
              },
              value: "isContinuedBy",
            },
            {
              label: {
                en: "Continues",
                nl: "Gaat Verder",
              },
              value: "continues",
            },
            {
              label: {
                en: "Is Described By",
                nl: "Wordt Beschreven Door",
              },
              value: "isDescribedBy",
            },
            {
              label: {
                en: "Describes",
                nl: "Beschrijft",
              },
              value: "describes",
            },
            {
              label: {
                en: "Has Metadata",
                nl: "Heeft Metadata",
              },
              value: "hasMetadata",
            },
            {
              label: {
                en: "Is Metadata For",
                nl: "Is Metadata Voor",
              },
              value: "isMetadataFor",
            },
            {
              label: {
                en: "Is New Version Of",
                nl: "Is Nieuwe Versie Van",
              },
              value: "isNewVersionOf",
            },
            {
              label: {
                en: "Is Previous Version Of",
                nl: "Is Vorige Versie Van",
              },
              value: "isPreviousVersionOf",
            },
            {
              label: {
                en: "Is Part Of",
                nl: "Is Onderdeel Van",
              },
              value: "isPartOf",
            },
            {
              label: {
                en: "Has Part",
                nl: "Heeft Deel",
              },
              value: "hasPart",
            },
            {
              label: {
                en: "Is Referenced By",
                nl: "Wordt Verwezen Door",
              },
              value: "isReferencedBy",
            },
            {
              label: {
                en: "References",
                nl: "Verwijst",
              },
              value: "references",
            },
            {
              label: {
                en: "Is Documented By",
                nl: "Wordt Gedocumenteerd Door",
              },
              value: "isDocumentedBy",
            },
            {
              label: {
                en: "Documents",
                nl: "Documenteert",
              },
              value: "documents",
            },
            {
              label: {
                en: "Is Compiled By",
                nl: "Wordt Samengesteld Door",
              },
              value: "isCompiledBy",
            },
            {
              label: {
                en: "Compiles",
                nl: "Stelt Samen",
              },
              value: "compiles",
            },
            {
              label: {
                en: "Is Variant Form Of",
                nl: "Is Variant Vorm Van",
              },
              value: "isVariantFormOf",
            },
            {
              label: {
                en: "Is Original Form Of",
                nl: "Is Originele Vorm Van",
              },
              value: "isOrignialFormOf",
            },
            {
              label: {
                en: "Is Identical To",
                nl: "Is Identiek Aan",
              },
              value: "isIdenticalTo",
            },
            {
              label: {
                en: "Is Reviewed By",
                nl: "Wordt Beoordeeld Door",
              },
              value: "isReviewedBy",
            },
            {
              label: {
                en: "Reviews",
                nl: "Beoordeelt",
              },
              value: "reviews",
            },
            {
              label: {
                en: "Is Derived From",
                nl: "Is Afgeleid Van",
              },
              value: "isDerivedFrom",
            },
            {
              label: {
                en: "Is Source Of",
                nl: "Is Bron Van",
              },
              value: "isSourceOf",
            },
            {
              label: {
                en: "Requires",
                nl: "Vereist",
              },
              value: "requires",
            },
            {
              label: {
                en: "Is Required By",
                nl: "Is Vereist Door",
              },
              value: "isRequiredBy",
            },
            {
              label: {
                en: "Is Obsoleted By",
                nl: "Wordt Verouderd Door",
              },
              value: "isObsoletedBy",
            },
            {
              label: {
                en: "Obsoletes",
                nl: "Maakt Verouderd",
              },
              value: "obsoletes",
            },
            {
              label: {
                en: "Is Published In",
                nl: "Wordt Gepubliceerd In",
              },
              value: "isPublishedIn",
            },
          ],
        },
        {
          type: "text",
          name: "relationIdentifier",
          label: {
            en: "Identifier",
            nl: "Identificatie",
          },
          required: true,
          description: {
            en: "Identifier of the related work (PID, URL, etc.)",
            nl: "Identificatie van het gerelateerde werk (PID, URL, etc.)",
          },
        },
        {
          type: "autocomplete",
          name: "relationScheme",
          label: {
            en: "Scheme",
            nl: "Schema",
          },
          required: true,
          description: {
            en: "Scheme of the related work identifier",
            nl: "Schema van de identificatie van het gerelateerde werk",
          },
          options: [
            {
              label: "ARK",
              value: "ark",
            },
            {
              label: "arXiv",
              value: "arxiv",
            },
            {
              label: "Bibcode",
              value: "ads",
            },
            {
              label: "Crossref Funder ID",
              value: "crossreffunderid",
            },
            {
              label: "DOI",
              value: "doi",
            },
            {
              label: "EAN13",
              value: "ean13",
            },
            {
              label: "EISSN",
              value: "eissn",
            },
            {
              label: "GRID",
              value: "grid",
            },
            {
              label: "Handle",
              value: "handle",
            },
            {
              label: "IGSN",
              value: "igsn",
            },
            {
              label: "ISBN",
              value: "isbn",
            },
            {
              label: "ISNI",
              value: "isni",
            },
            {
              label: "ISSN",
              value: "issn",
            },
            {
              label: "ISTC",
              value: "istc",
            },
            {
              label: "LISSN",
              value: "lissn",
            },
            {
              label: "LSID",
              value: "lsid",
            },
            {
              label: "PMID",
              value: "pmid",
            },
            {
              label: "PURL",
              value: "purl",
            },
            {
              label: "UPC",
              value: "upc",
            },
            {
              label: "URL",
              value: "url",
            },
            {
              label: "URN",
              value: "urn",
            },
            {
              label: "W3ID",
              value: "w3id",
            },
            {
              label: "Other",
              value: "other",
            },
          ],
        },
        {
          type: "autocomplete",
          name: "relationResourceType",
          label: {
            en: "Resource Type",
            nl: "Resource Type",
          },
          required: true,
          description: {
            en: "Type of the related work resource",
            nl: "Type van de gerelateerde werk resource",
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
        },
      ],
    },
  ],
};

export default section;
