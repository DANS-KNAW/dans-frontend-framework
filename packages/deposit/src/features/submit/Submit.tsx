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
  getMetadata,
  resetMetadata,
  setSectionStatus,
  getSessionId,
  setOpenTab,
} from "../metadata/metadataSlice";
import { getFiles, resetFiles } from "../files/filesSlice";
import { useSubmitDataMutation, useSubmitFilesMutation } from "./submitApi";
import {
  setMetadataSubmitStatus,
  getMetadataSubmitStatus,
  getFilesSubmitStatus,
  resetFilesSubmitStatus,
  resetMetadataSubmitStatus,
  setFilesSubmitStatus,
} from "./submitSlice";
import { formatFormData, formatFileData, beforeUnloadHandler } from "./submitHelpers";
import { useTranslation } from "react-i18next";
import {
  getData,
  setFormDisabled,
  getFormDisabled,
} from "../../deposit/depositSlice";
import { useAuth } from "react-oidc-context";
import Alert from "@mui/material/Alert";
import { motion, AnimatePresence } from "framer-motion";
import { getFormActions, clearFormActions } from "@dans-framework/user-auth";

const Submit = ({
  hasTargetCredentials,
}: {
  hasTargetCredentials: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("submit");
  const auth = useAuth();
  const metadataStatus = useAppSelector(getMetadataStatus);
  const metadataSubmitStatus = useAppSelector(getMetadataSubmitStatus);
  const metadata = useAppSelector(getMetadata);
  const selectedFiles = useAppSelector(getFiles);
  const sessionId = useAppSelector(getSessionId);
  const formAction = getFormActions();
  const [fileWarning, setFileWarning] = useState<boolean>(false);

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
    fileStatusArray.indexOf("error") !== -1
    ? "error"
    : fileStatusArray.indexOf("submitting") !== -1
    ? "submitting"
    : fileStatusArray.indexOf("success") !== -1
    ? "success"
    : "";

  // If there's an error with uploading files, focus on the files tab
  useEffect(() => {
    fileStatus === "error" && dispatch(setOpenTab(1));
  }, [fileStatus])

  const [submitData, { isLoading: isLoadingMeta, isError: isErrorMeta, reset: resetMeta, isSuccess: isSuccessMeta }] =
    useSubmitDataMutation();
  const [
    submitFiles,
    { isLoading: isLoadingFiles, reset: resetSubmittedFiles, isSuccess: isSuccessFiles },
  ] = useSubmitFilesMutation();

  // Access token might just be expiring, or user settings just changed
  // we get the required submit header data as a callback to signinSilent, which refreshes the current user
  const getHeaderData = () =>
    auth.signinSilent().then(() => ({
      // we use the Keycloak access token if no auth key is set manually in the form config
      submitKey: formConfig.submitKey || auth.user?.access_token,
      userId: auth.user?.profile.sub,
      targetCredentials: formConfig.targetCredentials,
      target: formConfig.target,
      targetKeys: Object.assign(
        {},
        ...formConfig.targetCredentials.map((t) => ({
          [t.authKey]: auth.user?.profile[t.authKey],
        })),
      ),
      title: eval(`metadata${formConfig.formTitle}`)?.value, // eval...should not pose a risk, as we define the formConfig in the code
    }));

  // remove warning when files get added
  useEffect(() => {
    selectedFiles.length > 0 && fileWarning && setFileWarning(false);
  }, [selectedFiles.length]);

  // submit the data
  const handleButtonClick = (actionType: "submit" | "save" | "resubmit") => {
    // check to see if any files have been added.
    // If not, and there is no warning yet, show a warning to confirm actual submission first
    if (selectedFiles.length === 0 && !fileWarning && actionType === "submit") {
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
    } 

    const formattedMetadata = formatFormData(
      sessionId,
      metadata,
      selectedFiles,
    );
    dispatch(setFormDisabled(true));
    dispatch(setMetadataSubmitStatus("submitting"));
    // add event listener to make sure user doesn't navigate outside of app
    window.addEventListener("beforeunload", beforeUnloadHandler);

    // do the actual submit
    getHeaderData().then((headerData) =>
      // with fresh headerdata/user info, we can submit the metadata
      submitData({
        data: formattedMetadata,
        headerData: headerData,
        actionType: actionType,
      })
      .then((result: { data?: any; error?: any }) => {
        if (result.data?.data?.status === "OK") {
          // if metadata has been submitted ok, we start the file submit
          const filesToUpload = selectedFiles.filter((f) => !f.submittedFile);
          // formatting the file data can take a while, so in the meantime, we activate a spinner
          filesToUpload.forEach( f => 
            dispatch(
              setFilesSubmitStatus({
                id: f.id as string,
                progress: undefined,
                status: "submitting",
              }),
            )
          );
          // then format and start submitting
          formatFileData(sessionId, filesToUpload)
            .then((d) => {
              submitFiles({
                data: d,
                headerData: headerData,
                actionType: actionType,
              });
            })
            .catch((e) => {
              console.log(e);
            });

          // TODO: on save, set the form actions to "load" with the current sessionId
        }
      })
    );
  };

  const resetForm = () => {
    console.log('reset form')
    // reset RTK mutations
    resetSubmittedFiles();
    resetMeta();
    // reset metadata in metadata slice
    dispatch(resetMetadata());
    // reset status in submit slice
    dispatch(resetMetadataSubmitStatus());
    dispatch(resetFilesSubmitStatus());
    // reset files in file slice
    dispatch(resetFiles());
    // finally reset all section statusses
    dispatch(setSectionStatus(null));
    // and enable form
    dispatch(setFormDisabled(false));
  };

  // remove event listener when successfully submitted
  useEffect(() => {
    if (
      (isSuccessMeta && selectedFiles.length === 0) || 
      isSuccessFiles || 
      fileStatus === "success"
    ) {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    }
  }, [isSuccessMeta, isSuccessFiles, fileStatus])

  const iconSx = {
    color: "white",
  };

  return (
    <Stack direction="column" alignItems="flex-end">
      <AnimatePresence>
        {fileWarning && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <Alert severity="warning" sx={{ mb: 2 }}>
              {t("fileWarning")}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Stack direction={{ xs: "column", md: "row" }} alignItems="flex-end">
        <Stack direction="row" alignItems="center" mb={2}>
          <Typography mr={2}>
            {!metadataSubmitStatus ||
            (metadataSubmitStatus === "saved" && !formDisabled)
              ? // metadata has not yet been submitted, so let's just indicate metadata completeness
                metadataStatus === "error"
                ? t("metadataError")
                : metadataStatus === "warning" || selectedFiles.length === 0
                  ? t("metadataWarning")
                  : t("metadataSuccess")
              : // submit process has started, let's check for responses
                metadataSubmitStatus === "submitting" ||
                  fileStatus === "submitting" ||
                  isLoadingFiles ||
                  isLoadingMeta
                ? t("submitting")
                : metadataSubmitStatus === "submitted" &&
                    (fileStatus === "success" || selectedFiles.length === 0 || selectedFiles.every( f => f.submittedFile ))
                  ? t("submitSuccess")
                  : metadataSubmitStatus === "error"
                    ? t("submitErrorMetadata")
                    : fileStatus === "error"
                      ? t("submitErrorFiles")
                      : null}
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
                  metadataSubmitStatus === "submitted" &&
                  (fileStatus === "success" || selectedFiles.length === 0 || selectedFiles.every( f => f.submittedFile ))
                    ? "success"
                    : metadataStatus === "error" ||
                        fileStatus === "error" ||
                        isErrorMeta
                      ? "error"
                      : metadataStatus === "warning" ||
                          selectedFiles.length === 0
                        ? "warning"
                        : "primary"
                }.main`,
                opacity:
                  metadataSubmitStatus === "submitting" ||
                  fileStatus === "submitting" ||
                  isLoadingFiles ||
                  isLoadingMeta
                    ? 0.5
                    : 1,
              }}
            >
              {(metadataSubmitStatus === "submitted" ||
                metadataSubmitStatus === "saved") &&
              (fileStatus === "success" || selectedFiles.length === 0 || selectedFiles.every( f => f.submittedFile )) ? (
                <CheckIcon sx={iconSx} />
              ) : (metadataStatus === "error" ||
                  fileStatus === "error" ||
                  isErrorMeta) &&
                !(
                  metadataSubmitStatus === "submitting" ||
                  fileStatus === "submitting" ||
                  isLoadingFiles
                ) ? (
                <ErrorOutlineOutlinedIcon sx={iconSx} />
              ) : (
                <SendIcon sx={iconSx} />
              )}
            </Box>
            {(fileStatus === "submitting" || isLoadingFiles || isLoadingMeta) && (
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

          {
            metadataSubmitStatus === "submitted" && 
            ( fileStatus === "success" || selectedFiles.length === 0 || selectedFiles.every( f => f.submittedFile ) ) &&
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
            onClick={() => handleButtonClick(formAction.action === "resubmit" ? "resubmit" : "submit")}
            size="large"
            data-testid="submit-form"
          >
            {fileWarning ? t("submitAnyway") : t("submit")}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Submit;
