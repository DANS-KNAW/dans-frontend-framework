import { createApi } from "@reduxjs/toolkit/dist/query/react";
import type { RdaPathwaysResponse } from "../../../types/Api";

const rdaPathways = [
  {
    id: "2C0DA42E",
    title: "Data Infrastructures & Environments - Institutional",
    description:
      "Workflows and methods to implement the FAIR, CARE and TRUST Principles at the institutional data infrastructure level.",
  },
  {
    id: "03A30CFB",
    title: "Data Infrastructures & Environments - International",
    description:
      "Topics related to implementing principles that are common to all data infrastructures and community practices.",
  },
  {
    id: "521FDF0F",
    title: "Data Infrastructures & Environments - Regional and Disciplinary",
    description:
      "Standards and practices specific to a region and disciplinary community.",
  },
  {
    id: "7F11013B",
    title: "Data Lifecycles - Versioning, Provenance, Citation, and Reward",
    description:
      "Data management topics within the data lifecycle, including description, versioning, provenance, granularity, publishing, citation and reward.",
  },
  {
    id: "0DAC3574",
    title: "Discipline Focused Data Issues",
    description:
      "Implementation of principles and common data management practices from a disciplinary community.",
  },
  {
    id: "789662AC",
    title: "FAIR, CARE, TRUST - Adoption, Implementation & Deployment",
    description:
      "Practices and methods for the adoption, implementation and deployment of the FAIR, CARE and TRUST Principles.",
  },
  {
    id: "025CBB68",
    title: "FAIR, CARE, TRUST - Principles",
    description:
      "The FAIR, CARE and TRUST principles and their applicability to various research objects, including data, software, metadata and hardware.",
  },
  { id: "4E73F09C", title: "Other", description: "" },
  {
    id: "85B30A1B",
    title: "Research Software",
    description: "Practices and policies to make software open and FAIR.",
  },
  {
    id: "0178DD3E",
    title: "Semantics, Ontology, Standardisation",
    description:
      "Standardisation of metadata profiles, semantics and ontologies for maximising interoperability.",
  },
  {
    id: "DA7893AD",
    title: "Training, Stewardship & Data Management Planning",
    description:
      "Training modules, schools, workshops and library support for stewardship and data management.",
  },
];

export const rdaPathwaysApi = createApi({
  reducerPath: "pathways",
  baseQuery: (args) => {
    const { content } = args;

    const filteredItems = rdaPathways.filter((item) =>
      item.title.toLowerCase().startsWith(content.toLowerCase())
    );

    return {
      data: {
        number_of_results: filteredItems.length,
        items: filteredItems,
      },
    };
  },
  endpoints: (build) => ({
    fetchRdaPathway: build.query({
      query: (content) => ({ content }),
      transformResponse: (response: RdaPathwaysResponse, meta, arg) => {
        return response.number_of_results > 0
          ? {
              arg: arg,
              response: response.items.map((item) => ({
                label: item.title,
                value: item.title,
                idLabel: "RDA PATHWAYS ID",
                id: item.id,
                extraLabel: "description",
                extraContent: item.description,
              })),
            }
          : [];
      },
    }),
  }),
});

export const { useFetchRdaPathwayQuery } = rdaPathwaysApi;
