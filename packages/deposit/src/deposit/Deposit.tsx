import { useEffect, useState, /*useRef*/ } from "react";
import Container from "@mui/material/Container";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Metadata from "../features/metadata/Metadata";
import Files from "../features/files/Files";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import type { TabPanelProps, TabHeaderProps } from "../types/Deposit";
import type { FormConfig } from "../types/Metadata";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import {
  getSessionId,
  initForm,
  getSections,
  getTouchedStatus,
  getForm,
  setExternalFormData,
  updateAllSections,
} from "../features/metadata/metadataSlice";
import { getSectionStatus } from "../features/metadata/metadataHelpers";
import {
  resetFilesSubmitStatus,
  resetMetadataSubmitStatus,
  getMetadataSubmitStatus,
  getFilesSubmitStatus,
} from "../features/submit/submitSlice";
import { getFiles, resetFiles, addFiles } from "../features/files/filesSlice";
import { StatusIcon } from "../features/generic/Icons";
import Submit from "../features/submit/Submit";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Link as RouterLink } from "react-router-dom";
import { setData, setFormDisabled, getOpenTab, setOpenTab, getData } from "./depositSlice";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  useSiteTitle,
  setSiteTitle,
  lookupLanguageString,
} from "@dans-framework/utils";
import type { Page } from "@dans-framework/pages";
import { useAuth } from "react-oidc-context";
import { useFetchSavedMetadataQuery, useFetchExternalMetadataMutation } from "../features/submit/submitApi";
import {
  useValidateAllKeysQuery,
  getFormActions,
  clearFormActions,
  useFetchUserProfileQuery, 
  useSaveUserDataMutation,
} from "@dans-framework/user-auth";
import { v4 as uuidv4 } from "uuid";
import CircularProgress from "@mui/material/CircularProgress";

