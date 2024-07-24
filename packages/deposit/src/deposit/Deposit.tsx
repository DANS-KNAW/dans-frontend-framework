import { useEffect, useState } from "react";
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
  getMetadataStatus,
  getSessionId,
  getOpenTab,
  setOpenTab,
  initForm,
  resetMetadata,
  getTouchedStatus,
} from "../features/metadata/metadataSlice";
import {
  resetFilesSubmitStatus,
  resetMetadataSubmitStatus,
  getMetadataSubmitStatus,
} from "../features/submit/submitSlice";
import { getFiles, resetFiles, addFiles } from "../features/files/filesSlice";
import { StatusIcon } from "../features/generic/Icons";
import Submit from "../features/submit/Submit";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { Link as RouterLink } from "react-router-dom";
import { setData, setFormDisabled, getData } from "./depositSlice";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  useSiteTitle,
  setSiteTitle,
  lookupLanguageString,
} from "@dans-framework/utils";
import type { Page } from "@dans-framework/pages";
import { useAuth } from "react-oidc-context";
import { useFetchSavedMetadataQuery } from "./depositApi";
import {
  useValidateAllKeysQuery,
  getFormActions,
  clearFormActions,
  setFormActions,
} from "@dans-framework/user-auth";
import { v4 as uuidv4 } from "uuid";

/*
 * TODO:
 * Resubmitting of (errored) forms does not work yet
 * It needs work on the API side
 */

