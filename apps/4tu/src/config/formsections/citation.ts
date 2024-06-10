import type { InitialSectionType } from "@dans-framework/deposit";
import json from '@dans-framework/utils/preloader';

const section: InitialSectionType = {
  id: "citation",
  title: "Citation",
  fields: [
    {
      type: "text",
      label: "Title",
      name: "title",
      required: true,
      description: "A descriptive title for the work, to be used in citations",
      value: json?.title,
    },
    {
      type: "text",
      label: "Subtitle",
      name: "subtitle",
      noIndicator: true,
      description: "You can provide a subtitle if you wish",
    },
    {
      type: "text",
      label: "Description",
      name: "description",
      multiline: true,
      required: true,
      description: "Some context on the interview. What is the role and relevance of the interviewee in the project? What led to the interview being conducted? Summary of what was discussed in the interview, with time breakdown, and describe important events in the interview. Improves discoverability and reusability of the interview data. Briefly describe the setting and atmosphere of the interview to indicate what does not emerge when only the text is read. Basic HTML tags are allowed.",
    },
    {
      type: "autocomplete",
      label: "Publisher",
      name: "publisher",
      required: true,
      description: "Institution - often the rights holder",
      options: "ror",
      value: json?.affiliation,
    },
    {
      type: "group",
      label: "Author",
      name: "author",
      repeatable: true,
      description: "Add one or more authors.",
      fields: [
        {
          type: "autocomplete",
          label: "Name",
          name: "name",
          required: true,
          description: "First and last name",
          options: "orcid",
          allowFreeText: true,
        },
        {
          type: "text",
          label: "Affiliation",
          name: "affiliation",
          required: true,
        },
      ],
    },
  ],
};

export default section;