const Deposit = ({ config, page }: { config: FormConfig; page: Page }) => {
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const sessionId = useAppSelector(getSessionId);
  // const lastProcessedId = useRef<string | null>(null);
  const openTab = useAppSelector(getOpenTab);
  const { t, i18n } = useTranslation("generic");
  const siteTitle = useSiteTitle();
  const formAction = getFormActions();
  const formTouched = useAppSelector(getTouchedStatus);
  const currentConfig = useAppSelector(getData);
  const [dataMessage, setDataMessage] = useState(false);
  const [sessionData, setSessionData] = useState<{url: string; key: string; token: string;}>();

  // Can load a saved form based on metadata id, passed along from UserSubmissions.
  // Set form behaviour based on action param.
  // load: loaded data from a saved form, to edit
  // copy: copy data from saved form to a new sessionId
  // resubmit: resubmit existing and already submitted data (save disabled), set submit button target to resubmit action in API
  const { data: serverFormData, isLoading: serverDataLoading } = useFetchSavedMetadataQuery({ id: formAction.id }, {
    skip: !formAction.id,
  });

  // Function for fetching external metadata from e.g. Dataverse
  const [ fetchExternalData, { isLoading: externalDataLoading } ] = useFetchExternalMetadataMutation();

  useEffect(() => {
    if (!sessionId && config.form) {
      // initialize form if no sessionId is set
      // set config from app in Deposit slice
      dispatch(setData(config));
      // initialize sections and metadata state 
      dispatch(initForm(config.form));
    }
  }, [config, sessionId]);

  // set page title
  useEffect(() => {
    setSiteTitle(siteTitle, lookupLanguageString(page.name, i18n.language));
  }, [siteTitle, page.name]);

  // Load external form data
  useEffect(() => {
    if (!formAction?.id || !serverFormData?.md) return; // Ensure data is available
    // If formAction.id is the same as the last processed one, don't reinitialize
    // Changed to use sessionId instead of lastProcessedId.current, to prevent reloading old values when rendering form again (in line with editing an unsaved form).
    // TODO: some fine tuning for user experience:
    // Ideally, we should add another state (like load, copy we have now) to be able to track unsaved edits in a loaded form, to give feedback to the user.
    // Right now, when a user is editing a saved form and does not save, but goes to submission overview and clicks edit on that same form, the form does not reload the data again.
    // Maybe it should? But it should not reload when just switching between pages.
    if ( /*lastProcessedId.current*/ sessionId === formAction.id && formAction.action !== "copy") {
      return;
    }
    // Update the last processed ID (but allow copy to regenerate new UUID)
    // lastProcessedId.current = formAction.id;
    // Reset states before loading new data
    dispatch(resetMetadataSubmitStatus());
    dispatch(resetFilesSubmitStatus());
    dispatch(resetFiles());
    // Determine the new session ID
    const newSessionId = formAction.action === "copy" ? uuidv4() : serverFormData["dataset-id"];
    // Load the form data
    dispatch(setExternalFormData({ 
      metadata: serverFormData.md.metadata, 
      action: formAction.action, 
      id: newSessionId 
    }));
    formAction.action !== "copy" && dispatch(addFiles(serverFormData.md["file-metadata"]));
    // update section status indicators
    dispatch(updateAllSections());
    // Handle form disabling logic
    dispatch(setFormDisabled(formAction.action === "view"));
  }, [formAction?.id, serverFormData?.["dataset-id"]]); 

  useEffect(() => {
    // Show a message when a saved form is loaded.
    // Show a message when data's been entered previously.
    // Give option to clear form and start again.
    ((sessionId && formTouched) || formAction.id) && setDataMessage(true);
    // Update user on initial render, makes sure all target credentials are up-to-date.
    // Also remove user immediately, should there be an error..
    auth.signinSilent().catch(() => auth.removeUser());
  }, [formAction.id]);

  // For external form selection from the pre-form advisor without reloading the app,
  // we listen for changes to the form object, and initiate a new form when it changes
  useEffect(() => {
    if (
      config.form &&
      config.displayName &&
      (!currentConfig.displayName ||
        (typeof currentConfig.displayName !== "string" &&
          typeof config.displayName !== "string" &&
          currentConfig.displayName.en !== config.displayName.en) ||
        currentConfig.displayName !== config.displayName)
    ) {
      dispatch(resetMetadataSubmitStatus());
      dispatch(resetFilesSubmitStatus());
      dispatch(resetFiles());
      dispatch(setFormDisabled(false));
      dispatch(setData(config));
      dispatch(initForm(config.form));
      setDataMessage(false);
    }
  }, [config, currentConfig]);

  // Check the user object if target credentials are filled in
  const targetCredentials =
    config.targetCredentials.filter(
      (t) => !auth.user?.profile[t.authKey] && t.authKey,
    ).length === 0;

  // Check if they are actually valid
  const validateTargets = config.targetCredentials.map((t) => ({
    key: auth.user?.profile[t.authKey],
    url: t.keyCheckUrl,
    type: t.authKey,
  }));

  const { error: apiKeyError,  refetch: refetchValidateAllKeys } = useValidateAllKeysQuery(validateTargets, {
    skip: !targetCredentials,
  });

  const hasTargetCredentials = (targetCredentials && !apiKeyError) || import.meta.env.VITE_DISABLE_API_KEY_MESSAGE;

  // Logic for loading form data and api key from external source, e.g. from Dataverse
  const { data: userProfileData } = useFetchUserProfileQuery(null, {skip: hasTargetCredentials});
  const [ saveData, { isLoading: saveKeyLoading, isSuccess: saveKeySuccess } ] = useSaveUserDataMutation();

  // Set the API key from the session storage, if available
  useEffect(() => {
    const sessionEditData = sessionStorage.getItem("preloadEdit");
    if (sessionEditData) {
      // Decode the Base64 URL-encoded string
      const decodedData = atob(sessionEditData.replace(/-/g, '+').replace(/_/g, '/'));
      // Parse the JSON string into an object
      const data = JSON.parse(decodedData);
      setSessionData(data);
      // Clear storage
      sessionStorage.removeItem("preloadEdit");
    }
  }, []);

  useEffect(() => {
    // Save API key only when present in session data and not saved already
    if (sessionData?.key && userProfileData && !saveKeySuccess) {
      saveData({
        content: {
          // need to pass along the entire account object to Keycloak
          ...userProfileData,
          attributes: {
            ...userProfileData.attributes,
            [sessionData.key]: sessionData.token,
          },
        },
      });
    }
    if (sessionData?.url) {
      // fetch user form data 
      fetchExternalData({url: sessionData.url, config: currentConfig});
    }
  }, [userProfileData, sessionData, saveKeySuccess]);

  useEffect(() => {
    if (saveKeySuccess) {
      // refresh the user object
      auth.signinSilent().catch(() => auth.removeUser());
      // Trigger the refetch of the API key validation
      refetchValidateAllKeys(); 
    }
  }, [saveKeySuccess, refetchValidateAllKeys]);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Container>
        <Grid container>
          <Grid xs={12}>
            <Typography variant="h1">{t("deposit")}</Typography>
            {/* Shows user a message about current form state */}
            <ActionMessage
              dataMessage={dataMessage}
              setDataMessage={setDataMessage}
            />
            {/* The form. Show an overlay if there's no API key filled in, or a loader when loading server data */}
            <Box sx={{ position: "relative" }}>
              {(!hasTargetCredentials || serverDataLoading || externalDataLoading)
                && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 10,
                      background: "rgba(245,245,245,0.8)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    {!hasTargetCredentials && !saveKeyLoading ?
                      <Paper elevation={15} sx={{ mt: 15 }}>
                        <Alert
                          severity="warning"
                          data-testid="invalid-api-keys"
                          sx={{ p: 3 }}
                        >
                          <AlertTitle>{t("missingInfoHeader")}</AlertTitle>
                          <Typography mb={2}>{t("missingInfoText")}</Typography>
                          <Button
                            variant="contained"
                            component={RouterLink}
                            to="/user-settings"
                          >
                            {t("missingInfoButton")}
                          </Button>
                        </Alert>
                      </Paper>
                      :
                      <CircularProgress sx={{ mt: 15 }} />
                    }
                  </Box>
                )}

              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabHeader
                  value={openTab}
                  handleChange={(_e, val) => dispatch(setOpenTab(val))}
                />
              </Box>
              <AnimatePresence initial={false}>
                <TabPanel value={openTab} index={0} key="tab1">
                  <Metadata />
                </TabPanel>
                <TabPanel value={openTab} index={1} key="tab2">
                  <Files />
                </TabPanel>
              </AnimatePresence>
              <Submit hasTargetCredentials={hasTargetCredentials} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