const Deposit = ({ config, page }: { config: FormConfig; page: Page }) => {
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const sessionId = useAppSelector(getSessionId);
  const openTab = useAppSelector(getOpenTab);
  const { t, i18n } = useTranslation("generic");
  const siteTitle = useSiteTitle();
  const [dataMessage, setDataMessage] = useState(false);
  const formAction = getFormActions();
  const formTouched = useAppSelector(getTouchedStatus);
  const currentConfig = useAppSelector(getData);

  // Can load a saved form based on metadata id, passed along from UserSubmissions.
  // Set form behaviour based on action param.
  // load: loaded data from a saved form, to edit
  // copy: copy data from saved form to a new sessionId
  // resubmit: resubmit existing and already submitted data (save disabled), set submit button target to resubmit action in API
  const { data: serverFormData, isSuccess } = useFetchSavedMetadataQuery(
    formAction.id,
    { skip: !formAction.id },
  );

  // set page title
  useEffect(() => {
    setSiteTitle(siteTitle, lookupLanguageString(page.name, i18n.language));
  }, [siteTitle, page.name]);

  // Initialize form on initial render when there's no sessionId yet or when form gets reset
  // Or initialize saved data (overwrites the previously set sessionId)
  useEffect(() => {
    if (!sessionId || (sessionId && serverFormData && formAction.id)) {
      // We need to reset the form status first, in case data had been previously entered
      dispatch(resetMetadataSubmitStatus());
      dispatch(resetFilesSubmitStatus());
      dispatch(resetFiles());
      // Enable the form
      dispatch(
        formAction.action === "view" ?
          setFormDisabled(true)
        : setFormDisabled(false),
      );
      // Then we create a fresh form if there's no id to load
      if (!sessionId && !formAction.id) {
        dispatch(initForm(config.form));
      }
      // If there's server data available, load that into the form
      // For copying a form, we create a new uuid as sessionId.
      else if (serverFormData && formAction && !formAction.actionDone) {
        dispatch(
          initForm(
            formAction.action === "copy" ?
              {
                ...serverFormData.md,
                id: uuidv4(),
              }
            : serverFormData.md,
          ),
        );
        // Make sure we only do this once, otherwise it's an infinite loop
        setFormActions({
          ...formAction,
          actionDone: true,
        });
      }
      // Load the files if there are any, but not when copying form
      if (
        formAction.id &&
        serverFormData &&
        serverFormData.md["file-metadata"] &&
        formAction.action !== "copy"
      ) {
        dispatch(addFiles(serverFormData.md["file-metadata"]));
      }
    }
  }, [
    dispatch,
    sessionId,
    config.form,
    serverFormData,
    formAction.id,
    isSuccess,
  ]);

  useEffect(() => {
    // Show a message when a saved form is loaded.
    // Show a message when data's been entered previously.
    // Give option to clear form and start again.
    ((sessionId && formTouched) || formAction.id) && setDataMessage(true);
    // Update user on initial render, makes sure all keys are up-to-date
    auth.signinSilent();
    // Set init form props in redux, all props without the form metadata config itself
    dispatch(setData(config));
  }, []);

  // For external form selection from the pre-form advisor without reloading the app,
  // we listen for changes to the form object, and initiate a new form when it changes
  useEffect(() => {
    if (config.displayName && (!currentConfig.displayName || (currentConfig.displayName.en !== config.displayName.en))) {
      dispatch(resetMetadataSubmitStatus());
      dispatch(resetFilesSubmitStatus());
      dispatch(resetFiles());
      dispatch(setFormDisabled(false));
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

  const { error: apiKeyError } = useValidateAllKeysQuery(validateTargets, {
    skip: !targetCredentials,
  });

  const hasTargetCredentials = (targetCredentials && !apiKeyError) || import.meta.env.VITE_DISABLE_API_KEY_MESSAGE;

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Container>
        <Grid container>
          <Grid xs={12} mt={4}>
            {/* Shows user a message about current form state */}
            <ActionMessage 
              dataMessage={dataMessage}
              setDataMessage={setDataMessage} 
            />
            {/* The form. Show an overlay if there's no API key filled in */}
            <Box sx={{ position: "relative" }}>
              {!hasTargetCredentials &&
                !import.meta.env.VITE_DISABLE_API_KEY_MESSAGE && (
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
                    <Paper elevation={15} sx={{mt: 15}}>
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
  const metadataStatus = useAppSelector(getMetadataStatus);

  return (
    <Tabs value={value} onChange={handleChange}>
      <Tab
        label={t("heading", { ns: "metadata" })}
        icon={<StatusIcon status={metadataStatus} margin="r" />}
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
  const { data } = useFetchSavedMetadataQuery(formAction.id, { 
    skip: !formAction.id 
  });
  const metadataSubmitStatus = useAppSelector(getMetadataSubmitStatus);

  return (
    <Collapse in={dataMessage}>
      <Alert
        severity={formAction.action === "resubmit" ? "error" : "info"}
        data-testid="data-message"
        onClose={() => {
          setDataMessage(false);
        }}
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
          {formAction.action === "resubmit" ?
            t("dataMessageHeaderResubmit", {
              title:
                (data && data.title) ||
                t("untitled"),
            })
          : formAction.action === "copy" ?
            t("dataMessageHeaderCopy", {
              title:
                (data && data.title) ||
                t("untitled"),
            })
          : formAction.action === "load" ?
            t("dataMessageHeaderLoad", {
              title:
                (data && data.title) ||
                t("untitled"),
            })
          : formAction.action === "view" ?
            t("dataMessageHeaderView", {
              title:
                (data && data.title) ||
                t("untitled"),
            })
          : metadataSubmitStatus === "submitted" ?
            t("dataMessageHeaderSubmitted")
          : t("dataMessageHeader")}
        </AlertTitle>
        <Typography mb={1}>
          {formAction.action === "resubmit" ?
            t("dataMessageContentResubmit")
          : formAction.action === "copy" ?
            t("dataMessageContentCopy")
          : formAction.action === "load" ?
            t("dataMessageContentLoad")
          : formAction.action === "view" ?
            t("dataMessageContentView")
          : metadataSubmitStatus === "submitted" ?
            t("dataMessageContentSubmitted")
          : t("dataMessageContent")}
        </Typography>
        <Stack
          justifyContent="flex-end"
          direction="row"
          alignItems="center"
        >
          <Typography mb={0} mr={2} variant="h6">
            {formAction.action === "view" ?
              t("dataResetHeaderView")
            : t("dataResetHeader")}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              dispatch(resetMetadata());
              setDataMessage(false);
              clearFormActions();
            }}
            color="warning"
          >
            {t("dataResetButton")}
          </Button>
        </Stack>
      </Alert>
    </Collapse>
  )
}

export default Deposit;
