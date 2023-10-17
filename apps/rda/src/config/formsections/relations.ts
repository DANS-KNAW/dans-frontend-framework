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
      name: 'relatedto',
      label: {
        en: 'Related to',
        nl: 'Gerelateerd aan',
      },
      required: true,
      multiselect: true,
      description: {
        en: 'Other PID\'s, publications, projects',
        nl: 'Andere PID\'s, publicaties, projecten',
      },
      options: [
        {
          label: {
            en: 'Is Cited By',
            nl: 'Wordt Geciteerd Door',
          },
          value: 'isCitedBy',
        },
        {
          label: {
            en: 'Cites',
            nl: 'Citeert',
          },
          value: 'cites',
        },
        {
          label: {
            en: 'Is Supplement To',
            nl: 'Is Een Supplement Op',
          },
          value: 'isSupplementTo',
        },
        {
          label: {
            en: 'Is Supplemented By',
            nl: 'Wordt Aangevuld Door',
          },
          value: 'isSupplementedBy',
        },
        {
          label: {
            en: 'Is Continued By',
            nl: 'Wordt Voortgezet Door',
          },
          value: 'isContinuedBy',
        },
        {
          label: {
            en: 'Continues',
            nl: 'Gaat Verder',
          },
          value: 'continues',
        },
        {
          label: {
            en: 'Is Described By',
            nl: 'Wordt Beschreven Door',
          },
          value: 'isDescribedBy',
        },
        {
          label: {
            en: 'Describes',
            nl: 'Beschrijft',
          },
          value: 'describes',
        },
        {
          label: {
            en: 'Has Metadata',
            nl: 'Heeft Metadata',
          },
          value: 'hasMetadata',
        },
        {
          label: {
            en: 'Is Metadata For',
            nl: 'Is Metadata Voor',
          },
          value: 'isMetadataFor',
        },
        {
          label: {
            en: 'Is New Version Of',
            nl: 'Is Nieuwe Versie Van',
          },
          value: 'isNewVersionOf',
        },
        {
          label: {
            en: 'Is Previous Version Of',
            nl: 'Is Vorige Versie Van',
          },
          value: 'isPreviousVersionOf',
        },
        {
          label: {
            en: 'Is Part Of',
            nl: 'Is Onderdeel Van',
          },
          value: 'isPartOf',
        },
        {
          label: {
            en: 'Has Part',
            nl: 'Heeft Deel',
          },
          value: 'hasPart',
        },
        {
          label: {
            en: 'Is Referenced By',
            nl: 'Wordt Verwezen Door',
          },
          value: 'isReferencedBy',
        },
        {
          label: {
            en: 'References',
            nl: 'Verwijst',
          },
          value: 'references',
        },
        {
          label: {
            en: 'Is Documented By',
            nl: 'Wordt Gedocumenteerd Door',
          },
          value: 'isDocumentedBy',
        },
        {
          label: {
            en: 'Documents',
            nl: 'Documenteert',
          },
          value: 'documents',
        },
        {
          label: {
            en: 'Is Compiled By',
            nl: 'Wordt Samengesteld Door',
          },
          value: 'isCompiledBy',
        },
        {
          label: {
            en: 'Compiles',
            nl: 'Stelt Samen',
          },
          value: 'compiles',
        },
        {
          label: {
            en: 'Is Variant Form Of',
            nl: 'Is Variant Vorm Van',
          },
          value: 'isVariantFormOf',
        },
        {
          label: {
            en: 'Is Original Form Of',
            nl: 'Is Originele Vorm Van',
          },
          value: 'isOrignialFormOf',
        },
        {
          label: {
            en: 'Is Identical To',
            nl: 'Is Identiek Aan',
          },
          value: 'isIdenticalTo',
        },
        {
          label: {
            en: 'Is Reviewed By',
            nl: 'Wordt Beoordeeld Door',
          },
          value: 'isReviewedBy',
        },
        {
          label: {
            en: 'Reviews',
            nl: 'Beoordeelt',
          },
          value: 'reviews',
        },
        {
          label: {
            en: 'Is Derived From',
            nl: 'Is Afgeleid Van',
          },
          value: 'isDerivedFrom',
        },
        {
          label: {
            en: 'Is Source Of',
            nl: 'Is Bron Van',
          },
          value: 'isSourceOf',
        },
        {
          label: {
            en: 'Requires',
            nl: 'Vereist',
          },
          value: 'requires',
        },
        {
          label: {
            en: 'Is Required By',
            nl: 'Is Vereist Door',
          },
          value: 'isRequiredBy',
        },
        {
          label: {
            en: 'Is Obsoleted By',
            nl: 'Wordt Verouderd Door',
          },
          value: 'isObsoletedBy',
        },
        {
          label: {
            en: 'Obsoletes',
            nl: 'Maakt Verouderd',
          },
          value: 'obsoletes',
        },
        {
          label: {
            en: 'Is Published In',
            nl: 'Wordt Gepubliceerd In',
          },
          value: 'isPublishedIn',
        },
      ],
    },
  ],
};

export default section;