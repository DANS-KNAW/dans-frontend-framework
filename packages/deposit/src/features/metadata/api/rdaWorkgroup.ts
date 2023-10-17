import { createApi } from "@reduxjs/toolkit/dist/query/react";
import type { GorcResponse, RdaWorkGroupResponse } from "../../../types/Api";

const rdaWorkingGroups = [
  {
    id: "51487",
    parent_id: "rda_graph:9B4102E4",
    title: "Agrisemantics WG",
  },
  {
    id: "50325",
    parent_id: "rda_graph:00050325",
    title: "Array Database Assessment WG",
  },
  {
    id: "75961",
    parent_id: "rda_graph:DC13BC0D",
    title: "Artificial Intelligence and Data Visitation (AIDV) WG",
  },
  {
    id: "61462",
    parent_id: "rda_graph:00061462",
    title: "Big Data Modelling of UN SDGs",
  },
  {
    id: "58743",
    parent_id: "rda_graph:F8C3E8EE",
    title: "Blockchain Applications in Health WG",
  },
  {
    id: "47138",
    parent_id: "rda_graph:00047138",
    title: "BoF Deconstructing the Data Life Cycle--Agile Curation",
  },
  {
    id: "51178",
    parent_id: "rda_graph:D853DFBD",
    title: "Brokering Framework Working Group",
  },
  {
    id: "58440",
    parent_id: "rda_graph:CF1D4EFF",
    title: "Capacity Development for Agriculture Data WG",
  },
  {
    id: "54366",
    parent_id: "rda_graph:00054366",
    title:
      "Certification and Accreditation for Data Science Training and Education WG",
  },
  {
    id: "74222",
    parent_id: "rda_graph:230464B5",
    title: "Complex Citations Working Group",
  },
  {
    id: "74655",
    parent_id: "rda_graph:76F4505B",
    title:
      "Coordinating Earth, Space, and Environmental Science Data Preservation and Scholarly Publication Processes",
  },
  {
    id: "15839",
    parent_id: "rda_graph:DA83B086",
    title: "CoreTrustSeal Maintenance WG",
  },
  {
    id: "66744",
    parent_id: "rda_graph:8634FB10",
    title: "CURE-FAIR WG",
  },
  {
    id: "141",
    parent_id: "rda_graph:46CBC376",
    title: "Data Citation WG",
  },
  {
    id: "1083",
    parent_id: "rda_graph:00001083",
    title: "Data Description Registry Interoperability (DDRI) WG",
  },
  {
    id: "147",
    parent_id: "rda_graph:00000147",
    title: "Data Foundation and Terminology WG",
  },
  {
    id: "71683",
    parent_id: "rda_graph:3BF26F71",
    title: "Data Granularity WG",
  },
  {
    id: "74840",
    parent_id: "rda_graph:179A055B",
    title: "Data Repository Attributes WG",
  },
  {
    id: "50276",
    parent_id: "rda_graph:00050276",
    title: "Data Security and Trust WG",
  },
  {
    id: "145",
    parent_id: "rda_graph:00000145",
    title: "Data Type Registries WG & #2",
  },
  {
    id: "58081",
    parent_id: "rda_graph:810DBC31",
    title: "Data Usage Metrics WG",
  },
  {
    id: "71672",
    parent_id: "rda_graph:901DE404",
    title: "Discipline-specific Guidance for Data Management Plans WG",
  },
  {
    id: "56938",
    parent_id: "rda_graph:E440A7DC",
    title: "DMP Common Standards WG",
  },
  {
    id: "51265",
    parent_id: "rda_graph:00051265",
    title: "Empirical Humanities Metadata Working Group",
  },
  {
    id: "70626",
    parent_id: "rda_graph:00070626",
    title: "Epidemiology common standard for surveillance data reporting WG",
  },
  {
    id: "57149",
    parent_id: "rda_graph:5000B80F",
    title: "Exposing Data Management Plans WG",
  },
  {
    id: "60731",
    parent_id: "rda_graph:3854E5F3",
    title: "FAIR Data Maturity Model WG",
  },
  {
    id: "69317",
    parent_id: "rda_graph:9246BCBC",
    title: "FAIR for Research Software (FAIR4RS) WG",
  },
  {
    id: "73928",
    parent_id: "rda_graph:594BB0DB",
    title: "FAIR for Virtual Research Environments WG",
  },
  {
    id: "44787",
    parent_id: "rda_graph:F037D072",
    title:
      "FAIRsharing Registry: Connecting data policies, standards and databases RDA WG",
  },
  {
    id: "54174",
    parent_id: "rda_graph:00054174",
    title: "Fisheries Data Interoperability WG",
  },
  {
    id: "72356",
    parent_id: "rda_graph:8A27AB95",
    title: "GORC International Model WG",
  },
  {
    id: "51350",
    parent_id: "rda_graph:6E0807DC",
    title: "International Materials Resource Registries WG",
  },
  {
    id: "61856",
    parent_id: "rda_graph:32733AF7",
    title:
      "InteroperAble Descriptions of Observable Property Terminology WG (I-ADOPT WG)",
  },
  {
    id: "48109",
    parent_id: "rda_graph:00048109",
    title: "Metadata Standards Catalog WG",
  },
  {
    id: "153",
    parent_id: "rda_graph:00000153",
    title: "Metadata Standards Directory WG",
  },
  {
    id: "73962",
    parent_id: "rda_graph:0E1A1722",
    title: "National PID Strategies WG",
  },
  {
    id: "75913",
    parent_id: "rda_graph:2203AE3A",
    title: "Neuroimaging Data WG",
  },
  {
    id: "54129",
    parent_id: "rda_graph:00054129",
    title: "On-Farm Data Sharing (OFDS) WG",
  },
  {
    id: "57186",
    parent_id: "rda_graph:0FCED49F",
    title: "Persistent Identification of Instruments WG",
  },
  {
    id: "151",
    parent_id: "rda_graph:00000151",
    title: "PID Information Types WG",
  },
  {
    id: "54841",
    parent_id: "rda_graph:00054841",
    title: "PID Kernel Information Profile Management WG",
  },
  {
    id: "149",
    parent_id: "rda_graph:00000149",
    title: "Practical Policy WG",
  },
  {
    id: "62879",
    parent_id: "rda_graph:9FA16609",
    title: "Preserving Scientific Annotation WG",
  },
  {
    id: "55467",
    parent_id: "rda_graph:00055467",
    title: "Provenance Patterns WG",
  },
  {
    id: "60202",
    parent_id: "rda_graph:00060202",
    title: "Public Health Graph WG",
  },
  {
    id: "69831",
    parent_id: "rda_graph:27FFA55D",
    title:
      "Raising FAIRness in health data and health research performing organisations (HRPOs) WG",
  },
  {
    id: "77381",
    parent_id: "rda_graph:EFB310A9",
    title:
      "RDA / CODATA Data Systems, Tools, and Services for Crisis Situations WG",
  },
  {
    id: "51194",
    parent_id: "rda_graph:FFF89ECB",
    title:
      "RDA / TDWG Metadata Standards for attribution of physical and digital collections stewardship",
  },
  {
    id: "77991",
    parent_id: "rda_graph:19097139",
    title:
      "RDA & ReSA: Policies in Research Organisations for Research Software (PRO4RS)",
  },
  {
    id: "68704",
    parent_id: "rda_graph:F68CA949",
    title: "RDA COVID-19",
  },
  {
    id: "68844",
    parent_id: "rda_graph:22E290BB",
    title: "RDA COVID-19 Epidemiology",
  },
  {
    id: "69096",
    parent_id: "rda_graph:00069096",
    title: "RDA COVID19 Coordination",
  },
  {
    id: "69849",
    parent_id: "rda_graph:00069849",
    title: "RDA COVID19 Visualisation Team",
  },
  {
    id: "69319",
    parent_id: "rda_graph:EDC35E4B",
    title: "RDA COVID19-Legal-Ethical",
  },
  {
    id: "68845",
    parent_id: "rda_graph:00068845",
    title: "RDA-COVID19-Clinical",
  },
  {
    id: "68847",
    parent_id: "rda_graph:00068847",
    title: "RDA-COVID19-Community-participation",
  },
  {
    id: "68843",
    parent_id: "rda_graph:00068843",
    title: "RDA-COVID19-Omics",
  },
  {
    id: "68846",
    parent_id: "rda_graph:00068846",
    title: "RDA-COVID19-Social-Sciences",
  },
  {
    id: "69318",
    parent_id: "rda_graph:00069318",
    title: "RDA-COVID19-Software",
  },
  {
    id: "77504",
    parent_id: "rda_graph:EF42AB1B",
    title: "RDA-OfR Mapping the landscape of digital research tools WG",
  },
  {
    id: "42724",
    parent_id: "rda_graph:9215FA30",
    title:
      "RDA/CODATA Summer Schools in Data Science and Cloud Computing in the Developing World WG",
  },
  {
    id: "59857",
    parent_id: "rda_graph:00059857",
    title: "RDA/FORCE11 Software Source Code Identification WG",
  },
  {
    id: "44532",
    parent_id: "rda_graph:00044532",
    title: "RDA/WDS Publishing Data Bibliometrics WG",
  },
  {
    id: "44534",
    parent_id: "rda_graph:00044534",
    title: "RDA/WDS Publishing Data Services WG",
  },
  {
    id: "44528",
    parent_id: "rda_graph:7736F1D1",
    title: "RDA/WDS Publishing Data Workflows WG",
  },
  {
    id: "54042",
    parent_id: "rda_graph:A4ABEB6D",
    title: "RDA/WDS Scholarly Link Exchange (Scholix) WG",
  },
  {
    id: "77243",
    parent_id: "rda_graph:97C10106",
    title: "RDA/WDS TRUST Principles Outreach and Adoption Working Group",
  },
  {
    id: "53176",
    parent_id: "rda_graph:00053176",
    title: "Repository Core Description WG",
  },
  {
    id: "61938",
    parent_id: "rda_graph:E2087F01",
    title: "Reproducible Health Data Services WG",
  },
  {
    id: "48839",
    parent_id: "rda_graph:00048839",
    title: "Research Data Collections WG",
  },
  {
    id: "50279",
    parent_id: "rda_graph:00050279",
    title: "Research Data Repository Interoperability WG",
  },
  {
    id: "62494",
    parent_id: "rda_graph:CA105667",
    title: "Research Metadata Schemas WG",
  },
  {
    id: "51514",
    parent_id: "rda_graph:00051514",
    title: "Rice Data Interoperability WG",
  },
  {
    id: "77139",
    parent_id: "rda_graph:F78A9F9F",
    title:
      "Scientific Knowledge Graphs - Interoperability Framework (SKG-IF) WG",
  },
  {
    id: "59960",
    parent_id: "rda_graph:00059960",
    title:
      "Smallholder Agriculture Data Collection and Curation Working Group",
  },
  {
    id: "291",
    parent_id: "rda_graph:00000291",
    title: "Standardisation of Data Categories and Codes WG",
  },
  {
    id: "50454",
    parent_id: "rda_graph:00050454",
    title: "Storage Service Definitions WG",
  },
  {
    id: "54046",
    parent_id: "rda_graph:00054046",
    title: "Teaching TDM on Education and Skill Development WG",
  },
  {
    id: "54458",
    parent_id: "rda_graph:00054458",
    title: "WDS/RDA Assessment of Data Fitness for Use WG",
  },
  {
    id: "752",
    parent_id: "rda_graph:4E8258F6",
    title: "Wheat Data Interoperability WG",
  },
  {
    id: "66886",
    parent_id: "rda_graph:36B6468E",
    title:
      "Working Group on Ethical and Legal best practices for Drone Data in a global research context (WELDD)",
  },
];

export const rdaWorkingGroupsApi = createApi({
  reducerPath: "rdaWorkingGroups",
  baseQuery: (args) => {
    const { content } = args;

    const filteredItems = rdaWorkingGroups.filter((item) =>
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
    fetchRdaWorkingGroup: build.query({
      query: (content) => ({ content }),
      transformResponse: (response: RdaWorkGroupResponse, meta, arg) => {
        return response.number_of_results > 0
          ? {
              arg: arg,
              response: response.items.map((item) => ({
                label: item.title,
                value: `{"node_id":"${item.id}","UUID_WorkingGroup":"${item.parent_id}"}`,
                idLabel: "RDA WG ID",
                id: item.id,
              })),
            }
          : [];
      },
    }),
  }),
});

export const { useFetchRdaWorkingGroupQuery } = rdaWorkingGroupsApi;
