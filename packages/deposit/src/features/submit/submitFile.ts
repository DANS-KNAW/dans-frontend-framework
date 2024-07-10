import * as tus from 'tus-js-client';
import { store } from "../../redux/store";
import { setFilesSubmitStatus } from "./submitSlice";
import { setFileMeta } from "../files/filesSlice";
import { SelectedFile } from "../../types/Files";
import { enqueueSnackbar } from "notistack";
import { getUser } from "@dans-framework/utils/user";

// Create a new tus upload
export const uploadFile = async (
  file: SelectedFile, 
  sessionId: string,
  target: string = ''
) => {
  // set a loader right away, while we wait for blob to be created
  store.dispatch(
    setFilesSubmitStatus({
      id: file.id,
      progress: 0,
      status: "submitting",
    }),
  );

  const fetchedFile = await fetch(file.url);
  const fileBlob = await fetchedFile.blob();

  console.log('upload fn')
  console.log(file)


  const upload = new tus.Upload(fileBlob, {
    endpoint: `${import.meta.env.VITE_PACKAGING_TARGET}/files`,
    // endpoint: 'https://tusd.tusdemo.net/files/',
    retryDelays: [0, 3000, 5000, 10000, 20000],
    metadata: {
      fileName: file.name,
      fileId: file.id,
      datasetId: sessionId,
    },
    storeFingerprintForResuming: false,
    onError: function (error) {
      // Display an error message
      console.log('Failed because: ' + error);

      enqueueSnackbar(`Error uploading ${file.name}`, {
        variant: "error",
      });
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
      var percentage = parseFloat(((bytesUploaded / bytesTotal) * 100).toFixed(0)) || 0;
      store.dispatch(
        setFilesSubmitStatus({
          id: file.id,
          progress: percentage,
          status: "submitting",
        }),
      );
    },
    onSuccess: async () => {
      const tusId = upload.url?.split('/').pop();
      const user = getUser();
      // Due to incomplete Python TUS implementation,
      // we do an extra api PATCH call to the server to signal succesful upload
      try {
        const response = await fetch(`${import.meta.env.VITE_PACKAGING_TARGET}/inbox/files/${sessionId}/${tusId}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
            "auth-env-name": target,
          },
        });
        const json = await response.json();
        console.log(json);
      } catch(error){
        console.error(error);
      };
      
      // set file status to success
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
      upload.resumeFromPreviousUpload(previousUploads[0]);
    }

    // Start the upload
    upload.start();
  });
}