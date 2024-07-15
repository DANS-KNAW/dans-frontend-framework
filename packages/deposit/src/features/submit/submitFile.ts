import * as tus from 'tus-js-client';
import { store } from "../../redux/store";
import { setFilesSubmitStatus } from "./submitSlice";
import { setFileMeta } from "../files/filesSlice";
import { SelectedFile } from "../../types/Files";
import { enqueueSnackbar } from "notistack";
import { getUser } from "@dans-framework/utils/user";
import i18n from "../../languages/i18n";
import { sendTicket } from "@dans-framework/utils/error";

const manualError = async (fileName: string, fileId: string, error: any, type: string) => {
  console.error("Error", error);
  // Since this process is not connected to Redux, we manually
  // display a message, send a Freshdesk ticket or error, and set file status to errored
  let ticket;
  if (import.meta.env.VITE_FRESHDESK_API_KEY) {
    ticket = await sendTicket({error: error, function: type});
  }
  enqueueSnackbar(`Uploading ${fileName} - ${error}`, { variant: "customError", ticket: ticket });
  store.dispatch(
    setFilesSubmitStatus({
      id: fileId,
      status: "error",
    }),
  );
}


// Create a new tus upload
export const uploadFile = async (
  file: SelectedFile, 
  sessionId: string,
  target: string = ''
) => {
  // set file status to submitting, to add it to actual upload queue, while we create the blob
  store.dispatch(
    setFilesSubmitStatus({
      id: file.id,
      progress: 0,
      status: "submitting",
    }),
  );

  // convert file url to blob
  const fetchedFile = await fetch(file.url);

  if (!fetchedFile.ok) {
    throw new Error(`Failed to fetch file: ${fetchedFile.statusText}`);
    store.dispatch(
      setFilesSubmitStatus({
        id: file.id,
        status: "error",
      }),
    );
  }

  const fileBlob = await fetchedFile.blob();

  // TUS upload logic
  const upload = new tus.Upload(fileBlob, {
    endpoint: `${import.meta.env.VITE_PACKAGING_TARGET}/files`,
    // retry 5 times on error
    retryDelays: [1000, 5000, 10000, 20000, 30000],
    // optional metadata for the file
    metadata: {
      fileName: file.name,
      fileId: file.id,
      datasetId: sessionId,
    },
    // no resume after leaving session, since we'd need to load the form first then
    storeFingerprintForResuming: false,
    onError: function (error) {
      manualError(file.name, file.id, error, 'onError function in TUS upload');
    },
    onShouldRetry: function (error, retryAttempt, _options) {
      console.error("Error", error)
      console.log("Request", error.originalRequest)
      console.log("Response", error.originalResponse)

      var status = error.originalResponse ? error.originalResponse.getStatus() : 0
      // Do not retry if the status is a 403.
      if (status === 403) {
        return false
      }

      enqueueSnackbar(
        i18n.t("uploadRetry", {
          ns: "submit",
          file: file.name,
          attempt: retryAttempt + 2,
        }),
        {
          variant: "warning",
        },
      );

      // For any other status code, we should retry.
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
        enqueueSnackbar(
          i18n.t("uploadSuccess", {
            ns: "submit",
            file: file.name,
          }),
          {
            variant: "success",
          },
        );
      } catch(error){
        // on error, file must be set to failed, as server can't processed it properly
        manualError(file.name, file.id, error, 'error dispatching PATCH call to inbox/files/{sessionID}/{tusID}');
      };
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