import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import CheckIcon from "@mui/icons-material/Check";
import SendIcon from "@mui/icons-material/Send";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
  getMetadataStatus,
  resetMetadata,
  getMetadata,
  getSessionId,
} from "../metadata/metadataSlice";
import { getFiles, resetFiles } from "../files/filesSlice";
import { useSubmitDataMutation /*useSubmitFilesMutation*/ } from "./submitApi";
import { uploadFile } from "./submitFile";
import {
  setMetadataSubmitStatus,
  getMetadataSubmitStatus,
  setFilesSubmitStatus,
  getFilesSubmitStatus,
  resetFilesSubmitStatus,
  resetMetadataSubmitStatus,
} from "./submitSlice";
import { useTranslation } from "react-i18next";
import {
  getData,
  setFormDisabled,
  getFormDisabled,
  setOpenTab,
  getTouchedStatus,
} from "../../deposit/depositSlice";
import { useAuth } from "react-oidc-context";
import Alert from "@mui/material/Alert";
import { motion, AnimatePresence } from "framer-motion";
import { getFormActions, clearFormActions } from "@dans-framework/user-auth";
import { useDebouncedCallback } from "use-debounce";
import { enqueueSnackbar } from "notistack";
import { lookupLanguageString } from "@dans-framework/utils";

