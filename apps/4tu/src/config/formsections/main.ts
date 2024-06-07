import type { InitialSectionType } from "@dans-framework/deposit";

const uri = new URL(document.location.toString());
const searchParams = uri.searchParams.get("data");
const json = 
  searchParams ?
  JSON.parse(atob(searchParams as string)) :
  null;

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
      value: json?.title,
    },
    {
      type: "autocomplete",
      label: "Affiliation",
      name: "affiliation",
      required: true,
      description: "Provide your affiliated institution",
      options: "ror",
      value: json?.affiliation,
    },
    {
      type: "autocomplete",
      label: "Research domain",
      name: "research_domain",
      required: true,
      description: "Select the research domain your data belongs to",
      options: "narcis",
      value: json?.research_domain,
    },
  ],
};

export default section;
