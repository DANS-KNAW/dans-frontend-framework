import * as tus from 'tus-js-client';
import { store } from "../../redux/store";
import { setFilesSubmitStatus } from "./submitSlice";
import { setFileMeta } from "../files/filesSlice";
import { SelectedFile } from "../../types/Files";
import { enqueueSnackbar } from "notistack";

// Create a new tus upload
export const uploadFile = async (file: SelectedFile, sessionId: string) => {
  const fetchedFile = await fetch(file.url);
  const fileBlob = await fetchedFile.blob();

  console.log('upload fn')

  const upload = new tus.Upload(fileBlob, {
    // endpoint: `${import.meta.env.VITE_PACKAGING_TARGET}/files`,
    endpoint: 'https://tusd.tusdemo.net/files/',
    retryDelays: [0, 3000, 5000, 10000, 20000],
    metadata: {
      fileName: file.name,
      fileId: file.id,
      datasetId: sessionId,
    },
    onBeforeRequest: () => {
      console.log('starting TUS request to upload')
      store.dispatch(
        setFilesSubmitStatus({
          id: file.id,
          progress: 0,
          status: "submitting",
        }),
      );
    },
    onError: function (error) {
      // Display an error message
      console.log('Failed because: ' + error)
    },
    onShouldRetry: function (err, retryAttempt, _options) {
      console.log("Error", err)
      console.log("Request", err.originalRequest)
      console.log("Response", err.originalResponse)

      var status = err.originalResponse ? err.originalResponse.getStatus() : 0
      // Do not retry if the status is a 403.
      if (status === 403) {
        return false
      }

      enqueueSnackbar(`Error uploading ${file.name}. Retrying... (${retryAttempt + 1})`, {
        variant: "warning",
      });

      // For any other status code, tus-js-client should retry.
      return true
    },
    onProgress: (bytesUploaded, bytesTotal) => {
      var percentage = parseFloat(((bytesUploaded / bytesTotal) * 100).toFixed(1)) || 0;
      store.dispatch(
        setFilesSubmitStatus({
          id: file.id,
          progress: percentage,
          status: "submitting",
        }),
      );
    },
    onSuccess: () => {
      console.log('Download %s from %s', file.name, upload.url);
      store.dispatch(
        setFileMeta({
          id: file.id,
          type: "submittedFile",
          value: true,
        }),
      );
      store.dispatch(
        setFilesSubmitStatus({
          id: file.id,
          status: "success",
        }),
      );
    },
  });

  // Check if there are any previous uploads to continue.
  upload.findPreviousUploads().then(function (previousUploads) {
    // Found previous uploads so we select the first one.
    if (previousUploads.length) {
      upload.resumeFromPreviousUpload(previousUploads[0])
    }

    // Start the upload
    upload.start()
  });
}