// Put Tabheader into a separate component, to handle namespace loading and suspense
const TabHeader = ({ value, handleChange }: TabHeaderProps) => {
  const { t } = useTranslation(["metadata", "files"]);
  const selectedFiles = useAppSelector(getFiles);
  const sections = useAppSelector(getSections);

  return (
    <Tabs value={value} onChange={handleChange}>
      <Tab
        label={t("heading", { ns: "metadata" })}
        icon={<StatusIcon status={getSectionStatus(sections)} margin="r" />}
        iconPosition="start"
        data-testid="metadata-tab"
      />
      <Tab
        label={t("heading", { ns: "files" })}
        icon={
          <StatusIcon
            status={selectedFiles.length > 0 ? "success" : "warning"}
            margin="r"
          />
        }
        iconPosition="start"
        data-testid="files-tab"
      />
    </Tabs>
  );
};

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return value === index ?
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Box mt={2}>{children}</Box>
      </motion.div>
    : null;
};

const ActionMessage = ({
  dataMessage,
  setDataMessage,
}: {
  dataMessage: boolean;
  setDataMessage: (arg: boolean) => void;
}) => {
  const { t } = useTranslation("generic");
  const dispatch = useAppDispatch();
  const formAction = getFormActions();
  const { data } = useFetchSavedMetadataQuery({ id: formAction.id }, {
    skip: !formAction.id,
  });
  const metadataSubmitStatus = useAppSelector(getMetadataSubmitStatus);
  const form = useAppSelector(getForm);
  const filesSubmitStatus = useAppSelector(getFilesSubmitStatus).filter(
    (f) => f.id !== "",
  );
  // Check for file statuses
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


  return (
    <Collapse in={dataMessage}>
      <Alert
        severity={formAction.action === "resubmit" ? "error" : "info"}
        data-testid="data-message"
        onClose={formAction.action !== "view" ? () => setDataMessage(false) : undefined}
        sx={{
          position: "relative",
          "& .MuiAlert-message": {
            flex: 1,
          },
          "& .MuiAlert-action": {
            position: "absolute",
            right: "0.75rem",
            marginRight: 0,
          },
        }}
      >
        <AlertTitle>
          {metadataSubmitStatus === "submitted" && (fileStatus === 'success' || !fileStatus) ?
            t("dataMessageHeaderSubmitted")
          : metadataSubmitStatus === "submitted" && fileStatus === 'submitting' ?
            t("dataMessageHeaderSubmittedFilesPending")
          : metadataSubmitStatus === "submitted" && fileStatus === 'error' ?
            t("dataMessageHeaderSubmittedFilesError")
          : formAction.action === "resubmit" ?
            t("dataMessageHeaderResubmit", {
              title:  data?.title || t("untitled"),
            })
          : formAction.action === "copy" ?
            t("dataMessageHeaderCopy", {
              title: data?.title || t("untitled"),
            })
          : formAction.action === "load" ?
            t("dataMessageHeaderLoad", {
              title: data?.title || t("untitled"),
            })
          : formAction.action === "view" ?
            t("dataMessageHeaderView", {
              title: data?.title || t("untitled"),
            })
          : t("dataMessageHeader")}
        </AlertTitle>
        <Typography mb={1}>
          {metadataSubmitStatus === "submitted" && (fileStatus === 'success' || !fileStatus) ?
            t("dataMessageContentSubmitted")
          : metadataSubmitStatus === "submitted" && fileStatus === 'submitting' ?
            t("dataMessageContentSubmittedFilesPending")
          : metadataSubmitStatus === "submitted" && fileStatus === 'error' ?
            t("dataMessageContentSubmittedFilesError")
          : formAction.action === "resubmit" ?
            t("dataMessageContentResubmit")
          : formAction.action === "copy" ?
            t("dataMessageContentCopy")
          : formAction.action === "load" ?
            t("dataMessageContentLoad")
          : formAction.action === "view" ?
            t(import.meta.env.VITE_ALLOW_RESUBMIT ? "dataMessageContentView" : "dataMessageContentViewNoResubmit")
          : t("dataMessageContent")}
        </Typography>
        <Stack justifyContent="flex-end" direction="row" alignItems="center">
          <Typography mb={0} mr={2} variant="h6">
            {formAction.action === "view" ?
              t("dataResetHeaderView")
            : t("dataResetHeader")}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              // reset everything and enable form again
              dispatch(initForm(form));
              dispatch(resetFiles());
              dispatch(resetFilesSubmitStatus());
              dispatch(resetMetadataSubmitStatus());
              dispatch(setFormDisabled(false));
              setDataMessage(false);
              clearFormActions();
            }}
            disabled={fileStatus === 'submitting'}
            color="warning"
          >
            {t("dataResetButton")}
          </Button>
        </Stack>
      </Alert>
    </Collapse>
  );
};

export default Deposit;
