import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { setMetadataSubmitStatus } from "./submitSlice";
import { setFormDisabled } from "../../deposit/depositSlice";
import { store } from "../../redux/store";
import type { Target } from "@dans-framework/user-auth";
import moment from "moment";
import { enqueueSnackbar } from "notistack";
import i18n from "../../languages/i18n";
import { formatFormData } from "./submitHelpers";
import type { SavedFormResponse } from "../../types/Metadata";

export const submitApi = createApi({
  reducerPath: "submitApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_PACKAGING_TARGET}`,
  }),
  tagTypes: ["Forms"],
  endpoints: (build) => ({
    submitData: build.mutation({
      query: ({ user, actionType, id, metadata, config, files }) => {
        console.log(metadata)
        // format data
        const data = formatFormData(id, metadata, files, config.formTitle);
        console.log("Submit metadata:");
        console.log(data);

        // format headers
        const headers = {
          Authorization: `Bearer ${
            config.submitKey || user?.access_token
          }`,
          "user-id": user?.profile.sub,
          "auth-env-name": config.target?.envName,
          "assistant-config-name": config.target?.configName,
          "targets-credentials": JSON.stringify(
            config.targetCredentials.map((t: Target) => ({
              "target-repo-name": t.repo,
              credentials: {
                username: t.auth,
                password: Object.assign(
                  {},
                  ...config.targetCredentials.map((t: Target) => ({
                    [t.authKey]: user?.profile[t.authKey],
                  })),
                )[t.authKey],
              },
            })),
          ),
        };
        console.log("Submit req headers:");
        console.log(headers);

        const submitUrl =
          actionType === "resubmit" ?
            `resubmit/${data.id}`
          : `dataset/${actionType === "save" ? "DRAFT" : "PUBLISH"}`;

        return ({
          url: `inbox/${submitUrl}`,
          method: "POST",
          headers: headers,
          body: data,
        })
      },
      invalidatesTags: (_res, _err, arg ) => [{ type: "Forms", id: arg.id }],
      transformResponse: (response, _meta, arg) => {
        store.dispatch(setMetadataSubmitStatus(
          arg.actionType === "save" ? "saved" : "submitted",
        ));
        if (arg.actionType === "save" && !arg.autoSave) {
          // show notice and enable form again after successful save
          enqueueSnackbar(
            i18n.t(arg.files.length === 0 ? "saveSuccess" : "saveFileSuccess", {
              ns: "submit",
              dateTime: moment().format("D-M-YYYY @ HH:mm"),
            }),
            {
              variant: "success",
            },
          );
        }
        return response;
      },
      transformErrorResponse: (response: FetchBaseQueryError) => {
        // flag submit as failed
        store.dispatch(setMetadataSubmitStatus("error"));
        // enable form again, so user can try and resubmit
        store.dispatch(setFormDisabled(false));
        return ({
          error: i18n.t("submit:submitMetadataError", { error: response.status })
        });
      },
    }),
    fetchSavedMetadata: build.query({
      query: (id) => ({
        url: `dataset/${id}`,
        headers: { Accept: "application/json" },
      }),
      providesTags: (_res, _err, id) => [{ type: "Forms", id }],
      transformResponse: (response: SavedFormResponse) => {
        // mark previously submitted files
        const modifiedResponse = {
          ...response,
          md: {
            ...response.md,
            "file-metadata":
              response.md["file-metadata"] ?
                response.md["file-metadata"].map((f) => ({
                  ...f,
                  submittedFile: true,
                }))
              : [],
          },
        };
        return modifiedResponse;
      },
    }),
  }),
});

export const { 
  useSubmitDataMutation,
  useFetchSavedMetadataQuery
} = submitApi;
