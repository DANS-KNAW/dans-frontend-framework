import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import type {
  RdaWorkGroupResponse,
  RdaPathwaysResponse,
  RdaInterestGroupsResponse,
  RdaDomainsResponse,
  GorcResponse,
} from "../../../types/Api";
import i18n from "../../../languages/i18n";

/**
 * TODO: This uses a dummy API. API should provide ability to search.
 * Right now it just dumps all data.
 */

/**
 * Recursive helper function to check if the item has a parent.
 * Returns the title of the parent and its parents.
 * TODO: Should be moved to API level.
 */
const addParentHierarchy = (data: GorcResponse[], itemId: string): string => {
  const item = data.find((item) => item.id === itemId);
  if (!item || !item.parent_id) {
    return "";
  } else {
    const parent = addParentHierarchy(data, item.parent_id);
    return parent ? `${parent} > ${item.title}` : item.title;
  }
};

export const rdaApi = createApi({
  reducerPath: "rdaApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://globhut.labs.dans.knaw.nl" }),
  endpoints: (build) => ({
    fetchRdaDomain: build.query({
      query: () => "domains",
      transformResponse: (response: RdaDomainsResponse[]) => {
        return response.length > 0 ?
            {
              response: response.map((item) => ({
                label: item.title,
                value: item.id,
                idLabel: "RDA domain ID",
                id: item.id,
                url: item.url,
              })),
            }
          : [];
      },
      transformErrorResponse: () => ({
        error: i18n.t("metadata:apiFetchError", { api: "RDA Domains" }),
      }),
    }),
    fetchRdaInterestGroup: build.query({
      query: () => "interestgroups",
      transformResponse: (response: RdaInterestGroupsResponse[]) => {
        return response.length > 0 ?
            {
              response: response.map((item) => ({
                label: item.title,
                value: item.id,
                idLabel: "RDA interest group ID",
                id: item.id,
                url: item.url,
              })),
            }
          : [];
      },
    }),
    fetchRdaPathway: build.query({
      query: () => "pathways",
      transformResponse: (response: RdaPathwaysResponse[]) => {
        return response.length > 0 ?
            {
              response: response.map((item) => ({
                label: item.title,
                value: item.id,
                idLabel: "RDA pathway ID",
                id: item.id,
                extraLabel: "Description",
                extraContent: item.description,
              })),
            }
          : [];
      },
      transformErrorResponse: () => ({
        error: i18n.t("metadata:apiFetchError", { api: "RDA Pathways" }),
      }),
    }),
    fetchRdaWorkingGroup: build.query({
      query: () => "workinggroups",
      transformResponse: (response: RdaWorkGroupResponse[]) => {
        return response.length > 0 ?
            {
              response: response.map((item) => ({
                label: item.title,
                value: `{"node_id":"${item.id}","UUID_WorkingGroup":"${item.parent_id}"}`,
                idLabel: "RDA working group ID",
                id: item.id,
              })),
            }
          : [];
      },
      transformErrorResponse: () => ({
        error: i18n.t("metadata:apiFetchError", { api: "RDA Working Groups" }),
      }),
    }),
    fetchGorc: build.query({
      query: () => "gorc",
      transformResponse: (response: GorcResponse[]) => {
        if (response.length > 0) {
          const updatedResponse = response.map((item) => ({
            ...item,
            parent_hierarchy: addParentHierarchy(response, item.id),
          }));

          return {
            response: updatedResponse.map((item) => ({
              label: item.title,
              value: item.id,
              extraLabel: "description",
              extraContent: item.description,
              idLabel: "GORC ID",
              id: item.id,
              categoryLabel: "Hierarchy",
              categoryContent: item.parent_hierarchy,
            })),
          };
        } else {
          return [];
        }
      },
      transformErrorResponse: () => ({
        error: i18n.t("metadata:apiFetchError", { api: "GORC" }),
      }),
    }),
  }),
});

export const {
  useFetchRdaDomainQuery,
  useFetchRdaInterestGroupQuery,
  useFetchRdaPathwayQuery,
  useFetchRdaWorkingGroupQuery,
  useFetchGorcQuery,
} = rdaApi;
