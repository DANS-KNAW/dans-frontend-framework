import { useEffect } from "react";
import Container from "@mui/material/Container";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Metadata from "../features/metadata/Metadata";
import Files from "../features/files/Files";
import type { TabPanelProps, TabHeaderProps } from "../types/Deposit";
import type { FormConfig } from "../types/Metadata";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import {
  getMetadataStatus,
  getSessionId,
  getOpenTab,
  setOpenTab,
  initForm,
} from "../features/metadata/metadataSlice";
import {
  resetFilesSubmitStatus,
  resetMetadataSubmitStatus,
} from "../features/submit/submitSlice";
import { getFiles, resetFiles, addFiles } from "../features/files/filesSlice";
import { StatusIcon } from "../features/generic/Icons";
import Submit from "../features/submit/Submit";
import { useTranslation, Trans } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { setData, setFormDisabled } from "./depositSlice";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  useSiteTitle,
  setSiteTitle,
  lookupLanguageString,
} from "@dans-framework/utils";
import type { Page } from "@dans-framework/pages";
import { useAuth } from "react-oidc-context";
import { useSearchParams } from "react-router-dom";
import { useFetchSavedMetadataQuery } from "./depositApi";
import { useValidateAllKeysQuery } from "@dans-framework/user-auth";

const Deposit = ({ config, page }: { config: FormConfig; page: Page }) => {
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const sessionId = useAppSelector(getSessionId);
  const openTab = useAppSelector(getOpenTab);
  const { t, i18n } = useTranslation("generic");
  const siteTitle = useSiteTitle();
  const [searchParams] = useSearchParams();

  // Can load a saved form based on metadata id, passed along from e.g. UserSubmissions
  const savedFormId = searchParams.get("id");
  const { data: savedFormData, isSuccess } = useFetchSavedMetadataQuery(
    savedFormId,
    { skip: !savedFormId },
  );

  // set page title
  useEffect(() => {
    setSiteTitle(siteTitle, lookupLanguageString(page.name, i18n.language));
  }, [siteTitle, page.name]);

  // Initialize form on initial render when there's no sessionId yet or when form gets reset
  // Or initialize saved data (overwrites the previously set sessionId)
  // Must initialize on page load when a savedFormId is set, to load new saved data
  useEffect(() => {
    if (!sessionId || (sessionId && savedFormData?.id && savedFormId)) {
      // we need to reset the form status first, in case data had been previously entered
      dispatch(resetMetadataSubmitStatus());
      dispatch(resetFilesSubmitStatus());
      dispatch(resetFiles());
      // enable the form
      dispatch(setFormDisabled(false));
      // then we load new/empty data
      dispatch(
        initForm(
          savedFormId && savedFormData?.id ? savedFormData : config.form,
        ),
      );
      // and load the files if there are any
      savedFormData &&
        savedFormData["file-metadata"] &&
        dispatch(addFiles(savedFormData["file-metadata"]));
    }
  }, [dispatch, sessionId, config.form, savedFormData, savedFormId, isSuccess]);

  // Set init form props in redux, all props without the form metadata config itself
  useEffect(() => {
    dispatch(setData(config));
  }, [config]);

  // Update user on initial render, makes sure all keys are up-to-date
  useEffect(() => {
    auth.signinSilent();
  }, []);

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

  const hasTargetCredentials = targetCredentials && !apiKeyError;

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Container>
        <Grid container>
          <Grid xs={12} mt={4}>
            {!hasTargetCredentials && (
              // show a message if keys are missing
              <Alert severity="warning">
                <AlertTitle>{t("missingInfoHeader")}</AlertTitle>
                <Trans
                  i18nKey="generic:missingInfoText"
                  components={[
                    <Link component={RouterLink} to="/user-settings" />,
                  ]}
                />
              </Alert>
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
          </Grid>
          <Grid
            xs={12}
            mt={4}
            display="flex"
            justifyContent="end"
            alignItems="center"
          >
            <Submit hasTargetCredentials={hasTargetCredentials} />
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
      />
    </Tabs>
  );
};

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return value === index ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box mt={2}>{children}</Box>
    </motion.div>
  ) : null;
};

export default Deposit;
