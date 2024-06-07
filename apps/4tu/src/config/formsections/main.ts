import type { InitialSectionType } from "@dans-framework/deposit";
import LZString from 'lz-string';

const fakeData = LZString.compressToEncodedURIComponent(JSON.stringify({
  "title": "This is a title",
  "affiliation": {
    "label": "Deepam Educational Society for Health",
    "value": "https://ror.org/00nyy7p10"
  },
  "research_domain": {
    "id": "D12700",
    "label": "Gases, fluid dynamics, plasma physics",
    "value": "https://www.narcis.nl/classification/D12700"
  },
  "datastation": "ssh",
  "etc": "etc"
}));

console.log(fakeData)

const uri = new URL(document.location.toString());
const searchParams = uri.searchParams.get("data");
const json = 
  searchParams ?
  JSON.parse(LZString.decompressFromEncodedURIComponent(searchParams as string)) :
  null;

console.log(json)

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
