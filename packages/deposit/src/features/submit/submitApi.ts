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

export const submitApi = createApi({
  reducerPath: "submitApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_PACKAGING_TARGET}/inbox/`,
  }),
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
          url: submitUrl,
          method: "POST",
          headers: headers,
          body: data,
        })
      },
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
        // enable form again if there's an error, so user can try and resubmit
        store.dispatch(setFormDisabled(false));
        return {
          error: {
            ...response,
            data: i18n.t("submitMetadataError", {
              ns: "submit",
              error: (response.data as any).detail || 
                (typeof response.data === 'object' ? JSON.stringify(response.data) : response.data),
            }),
          },
        };
      },
    }),
  }),
});

export const { useSubmitDataMutation } = submitApi;