const Submit = ({
  hasTargetCredentials,
}: {
  hasTargetCredentials: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation("submit");
  const auth = useAuth();
  const metadataStatus = useAppSelector(getMetadataStatus);
  const metadataSubmitStatus = useAppSelector(getMetadataSubmitStatus);
  const selectedFiles = useAppSelector(getFiles);
  const formAction = getFormActions();
  const metadata = useAppSelector(getMetadata);
  const isTouched = useAppSelector(getTouchedStatus);
  const [fileWarning, setFileWarning] = useState<boolean>(false);
  const sessionId = useAppSelector(getSessionId);

  // get form config
  const formConfig = useAppSelector(getData);
  const formDisabled = useAppSelector(getFormDisabled);

  // File status exists in an array, so we need to do some processing and filtering.
  const filesSubmitStatus = useAppSelector(getFilesSubmitStatus).filter(
    (f) => f.id !== "",
  );

  // Calculate total upload progress
  const totalFileProgress =
    filesSubmitStatus.reduce((n, { progress }) => n + (progress || 0), 0) /
      filesSubmitStatus.length || undefined;

  // If any file has an error, the form should indicate that
  const fileStatusArray = [...new Set(filesSubmitStatus.map((f) => f.status))];
  const fileStatus =
    fileStatusArray.indexOf("error") !== -1 ? "error"
    : (
      fileStatusArray.indexOf("submitting") !== -1 ||
      fileStatusArray.indexOf("queued") !== -1
    ) ?
      "submitting"
    : fileStatusArray.indexOf("success") !== -1 ? "success"
    : "";

  // If there's an error with uploading files, focus on the files tab
  useEffect(() => {
    fileStatus === "error" && dispatch(setOpenTab(1));
  }, [fileStatus]);

  const [
    submitData,
    { isLoading: isLoadingMeta, isError: isErrorMeta, reset: resetMeta },
  ] = useSubmitDataMutation();

  // Access token might just be expiring, or user settings just changed
  // So we do a callback to signinSilent, which refreshes the current user
  const getUser = () =>
    auth
      .signinSilent()
      .then(() => auth.user)
      .catch(() => {
        // make sure we display an error when there's an issue signing in/refreshing the user's token
        enqueueSnackbar("Athentication error", { variant: "customError" });
      });

  // remove warning when files get added
  useEffect(() => {
    selectedFiles.length > 0 && fileWarning && setFileWarning(false);
  }, [selectedFiles.length]);

  // submit the data
  const handleButtonClick = (actionType: "submit" | "save" | "resubmit") => {
    // check to see if any files have been added.
    // If not, and there is no warning yet, show a warning to confirm actual submission first
    if (selectedFiles.length === 0 && !formConfig.filesUpload?.disableFileWarning && !fileWarning && actionType === "submit") {
      setFileWarning(true);
      // move to files tab
      dispatch(setOpenTab(1));
      // do not submit yet
      return;
    }

    // Files are present or a warning has already been shown to the user
    setFileWarning(false);

    // Clear any form action messages on submit
    if (actionType === "resubmit" || actionType === "submit") {
      clearFormActions();
      dispatch(setFormDisabled(true));
    }

    dispatch(setMetadataSubmitStatus("submitting"));

    // do the actual submit
    getUser().then((user) =>
      // with fresh headerdata/user info, we can submit the metadata
      submitData({
        user: user,
        actionType: actionType,
        id: sessionId,
        metadata: metadata,
        config: formConfig,
        files: selectedFiles,
      }).then((result: { data?: any; error?: any }) => {
        if (result.data?.status === "OK") {
          // if metadata has been submitted ok, we start the file submit
          selectedFiles.map((file) => {
            const hasStatus = filesSubmitStatus.find((f) => f.id === file.id);
            // make sure file is not already submitted or currently submitting
            return (
              !file.submittedFile &&
              (!hasStatus || hasStatus?.status === "error") &&
              dispatch(
                setFilesSubmitStatus({
                  id: file.id,
                  progress: 0,
                  status: "queued",
                }),
              )
            );
          });
        }
      }),
    );
  };

  // Autosave functionality, debounced on metadata change
  const autoSave = useDebouncedCallback(() => {
    // on autosave, we send along file metadata, but not the actual files
    if (!formDisabled && isTouched) {
      submitData({
        user: auth.user,
        actionType: "save",
        id: sessionId,
        metadata: metadata,
        config: formConfig,
        files: selectedFiles,
        // set flag autoSave, so we don't show a snackbar each time
        autoSave: true,
      });
    }
  }, 2000);

  useEffect(() => {
    !import.meta.env.VITE_DISABLE_AUTOSAVE && autoSave();
  }, [metadata]);

  // Reset the entire form to initial state
  const resetForm = () => {
    // reset RTK mutations
    // resetSubmittedFiles();
    resetMeta();
    // reset metadata in metadata slice
    dispatch(resetMetadata());
    // reset status in submit slice
    dispatch(resetMetadataSubmitStatus());
    dispatch(resetFilesSubmitStatus());
    // reset files in file slice
    dispatch(resetFiles());
    // and enable form
    dispatch(setFormDisabled(false));
  };

  const iconSx = {
    color: "white",
  };

  return (
    <Stack direction="column" alignItems="flex-end" mt={4}>
      <AnimatePresence>
        {fileWarning && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <Alert severity="warning" sx={{ mb: 2 }}>
              {lookupLanguageString(formConfig.filesUpload?.customFileWarning, i18n.language) || t("fileWarning")}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Stack direction={{ xs: "column", md: "row" }} alignItems="flex-end">
        <Stack direction="row" alignItems="center" mb={2}>
          <Typography mr={2}>
            {
              (
                !metadataSubmitStatus ||
                (metadataSubmitStatus === "saved" &&
                  !formDisabled &&
                  fileStatus !== "submitting")
              ) ?
                // metadata has not yet been submitted, so let's just indicate metadata completeness
                metadataStatus === "error" ?
                  t("metadataError")
                : metadataStatus === "warning" || selectedFiles.length === 0 ?
                  t("metadataWarning")
                : t("metadataSuccess")
                // submit process has started, let's check for responses
              : (
                metadataSubmitStatus === "submitting" ||
                fileStatus === "submitting" ||
                isLoadingMeta
              ) ?
                t("submitting")
              : (
                metadataSubmitStatus === "submitted" &&
                (fileStatus === "success" ||
                  selectedFiles.length === 0 ||
                  selectedFiles.every((f) => f.submittedFile))
              ) ?
                t("submitSuccess")
              : metadataSubmitStatus === "error" ?
                t("submitErrorMetadata")
              : fileStatus === "error" ?
                t("submitErrorFiles")
              : null
            }
          </Typography>

          <Box
            sx={{ mr: 2, position: "relative" }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{
                p: 1.2,
                borderRadius: "50%",
                backgroundColor: `${
                  (
                    metadataSubmitStatus === "submitted" &&
                    (fileStatus === "success" ||
                      selectedFiles.length === 0 ||
                      selectedFiles.every((f) => f.submittedFile))
                  ) ?
                    "success"
                  : (
                    metadataStatus === "error" ||
                    fileStatus === "error" ||
                    isErrorMeta
                  ) ?
                    "error"
                  : metadataStatus === "warning" || selectedFiles.length === 0 ?
                    "warning"
                  : "primary"
                }.main`,
                opacity:
                  (
                    metadataSubmitStatus === "submitting" ||
                    fileStatus === "submitting" ||
                    isLoadingMeta
                  ) ?
                    0.5
                  : 1,
              }}
            >
              {(
                (metadataSubmitStatus === "submitted" ||
                  metadataSubmitStatus === "saved") &&
                (fileStatus === "success" ||
                  selectedFiles.length === 0 ||
                  selectedFiles.every((f) => f.submittedFile))
              ) ?
                <CheckIcon sx={iconSx} />
              : (
                (metadataStatus === "error" ||
                  fileStatus === "error" ||
                  isErrorMeta) &&
                !(
                  metadataSubmitStatus === "submitting" ||
                  fileStatus === "submitting"
                )
              ) ?
                <ErrorOutlineOutlinedIcon sx={iconSx} />
              : <SendIcon sx={iconSx} />}
            </Box>
            {(fileStatus === "submitting" ||
              // isLoadingFiles ||
              isLoadingMeta) && (
              <CircularProgress
                size={54}
                sx={{
                  color: green[500],
                  position: "absolute",
                  zIndex: 1,
                }}
                variant={totalFileProgress ? "determinate" : "indeterminate"}
                value={totalFileProgress}
              />
            )}
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" mb={2}>
          <Button
            variant="contained"
            disabled={formDisabled || formAction.action === "resubmit"}
            onClick={() => handleButtonClick("save")}
            size="large"
            sx={{ mr: 1 }}
            data-testid="save-form"
          >
            {t("save")}
          </Button>

          {metadataSubmitStatus === "submitted" &&
            (fileStatus === "success" ||
              selectedFiles.length === 0 ||
              selectedFiles.every((f) => f.submittedFile)) &&
            formDisabled && (
              <Button
                variant="contained"
                onClick={resetForm}
                size="large"
                sx={{ mr: 1 }}
                data-testid="reset-form"
              >
                {t("reset")}
              </Button>
            )}

          <Button
            variant="contained"
            disabled={
              !hasTargetCredentials ||
              formDisabled ||
              (metadataStatus === "error" && !formConfig.skipValidation)
            }
            onClick={() =>
              handleButtonClick(
                formAction.action === "resubmit" ? "resubmit" : "submit",
              )
            }
            size="large"
            data-testid="submit-form"
          >
            {fileWarning ?
              t("submitAnyway")
            : formAction.action === "resubmit" ?
              t("resubmit")
            : t("submit")}
          </Button>
          <FileUploader />
        </Stack>
      </Stack>
    </Stack>
  );
};

const FileUploader = () => {
  // Component that manages file upload queue.
  // Check files that have status queued, and start uploading when a spot becomes available in the queue.
  const maxConcurrentUploads = 3;
  const filesSubmitStatus = useAppSelector(getFilesSubmitStatus);
  const selectedFiles = useAppSelector(getFiles);
  const sessionId = useAppSelector(getSessionId);
  const formConfig = useAppSelector(getData);

  useEffect(() => {
    const currentlyUploading = filesSubmitStatus.filter(
      (file) => file.status === "submitting",
    );
    if (currentlyUploading.length < maxConcurrentUploads) {
      // add first file of selectedFiles that is not currently uploading to the active uploads
      selectedFiles.find((file) => {
        // only call the upload function if file is queued
        const hasStatus = filesSubmitStatus.find((f) => f.id === file.id);
        return (
          hasStatus?.status === "queued" &&
          uploadFile(file, sessionId, formConfig.target?.envName)
        );
      });
    }
  }, [filesSubmitStatus, selectedFiles, sessionId, formConfig]);

  return null;
};

export default Submit;
