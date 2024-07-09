import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { /*BaseQueryFn,*/ FetchBaseQueryError } from "@reduxjs/toolkit/query";
// import axios from "axios";
// import type { AxiosRequestConfig, AxiosError, AxiosProgressEvent } from "axios";
import { setMetadataSubmitStatus, /*setFilesSubmitStatus*/ } from "./submitSlice";
// import { setFileMeta } from "../files/filesSlice";
import { setFormDisabled } from "../../deposit/depositSlice";
import { store } from "../../redux/store";
import type { Target } from "@dans-framework/user-auth";
import moment from "moment";
import { enqueueSnackbar } from "notistack";
import i18n from "../../languages/i18n";
import { formatFormData, /*formatFileData*/ } from "./submitHelpers";
// import type { SubmitData } from "../../types/Submit";

// We use Axios to enable file upload progress monitoring
/*const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" },
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
      actionType?: string;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers, actionType }) => {
    // Perform actions based on server response here, so we can truly separate metadata and file handling
    // Files are always a FormData object, metadata is JSON
    const isFile = data instanceof FormData;
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (isFile) {
            // Calculate progress percentage and set state in fileSlice
            const percentCompleted =
              progressEvent.total ?
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            store.dispatch(
              setFilesSubmitStatus({
                id: data.get("fileId") as string,
                progress: percentCompleted,
                status: "submitting",
              }),
            );
          }
        },
      });
      // set upload successful in file object
      if (isFile && result.data) {
        console.log(result);
        // we need to remove the actual files from the list, as otherwise on anothes save in the same session the files will reupload
        store.dispatch(
          setFileMeta({
            id: data.get("fileId") as string,
            type: "submittedFile",
            value: true,
          }),
        );
        store.dispatch(
          setFilesSubmitStatus({
            id: data.get("fileId") as string,
            status: "success",
          }),
        );
      }
      // Metadata has been successfully submitted, so let's store that right away
      else if (result.data) {
        store.dispatch(
          setMetadataSubmitStatus(
            actionType === "save" ? "saved" : "submitted",
          ),
        );
      }
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      if (isFile) {
        // set error in the file object, so user can retry uploading
        store.dispatch(
          setFilesSubmitStatus({
            id: data.get("fileId") as string,
            status: "error",
          }),
        );
      } else {
        store.dispatch(setMetadataSubmitStatus("error"));
      }
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };*/

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
        // TODO: check for pending files
        if (arg.actionType === "save") {
          // show notice and enable form again after successful save
          enqueueSnackbar(
            i18n.t("saveSuccess", {
              ns: "submit",
              dateTime: moment().format("D-M-YYYY @ HH:mm"),
            }),
            {
              variant: "success",
            },
          );
          store.dispatch(setMetadataSubmitStatus(
            arg.actionType === "save" ? "saved" : "submitted",
          ));
        }
        store.dispatch(setFormDisabled(false));
        return response;
      },
      transformErrorResponse: (response: FetchBaseQueryError) => {
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

      // Custom query for chaining Post functions
      // submitKey is the current users Keycloak token
      /*async queryFn(
        { user, actionType },
        queryApi,
        _extraOptions,
        fetchWithBQ,
      ) {
        const { metadata, deposit, files } = queryApi.getState() as SubmitData;
        const data = formatFormData(metadata.id, metadata.form, files, deposit.config.formTitle);

        console.log("Submit metadata:");
        console.log(data);

        // Format the headers
        const headers = {
          Authorization: `Bearer ${
            deposit.config.submitKey || user?.access_token
          }`,
          "user-id": user?.profile.sub,
          "auth-env-name": deposit.config.target?.envName,
          "assistant-config-name": deposit.config.target?.configName,
          "targets-credentials": JSON.stringify(
            deposit.config.targetCredentials.map((t: Target) => ({
              "target-repo-name": t.repo,
              credentials: {
                username: t.auth,
                password: Object.assign(
                  {},
                  ...deposit.config.targetCredentials.map((t) => ({
                    [t.authKey]: user?.profile[t.authKey],
                  })),
                )[t.authKey],
              },
            })),
          ),
        };

        console.log("Submit req headers:");
        console.log(headers);

        // First post the metadata
        const submitUrl =
          actionType === "resubmit" ?
            `resubmit/${data.id}`
          : `dataset/${actionType === "save" ? "DRAFT" : "PUBLISH"}`;

        const metadataResult = await fetchWithBQ({
          url: submitUrl,
          method: "POST",
          data: data,
          headers: headers,
          actionType: actionType,
        });

        console.log("Metadata server response:");
        console.log(metadataResult);

        if (metadataResult.error) {
          // enable form again if there's an error, so user can try and resubmit
          store.dispatch(setFormDisabled(false));
          const error = metadataResult.error as FetchBaseQueryError;
          return {
            error: {
              ...error,
              data: i18n.t(
                actionType === "save" ?
                  "saveErrorNotification"
                : "submitErrorNotification",
                {
                  ns: "submit",
                  error: (error.data as any).detail || 
                    (typeof error.data === 'object' ? JSON.stringify(error.data) : error.data),
                },
              ),
            },
          };
        }

        return { data: metadataResult };
      },*/
    }),
    /*submitFiles: build.mutation({
      async queryFn(
        { actionType },
        queryApi,
        _extraOptions,
        fetchWithBQ,
      ) {
        const { metadata, deposit, files } = queryApi.getState() as SubmitData;
        const filesToUpload = files.filter((f) => !f.submittedFile);
        // formatting the file data can take a while, so in the meantime, we activate a spinner
        filesToUpload.forEach((f) =>
          store.dispatch(
            setFilesSubmitStatus({
              id: f.id as string,
              progress: undefined,
              status: "submitting",
            }),
          ),
        );
        // then format and start submitting
        const data = await formatFileData(metadata.id, filesToUpload);
        console.log("Submitting files");

        const filesResults =
          Array.isArray(data) &&
          (await Promise.all(
            data.map((file: any) =>
              fetchWithBQ({
                url: "file",
                method: "POST",
                data: file,
                headers: {
                  "auth-env-name": deposit.config.target?.envName,
                },
              }),
            ),
          ));

        console.log("Files server response:");
        console.log(filesResults);

        const filesErrors =
          filesResults &&
          filesResults.filter((res: any) => res.error as FetchBaseQueryError);
        if (Array.isArray(filesErrors) && filesErrors.length > 0)
          return {
            error: {
              // lets just take the first error message
              ...(filesErrors[0].error as FetchBaseQueryError),
              data: i18n.t(
                actionType === "save" ?
                  "saveFileErrorNotification"
                : "submitFileErrorNotification",
                {
                  ns: "submit",
                  error: (filesErrors[0].error as FetchBaseQueryError).data,
                },
              ),
            },
          };

        if (actionType === "save") {
          // show notice and enable form again after successful save
          enqueueSnackbar(
            i18n.t("saveSuccess", {
              ns: "submit",
              dateTime: moment().format("D-M-YYYY @ HH:mm"),
            }),
            {
              variant: "success",
            },
          );
          store.dispatch(setFormDisabled(false));
        }

        return { data: filesResults };
      },
    }),*/
  }),
});

export const { useSubmitDataMutation, /*useSubmitFilesMutation*/ } = submitApi;
