import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  setMetadataSubmitStatus,
  setFilesSubmitStatus,
  setLatestSave,
} from "./submitSlice";
import { setFileMeta } from "../files/filesSlice";
import { formatFileData } from "./submitHelpers";
import { setFormDisabled } from "../../deposit/depositSlice";
import { store } from "../../redux/store";
import type { Target } from "@dans-framework/user-auth";
import type { HeaderData, SubmitHeaders } from "../../types/Submit";
import moment from "moment";
import * as tus from 'tus-js-client';
import type { SelectedFile } from "../../types/Files";

// We use Axios to enable file upload progress monitoring
// const axiosBaseQuery =
//   (
//     { baseUrl }: { baseUrl: string } = { baseUrl: "" },
//   ): BaseQueryFn<
//     {
//       url: string;
//       method: AxiosRequestConfig["method"];
//       data?: AxiosRequestConfig["data"];
//       params?: AxiosRequestConfig["params"];
//       headers?: AxiosRequestConfig["headers"];
//       actionType?: string;
//     },
//     unknown,
//     unknown
//   > =>
//   async ({ url, method, data, params, headers, actionType }) => {
//     // Perform actions based on server response here, so we can truly separate metadata and file handling
//     // Files are always a FormData object, metadata is JSON
//     const isFile = data instanceof FormData;
//     try {
//       const result = await axios({
//         url: baseUrl + url,
//         method,
//         data,
//         params,
//         headers,
//         onUploadProgress: (progressEvent: AxiosProgressEvent) => {
//           if (isFile) {
//             // Calculate progress percentage and set state in fileSlice
//             const percentCompleted = progressEvent.total
//               ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
//               : 0;
//             store.dispatch(
//               setFilesSubmitStatus({
//                 id: data.get("fileId") as string,
//                 progress: percentCompleted,
//                 status: "submitting",
//               }),
//             );
//           }
//         },
//       });
//       // set upload successful in file object
//       if (isFile && result.data) {
//         console.log(result);
//         // we need to remove the actual files from the list, as otherwise on anothes save in the same session the files will reupload
//         store.dispatch(
//           setFileMeta({
//             id: data.get("fileId") as string,
//             type: "submittedFile",
//             value: true,
//           }),
//         );
//         store.dispatch(
//           setFilesSubmitStatus({
//             id: data.get("fileId") as string,
//             status: "success",
//           }),
//         );
//       }
//       // Metadata has been successfully submitted, so let's store that right away
//       else if (result.data) {
//         store.dispatch(
//           setMetadataSubmitStatus(
//             actionType === "submit" ? "submitted" : "saved",
//           ),
//         );
//       }
//       return { data: result.data };
//     } catch (axiosError) {
//       const err = axiosError as AxiosError;
//       if (isFile) {
//         // set error in the file object, so user can retry uploading
//         store.dispatch(
//           setFilesSubmitStatus({
//             id: data.get("fileId") as string,
//             status: "error",
//           }),
//         );
//       } else {
//         store.dispatch(setMetadataSubmitStatus("error"));
//       }
//       return {
//         error: {
//           status: err.response?.status,
//           data: err.response?.data || err.message,
//         },
//       };
//     }
//   };

