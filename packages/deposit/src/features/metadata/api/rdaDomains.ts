import { createApi } from "@reduxjs/toolkit/dist/query/react";
import type { RdaDomainsResponse } from "../../../types/Api";

const rdaDomains = [
  {
    id: "3F71CF14",
    parent_id: "rda_graph:27BE021B",
    title: "Agricultural biotechnology",
    url: "https://en.wikipedia.org/wiki/Agricultural_biotechnology",
  },
  {
    id: "FA501DD3",
    parent_id: "rda_graph:27BE021B",
    title: "Agriculture, forestry, and fisheries",
    url: "https://en.wikipedia.org/wiki/Forestry",
  },
  {
    id: "885778DC",
    parent_id: "rda_graph:27BE021B",
    title: "Animal and dairy science",
    url: "https://en.wikipedia.org/wiki/Animal_science",
  },
  {
    id: "68CB6AD6",
    parent_id: "rda_graph:27BE021B",
    title: "Other agricultural sciences",
    url: "",
  },
  {
    id: "21E1DAAC",
    parent_id: "rda_graph:27BE021B",
    title: "Veterinary science",
    url: "https://en.wikipedia.org/wiki/Veterinary_science",
  },
  {
    id: "27BE021B",
    parent_id: "",
    title: "Agricultural sciences",
    url: "https://en.wikipedia.org/wiki/Agricultural_sciences",
  },
  {
    id: "317D163C",
    parent_id: "rda_graph:285F97D3",
    title: "Chemical engineering",
    url: "https://en.wikipedia.org/wiki/Chemical_engineering",
  },
  {
    id: "E6A05ECC",
    parent_id: "rda_graph:285F97D3",
    title: "Civil engineering",
    url: "https://en.wikipedia.org/wiki/Civil_engineering",
  },
  {
    id: "AD232C46",
    parent_id: "rda_graph:285F97D3",
    title:
      "Electrical engineering, electronic engineering, information engineering",
    url: "https://en.wikipedia.org/wiki/Electrical_engineering",
  },
  {
    id: "3EE05B5A",
    parent_id: "rda_graph:285F97D3",
    title: "Environmental biotechnology",
    url: "https://en.wikipedia.org/wiki/Environmental_biotechnology",
  },
  {
    id: "E381BBCB",
    parent_id: "rda_graph:285F97D3",
    title: "Environmental engineering",
    url: "https://en.wikipedia.org/wiki/Environmental_engineering",
  },
  {
    id: "C09C0909",
    parent_id: "rda_graph:285F97D3",
    title: "Industrial biotechnology",
    url: "https://en.wikipedia.org/wiki/Industrial_biotechnology",
  },
  {
    id: "BD52C16D",
    parent_id: "rda_graph:285F97D3",
    title: "Materials engineering",
    url: "https://en.wikipedia.org/wiki/Materials_engineering",
  },
  {
    id: "C1E73045",
    parent_id: "rda_graph:285F97D3",
    title: "Mechanical engineering",
    url: "https://en.wikipedia.org/wiki/Mechanical_engineering",
  },
  {
    id: "5BEE3E69",
    parent_id: "rda_graph:285F97D3",
    title: "Medical engineering",
    url: "https://en.wikipedia.org/wiki/Medical_engineering",
  },
  {
    id: "FF2F40FC",
    parent_id: "rda_graph:285F97D3",
    title: "Nano technology",
    url: "https://en.wikipedia.org/wiki/Nano_technology",
  },
  {
    id: "5914EA8E",
    parent_id: "rda_graph:285F97D3",
    title: "Other engineering and technologies",
    url: "https://en.wikipedia.org/w/index.php?title=Other_engineering_and_technologies&action=edit&redlink=1",
  },
  {
    id: "945CF903",
    parent_id: "rda_graph:285F97D3",
    title: "Systems engineering",
    url: "https://en.wikipedia.org/wiki/Systems_engineering",
  },
  {
    id: "285F97D3",
    parent_id: "",
    title: "Engineering and technology",
    url: "https://en.wikipedia.org/wiki/Engineering",
  },
  {
    id: "695252F5",
    parent_id: "rda_graph:6DC9618F",
    title: "Arts (arts, history of arts, performing arts, music)",
    url: "https://en.wikipedia.org/wiki/Arts",
  },
  {
    id: "C0EB38D1",
    parent_id: "rda_graph:6DC9618F",
    title: "History and archaeology",
    url: "https://en.wikipedia.org/wiki/History",
  },
  {
    id: "6F570B92",
    parent_id: "rda_graph:6DC9618F",
    title: "Languages and literature",
    url: "https://en.wikipedia.org/wiki/Linguistics",
  },
  {
    id: "CD19AFF7",
    parent_id: "rda_graph:6DC9618F",
    title: "Other humanities",
    url: "https://en.wikipedia.org/wiki/Psychology",
  },
  {
    id: "0191D876",
    parent_id: "rda_graph:6DC9618F",
    title: "Philosophy, ethics and religion",
    url: "https://en.wikipedia.org/wiki/Philosophy",
  },
  {
    id: "6DC9618F",
    parent_id: "",
    title: "Humanities",
    url: "https://en.wikipedia.org/wiki/Humanities",
  },
  {
    id: "F658ED09",
    parent_id: "rda_graph:95093901",
    title: "Basic medicine",
    url: "https://en.wikipedia.org/wiki/Medicine",
  },
  {
    id: "809F56AB",
    parent_id: "rda_graph:95093901",
    title: "Clinical medicine",
    url: "https://en.wikipedia.org/wiki/Clinical_medicine",
  },
  {
    id: "1C62B010",
    parent_id: "rda_graph:95093901",
    title: "Health biotechnology",
    url: "https://en.wikipedia.org/wiki/Nano_technology",
  },
  {
    id: "337D6D04",
    parent_id: "rda_graph:95093901",
    title: "Health sciences",
    url: "https://en.wikipedia.org/wiki/Health_sciences",
  },
  {
    id: "D75F9B74",
    parent_id: "rda_graph:95093901",
    title: "Other medical sciences",
    url: "",
  },
  {
    id: "95093901",
    parent_id: "",
    title: "Medical and health sciences",
    url: "https://en.wikipedia.org/wiki/Health_sciences",
  },
  {
    id: "D17D26A9",
    parent_id: "rda_graph:18792041",
    title: "Biological sciences",
    url: "https://en.wikipedia.org/wiki/Biological_sciences",
  },
  {
    id: "F2E6C052",
    parent_id: "rda_graph:18792041",
    title: "Chemical sciences",
    url: "https://en.wikipedia.org/wiki/Chemical_sciences",
  },
  {
    id: "5CB3D8C8",
    parent_id: "rda_graph:18792041",
    title: "Computer and information sciences",
    url: "https://en.wikipedia.org/w/index.php?title=Computer_and_information_sciences&action=edit&redlink=1",
  },
  {
    id: "51DE8B93",
    parent_id: "rda_graph:18792041",
    title: "Earth and related environmental sciences",
    url: "https://en.wikipedia.org/wiki/Environmental_sciences",
  },
  { id: "E840EB86", parent_id: "rda_graph:18792041", title: "", url: "" },
  {
    id: "54EDC966",
    parent_id: "rda_graph:18792041",
    title: "Other natural sciences",
    url: "https://en.wikipedia.org/wiki/Educational_science",
  },
  {
    id: "29CE1D1A",
    parent_id: "rda_graph:18792041",
    title: "Physical sciences",
    url: "https://en.wikipedia.org/wiki/Physical_sciences",
  },
  { id: "18792041", parent_id: "", title: "Natural Sciences", url: "" },
  {
    id: "3CD09AF9",
    parent_id: "rda_graph:18792041",
    title: "Economics and business",
    url: "https://en.wikipedia.org/wiki/Economics",
  },
  {
    id: "C1E4C81A",
    parent_id: "rda_graph:18792041",
    title: "Educational sciences",
    url: "https://en.wikipedia.org/wiki/Educational_science",
  },
  {
    id: "1FD22581",
    parent_id: "rda_graph:18792041",
    title: "Law",
    url: "https://en.wikipedia.org/wiki/Law",
  },
  {
    id: "B44F0E9D",
    parent_id: "rda_graph:18792041",
    title: "Media and communications",
    url: "https://en.wikipedia.org/wiki/Media_studies",
  },
  {
    id: "1CE5D406",
    parent_id: "rda_graph:18792041",
    title: "Other social sciences",
    url: "https://en.wikipedia.org/wiki/Sociology",
  },
  {
    id: "14BAB0C3",
    parent_id: "rda_graph:18792041",
    title: "Political science",
    url: "https://en.wikipedia.org/wiki/Political_science",
  },
  {
    id: "F2BC1716",
    parent_id: "rda_graph:18792041",
    title: "Psychology",
    url: "https://en.wikipedia.org/wiki/Psychology",
  },
  {
    id: "055BCEA8",
    parent_id: "rda_graph:18792041",
    title: "Social and economic geography",
    url: "https://en.wikipedia.org/wiki/Social_geography",
  },
  {
    id: "04DFE4A5",
    parent_id: "rda_graph:18792041",
    title: "Social sciences",
    url: "https://en.wikipedia.org/wiki/Social_science",
  },
  {
    id: "C930FF6D",
    parent_id: "",
    title: "Sociology",
    url: "https://en.wikipedia.org/wiki/Sociology",
  },
];

export const rdaDomainsApi = createApi({
  reducerPath: "domains",
  baseQuery: (args) => {
    const { content } = args;

    const filteredItems = rdaDomains.filter((item) =>
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
    fetchRdaDomain: build.query({
      query: (content) => ({ content }),
      transformResponse: (response: RdaDomainsResponse, meta, arg) => {
        return response.number_of_results > 0
          ? {
              arg: arg,
              response: response.items.map((item) => ({
                label: item.title,
                value: item.url,
                idLabel: "RDA DOMAINS ID",
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

export const { useFetchRdaDomainQuery } = rdaDomainsApi;
