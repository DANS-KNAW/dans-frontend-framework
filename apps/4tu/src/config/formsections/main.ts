import type { InitialSectionType } from "@dans-framework/deposit";

const section: InitialSectionType = {
  id: "data",
  title: "Enter additional data",
  fields: [
    {
      type: "text",
      label: "Title",
      name: "title",
      required: true,
      description: "Enter a title for your deposit",
    },
    {
      type: "autocomplete",
      label: "Affiliation",
      name: "affiliation",
      required: true,
      description: "Provide your affiliated institution",
      options: "ror",
    },
    {
      type: "autocomplete",
      label: "Research domain",
      name: "research_domain",
      required: true,
      description: "Select the research domain your data belongs to",
      options: "narcis",
    },
  ],
};

export default section;