export const uploadFiles = ({files, headerData, sessionId}: {files: SelectedFile[]; headerData: SubmitHeaders, sessionId: string;}) => {
  // convert files to blobs
  formatFileData(files).then((fileBlobs) => {

    fileBlobs.map( (file: any) => {
      var upload = new tus.Upload(file.blob, {
        // Endpoint is the upload creation URL from your tus server
        // endpoint: `${import.meta.env.VITE_PACKAGING_TARGET}/inbox/files`,
        endpoint: `http://localhost:1210/files`,
        // Retry delays will enable tus-js-client to automatically retry on errors
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: headerData,
        // Attach additional meta data about the file for the server
        metadata: {
          fileName: file.fileName,
          fileId: file.fileId,
          datasetId: sessionId,
        },
        // Callback for errors which cannot be fixed using retries
        onError: (error) => {
          console.log('Failed because: ' + error)
          store.dispatch(
            setFilesSubmitStatus({
              id: file.fileId,
              status: "error",
            }),
          );
        },
        // Callback for reporting upload progress
        onProgress: (bytesUploaded, bytesTotal) => {
          var percentage = (((bytesUploaded / bytesTotal) * 100).toFixed(2) || 0) as number;
          store.dispatch(
            setFilesSubmitStatus({
              id: file.fileId,
              progress: percentage,
              status: "submitting",
            }),
          );
        },
        // Callback for once the upload is completed
        onSuccess: () => {
          console.log('Download %s from %s', file.fileName, upload.url);
          store.dispatch(
            setFileMeta({
              id: file.fileId,
              type: "submittedFile",
              value: true,
            }),
          );
          store.dispatch(
            setFilesSubmitStatus({
              id: file.fileId,
              status: "success",
            }),
          );
        },
      })
      // Check if there are any previous uploads to continue.
      upload.findPreviousUploads().then((previousUploads) => {
        // Found previous uploads so we select the first one.
        if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0])
        }
        // Start the upload
        upload.start()
      })
    });

  });
}

const formatHeaderData = (headerData: HeaderData) =>
  ({
    Authorization: `Bearer ${headerData.submitKey}`,
    "user-id": headerData.userId,
    "auth-env-name": headerData.target.envName,
    "assistant-config-name": headerData.target.configName,
    "targets-credentials": JSON.stringify(
      headerData.targetCredentials.map((t: Target) => ({
        "target-repo-name": t.repo,
        credentials: {
          username: t.auth,
          password: headerData.targetKeys[t.authKey],
        },
      })),
    ),
    title: headerData.title,
  }) as SubmitHeaders;

export const submitApi = createApi({
  reducerPath: "submitApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_PACKAGING_TARGET}/inbox/`,
  }),
  endpoints: (build) => ({
    submitData: build.mutation({
      query: ({ data, headerData, actionType }) => ({
        url: `metadata/${actionType === "save" ? "DRAFT" : "PUBLISH"}`,
        method: "POST",
        headers: formatHeaderData(headerData),
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        console.log(arg)
        await queryFulfilled;
        // when metadata has been submitted, we set this in our store
        store.dispatch(
          setMetadataSubmitStatus(
            arg.actionType === "submit" ? "submitted" : "saved",
          ),
        );
        // then we set the save date in case the save button was clicked
        arg.actionType === 'save' && store.dispatch(setLatestSave(moment().format("D-M-YYYY @ HH:mm")));
        // then we check for files and start uploading them
        if (arg.files.length > 0) {
          uploadFiles({
            files: arg.files,
            headerData: arg.headerData,
            sessionId: arg.data.id,
          });
        }
        else {
          // if there are no files, we enable the form right away again
          arg.actionType === 'save' && store.dispatch(setFormDisabled(false));
        }
      },
      transformErrorResponse: (response) => {
        store.dispatch(setMetadataSubmitStatus("error"));
        return response.status
      },
    }),
  }),
});

export const { useSubmitDataMutation } = submitApi;

/*
submitFiles: build.mutation({
      async queryFn(
        { data, headerData, actionType },
        _queryApi,
        _extraOptions,
        fetchWithBQ,
      ) {
        console.log("submitting files...");
        console.log(data.map((d: any) => [...d]));
        const headers = formatHeaderData(headerData);
        const filesResults =
          Array.isArray(data) &&
          (await Promise.all(
            data.map((file: any) =>
              fetchWithBQ({
                url: "file",
                method: "POST",
                data: file,
                headers: headers,
              }),
            ),
          ));

        console.log(filesResults);

        const filesErrors =
          filesResults &&
          filesResults.filter((res: any) => res.error as FetchBaseQueryError);
        if (Array.isArray(filesErrors) && filesErrors.length > 0)
          return { error: filesErrors };

        if (actionType === "save") {
          // enable form again after successful save
          store.dispatch(setLatestSave(moment().format("D-M-YYYY @ HH:mm")));
          store.dispatch(setFormDisabled(false));
        }

        return { data: filesResults };
      },
    }),*/