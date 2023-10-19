import { createApi } from "@reduxjs/toolkit/dist/query/react";
import type { RdaInterestGroupsResponse } from "../../../types/Api";

const rdaInterestGroups = [
  {
    id: "05194014",
    title: "Active Data Management Plans IG",
    url: "https://www.rd-alliance.org/groups/active-data-management-plans.html",
  },
  {
    id: "7067AD0A",
    title: "Archives and Records Professionals for Research Data IG",
    url: "https://www.rd-alliance.org/groups/archives-records-professionals-for-research-data.html",
  },
  {
    id: "8DD824FE",
    title: "Biodiversity Data Integration IG",
    url: "https://www.rd-alliance.org/groups/biodiversity-data-integration-ig.html",
  },
  {
    id: "FD55B887",
    title: "Chemistry Research Data IG",
    url: "https://www.rd-alliance.org/groups/chemistry-research-data-interest-group.html",
  },
  {
    id: "08E1330F",
    title:
      "CODATA/RDA Research Data Science Schools for Low and Middle Income Countries",
    url: "https://www.rd-alliance.org/groups/codatarda-research-data-science-schools-low-and-middle-income-countries",
  },
  {
    id: "2B8FD012",
    title: "Data Conservation IG",
    url: "https://www.rd-alliance.org/groups/data-conservation-ig",
  },
  {
    id: "79D05DA0",
    title: "Data Discovery Paradigms IG",
    url: "https://www.rd-alliance.org/groups/data-discovery-paradigms-ig",
  },
  {
    id: "FE41DEB1",
    title: "Data Economics IG",
    url: "https://www.rd-alliance.org/groups/data-economics-ig",
  },
  {
    id: "8DBADBB4",
    title: "Data for Development IG",
    url: "https://www.rd-alliance.org/groups/data-development.html",
  },
  {
    id: "84676B0F",
    title: "Data policy standardisation and implementation IG",
    url: "https://www.rd-alliance.org/groups/data-policy-standardisation-and-implementation-ig",
  },
  {
    id: "9ECD4A8E",
    title: "Data Versioning IG",
    url: "https://www.rd-alliance.org/groups/data-versioning-ig",
  },
  {
    id: "F63026AC",
    title: "Digital Practices in History and Ethnography IG",
    url: "https://www.rd-alliance.org/groups/digital-practices-history-and-ethnography-ig.html",
  },
  {
    id: "6599FE37",
    title: "InterestGroup Repositories IG",
    url: "https://www.rd-alliance.org/groups/domain-repositories-ig.html",
  },
  {
    id: "EEB47DBA",
    title: "Early Career and Engagement IG",
    url: "https://www.rd-alliance.org/groups/early-career-and-engagement-ig",
  },
  {
    id: "3F4EBAF3",
    title: "Education and Training on Handling of Research Data IG",
    url: "https://www.rd-alliance.org/groups/education-and-training-handling-research-data.html",
  },
  {
    id: "5AD00EAC",
    title: "Engaging Researchers with Data IG",
    url: "https://www.rd-alliance.org/groups/engaging-researchers-data-ig",
  },
  {
    id: "93746145",
    title: "ESIP/RDA Earth, Space, and Environmental Sciences IG",
    url: "https://www.rd-alliance.org/groups/esiprda-earth-space-and-environmental-sciences-ig",
  },
  {
    id: "D2F22AEF",
    title: "Ethics and Social Aspects of Data IG",
    url: "https://www.rd-alliance.org/groups/ethics-and-social-aspects-data.html",
  },
  {
    id: "8CFF4EE3",
    title: "Evaluation of Research IG",
    url: "https://www.rd-alliance.org/groups/evaluation-research-ig",
  },
  {
    id: "E012C69C",
    title: "FAIR Digital Object Fabric IG",
    url: "https://www.rd-alliance.org/group/FAIR-digital-object-fabric-ig.html",
  },
  {
    id: "099F7550",
    title: "FAIR for Machine Learning (FAIR4ML) IG",
    url: "https://www.rd-alliance.org/groups/fair-machine-learning-fair4ml-ig",
  },
  {
    id: "15FC7951",
    title: "FAIR Instrument Data IG",
    url: "https://www.rd-alliance.org/groups/fair-instrument-data-ig",
  },
  {
    id: "33AB6E78",
    title: "FAIR Principles for Research Hardware",
    url: "https://www.rd-alliance.org/groups/fair-principles-research-hardware",
  },
  {
    id: "CD0277AB",
    title: "Federated Identity Management IG",
    url: "https://www.rd-alliance.org/groups/federated-identity-management-ig",
  },
  {
    id: "0EF21156",
    title: "Geospatial IG",
    url: "https://www.rd-alliance.org/groups/geospatial-ig.html",
  },
  {
    id: "9543A3D2",
    title: "Global Open Research Commons IG",
    url: "https://www.rd-alliance.org/groups/global-open-research-commons-ig",
  },
  {
    id: "7B724AC1",
    title: "Global Water Information IG",
    url: "https://www.rd-alliance.org/groups/global-water-information-interest-group.html-0",
  },
  {
    id: "9C0A1E71",
    title: "GO FAIR Liaison IG",
    url: "https://www.rd-alliance.org/groups/go-fair-liaison-ig",
  },
  {
    id: "FAB13F38",
    title: "Health Data Interest Group",
    url: "https://www.rd-alliance.org/groups/health-data.html",
  },
  {
    id: "2AE8F962",
    title: "IG for Surveying Open Data Practices",
    url: "https://www.rd-alliance.org/groups/ig-surveying-open-data-practices",
  },
  {
    id: "4962F5D5",
    title: "International Indigenous Data Sovereignty IG",
    url: "https://www.rd-alliance.org/groups/international-indigenous-data-sovereignty-ig",
  },
  {
    id: "0E2FF122",
    title: "Libraries for Research Data IG",
    url: "https://www.rd-alliance.org/groups/libraries-research-data.html",
  },
  {
    id: "8F9A18AE",
    title: "Life Science Data Infrastructures IG",
    url: "https://www.rd-alliance.org/groups/life-science-data-infrastructures-ig",
  },
  {
    id: "17674EED",
    title: "Linguistics Data IG",
    url: "https://www.rd-alliance.org/groups/linguistics-data-ig",
  },
  {
    id: "39F78479",
    title: "Metadata IG",
    url: "https://www.rd-alliance.org/groups/metadata-ig.html",
  },
  {
    id: "87045A54",
    title: "Open Science Graphs for FAIR Data IG",
    url: "https://www.rd-alliance.org/groups/open-science-graphs-fair-data-ig",
  },
  {
    id: "369AB356",
    title: "Physical Samples and Collections in the Research Data Ecosystem IG",
    url: "https://www.rd-alliance.org/groups/physical-samples-and-collections-research-data-ecosystem-ig",
  },
  {
    id: "00A8FE13",
    title: "PID IG",
    url: "https://www.rd-alliance.org/groups/pid-interest-group.html",
  },
  {
    id: "4D204348",
    title: "Preservation Tools, Techniques, and Policies",
    url: "https://www.rd-alliance.org/groups/preservation-tools-techniques-and-policies",
  },
  {
    id: "BD47802B",
    title: "Professionalising Data Stewardship IG",
    url: "https://www.rd-alliance.org/groups/professionalising-data-stewardship-ig",
  },
  {
    id: "1A0C1D0E",
    title: "Psychological Data IG",
    url: "https://www.rd-alliance.org/groups/psychological-data-ig",
  },
  {
    id: "B2BE284C",
    title: "Quality of Urban Life IG",
    url: "https://www.rd-alliance.org/groups/urban-quality-life-indicators.html",
  },
  {
    id: "10AD77A9",
    title: "RDA for the Sustainable Development Goals IG",
    url: "https://www.rd-alliance.org/groups/rda-sustainable-development-goals-ig",
  },
  {
    id: "1FD0FD1D",
    title: "RDA Privacy Implications of Research Data Sets IG",
    url: "https://www.rd-alliance.org/groups/rdaniso-privacy-implications-research-data-sets-wg.html",
  },
  {
    id: "8A875D1B",
    title: "RDA/CODATA Legal Interoperability IG",
    url: "https://www.rd-alliance.org/groups/rdacodata-legal-interoperability-ig.html",
  },
  {
    id: "AA7F68CA",
    title: "RDA/CODATA Materials Data, Infrastructure & Interoperability IG",
    url: "https://www.rd-alliance.org/groups/rdacodata-materials-data-infrastructure-interoperability-ig.html",
  },
  {
    id: "2020622F",
    title: "RDA/WDS Certification of Digital Repositories IG",
    url: "https://www.rd-alliance.org/groups/rdawds-certification-digital-repositories-ig.html",
  },
  {
    id: "7B424CF8",
    title: "Repository Platforms for Research Data IG",
    url: "https://www.rd-alliance.org/groups/repository-platforms-research-data.html",
  },
  {
    id: "EA3868F1",
    title: "Research Data Architectures in Research Institutions IG",
    url: "https://www.rd-alliance.org/groups/research-data-architectures-research-institutions-ig",
  },
  {
    id: "666FCBA7",
    title: "Research Data Management in Engineering IG",
    url: "https://www.rd-alliance.org/groups/research-data-management-engineering-ig",
  },
  {
    id: "43844B9C",
    title: "Research data needs of the Photon and Neutron Science community IG",
    url: "https://www.rd-alliance.org/groups/research-data-needs-photon-and-neutron-science-community.html",
  },
  {
    id: "16590374",
    title:
      "Research Funders and Stakeholders on Open Research and Data Management Policies and Practices IG",
    url: "https://www.rd-alliance.org/groups/research-funders-and-stakeholders-open-research-and-data-management-policies-and-practices-ig",
  },
  {
    id: "070ACFE3",
    title: "Science communication for research data",
    url: "https://www.rd-alliance.org/groups/science-communication-research-data",
  },
  {
    id: "D66BC7C2",
    title: "Sensitive Data Interest Group",
    url: "https://www.rd-alliance.org/groups/sensitive-data-interest-group",
  },
  {
    id: "83D2EA20",
    title: "Sharing Rewards and Credit (SHARC) IG",
    url: "https://www.rd-alliance.org/groups/sharing-rewards-and-credit-sharc-ig",
  },
  {
    id: "C1E59C5A",
    title:
      "Skills and training curriculums to support FAIR research software IG",
    url: "https://www.rd-alliance.org/groups/skills-and-training-curriculums-support-fair-research-software-ig",
  },
  {
    id: "8B7E3CD2",
    title: "Small Unmanned Aircraft Systems’ Data IG",
    url: "https://www.rd-alliance.org/groups/small-unmanned-aircraft-systems%E2%80%99-data-ig",
  },
  {
    id: "8F876A99",
    title: "Social Dynamics of Data Interoperability IG",
    url: "https://www.rd-alliance.org/groups/social-dynamics-data-interoperability-ig",
  },
  {
    id: "05B4EB6B",
    title: "Social Science Research Data IG",
    url: "https://www.rd-alliance.org/groups/social-science-research-data-ig",
  },
  {
    id: "DCADC1A5",
    title: "Software Source Code IG",
    url: "https://www.rd-alliance.org/groups/software-source-code-ig",
  },
  {
    id: "48F630C4",
    title: "Structure of Information",
    url: "https://www.rd-alliance.org/groups/structure-information",
  },
  {
    id: "B6299830",
    title: "Virtual Research Environment IG (VRE-IG)",
    url: "https://www.rd-alliance.org/groups/vre-ig.html",
  },
  {
    id: "64B355B1",
    title: "Vocabulary Services IG",
    url: "https://www.rd-alliance.org/groups/vocabulary-services-interest-group.html",
  },
  {
    id: "D871E0AA",
    title: "Working with PIDs in Tools IG",
    url: "https://www.rd-alliance.org/groups/working-pids-tools-ig",
  },
  {
    id: "0A9443BC",
    title: "Long tail of research data IG",
    url: "https://www.rd-alliance.org/groups/long-tail-research-data-ig.html",
  },
  {
    id: "C05EA6FC",
    title: "RDA COVID-19 Epidemiology",
    url: "https://www.rd-alliance.org/groups/rda-covid-19-epidemiology",
  },
  {
    id: "07188498",
    title: "RDA COVID-19",
    url: "https://www.rd-alliance.org/groups/rda-covid-19",
  },
  {
    id: "F329B668",
    title: "RDA-COVID19-Omics",
    url: "https://www.rd-alliance.org/groups/rda-covid19-omics",
  },
  {
    id: "9566F94C",
    title: "RDA-COVID19-Clinical",
    url: "https://www.rd-alliance.org/groups/rda-covid19-clinical",
  },
  {
    id: "97920CD9",
    title:
      "RDA / TDWG Metadata Standards for attribution of physical and digital collections stewardship",
    url: "https://www.rd-alliance.org/groups/metadata-standards-attribution-physical-and-digital-collections-stewardship.html",
  },
];

export const rdaInterestGroupsApi = createApi({
  reducerPath: "interest groups",
  baseQuery: (args) => {
    const { content } = args;

    const filteredItems = rdaInterestGroups.filter((item) =>
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
    fetchRdaInterestGroup: build.query({
      query: (content) => ({ content }),
      transformResponse: (response: RdaInterestGroupsResponse, meta, arg) => {
        return response.number_of_results > 0
          ? {
              arg: arg,
              response: response.items.map((item) => ({
                label: item.title,
                value: item.url,
                idLabel: "RDA INTEREST GROUPS ID",
                id: item.id,
                extraLabel: "url",
                extraContent: item.url,
              })),
            }
          : [];
      },
    }),
  }),
});

export const { useFetchRdaInterestGroupQuery } = rdaInterestGroupsApi;
