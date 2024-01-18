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
import moment from "moment";
import * as tus from 'tus-js-client';
import type { SelectedFile } from "../../types/Files";
import { enqueueSnackbar } from "notistack";

export const uploadFiles = ({files, headerData, sessionId}: {files: SelectedFile[]; headerData: HeaderData, sessionId: string;}) => {
  // convert files to blobs
  console.log(headerData)
  formatFileData(files).then((fileBlobs) => {

    fileBlobs.map( (file: any) => {
      console.log(file)
      var upload = new tus.Upload(file.blob, {
        // Endpoint is the upload creation URL from your tus server
        // endpoint: `${import.meta.env.VITE_PACKAGING_TARGET}/inbox/files`,
        endpoint: `http://127.0.0.1:1080/files`,
        // Retry delays will enable tus-js-client to automatically retry on errors
        retryDelays: [3000, 8000, 15000, 25000],
        // specific headers for packaging service, disabled for testing with demo nodejs server
        // headers: formatHeaderData(headerData),
        // Attach additional meta data about the file for the server
        metadata: {
          fileName: file.fileName,
          fileId: file.fileId,
          datasetId: sessionId,
        },
        // action before connecting to server
        onBeforeRequest: () => {
          store.dispatch(
            setFilesSubmitStatus({
              id: file.fileId,
              progress: 0,
              status: "submitting",
            }),
          );
        },
        // callback for every retry
        onShouldRetry: (err, retryAttempt) => {
          console.log("Error", err)
          console.log("Request", err.originalRequest)
          console.log("Response", err.originalResponse)

          var status = err.originalResponse ? err.originalResponse.getStatus() : 0
          // Do not retry if the status is a 403.
          if (status === 403) {
            return false
          }

          enqueueSnackbar(`Error uploading ${file.fileName}. Retrying... (${retryAttempt + 1})`, {
            variant: "warning",
          });

          // For any other status code, we retry.
          return true
        },
        // Callback for errors which cannot be fixed using retries
        onError: (error) => {
          console.log('Failed because: ' + error)
          enqueueSnackbar(`Uploading ${file.fileName} failed: ${error}`, {
            variant: "error",
          });
          store.dispatch(
            setFilesSubmitStatus({
              id: file.fileId,
              status: "error",
            }),
          );
        },
        // Callback for reporting upload progress
        onProgress: (bytesUploaded, bytesTotal) => {
          var percentage = parseFloat(((bytesUploaded / bytesTotal) * 100).toFixed(2)) || 0;
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
    // header data only for metadata, not required for files
    ...headerData.target && headerData.targetCredentials && headerData.targetKeys ? {
      "auth-env-name": headerData.target.envName,
      "assistant-config-name": headerData.target.configName,
      "targets-credentials": JSON.stringify(
        headerData.targetCredentials.map((t: Target) => ({
          "target-repo-name": t.repo,
          credentials: {
            username: t.auth,
            password: headerData.targetKeys![t.authKey],
          },
        })),
      ),
      title: headerData.title
    } : [],
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
        console.log(formatHeaderData(arg.headerData))
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
            headers: { 
              Authorization: `Bearer ${headerData.submitKey}`,
              "auth-env-name": headerData.target.envName,
            }
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