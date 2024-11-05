import type { InitialSectionType } from "@dans-framework/deposit";

const section: InitialSectionType = {
  id: "coverage",
  title: {
    en: "Coverage",
    nl: "Dekking",
  },
  fields: [
    {
      type: "drawmap",
      label: {
        en: "Indicate location",
        nl: "Map",
      },
      name: "map",
      required: true,
      description: {
        en: "Search and select to open and focus a map on this location. Then select a shape type and start drawing.",
        nl: "Iets van beschrijving",
      },
      fullWidth: true,
      wmsLayers: [
        {
          name: "natura2000",
          source: 'https://service.pdok.nl/rvo/natura2000/wms/v1_0?service=WMS&version=1.3.0&layers=natura2000',
        },
        {
          name: "nationaleparken",
          source: "https://service.pdok.nl/rvo/nationaleparken/wms/v2_0?service=WMS&version=1.3.0&layers=nationaleparken",
        }
      ],
    },
    {
      type: "autocomplete",
      label: {
        en: "Species",
        nl: "Soorten",
      },
      name: "species",
      multiselect: true,
      required: true,
      description: {
        en: "Something here",
        nl: "Iets hier",
      },
      options: "biodiversity",
    },
    {
      type: "group",
      label: {
        en: "Period covered",
        nl: "Periode besproken",
      },
      name: "subject_date_time",
      repeatable: true,
      description: {
        en: "",
        nl: "",
      },
      fields: [
        {
          type: "daterange",
          format: "YYYY",
          formatOptions: ["YYYY", "MM-YYYY", "DD-MM-YYYY", "DD-MM-YYYY HH:mm"],
          label: {
            en: "Interview period",
            nl: "Interviewperiode",
          },
          name: "subject_date_time_range",
          description: {
            en: "Start and end of a period the interview covers",
            nl: "Begin en eind van een periode waar het interview over gaat",
          },
          required: true,
          optionalEndDate: true, // needed if we only require a start date
          fullWidth: true,
        },
      ],
    },
  ],
};

export default section;
