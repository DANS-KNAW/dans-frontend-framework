import { useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useTranslation } from "react-i18next";
import SelectFile from "./SelectFile";
import SetMapping from "./SetMapping";
import SaveMapping from "./SaveMapping";
import {
  getActiveStep,
  setActiveStep,
  getFile,
  getSavedMap,
  getMapping,
  getFileError,
  reset,
  type FileMapperState,
} from "./fileMapperSlice";
import { useStoreHooks } from "@dans-framework/shared-store";
import { useSiteTitle, setSiteTitle } from "@dans-framework/utils/sitetitle";
import { lookupLanguageString } from "@dans-framework/utils/language";
import type { Page } from "@dans-framework/pages";
import {
  addFiles,
  initForm,
  type FormConfig,
  type FileLocation,
  type DepositState,
} from "@dans-framework/deposit";
import { steps } from "./Steps";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const FileMapper = ({
  config,
  /*setMappedForm,*/ page,
  depositPageSlug,
}: {
  config: FormConfig;
  // setMappedForm?: Dispatch<SetStateAction<FormConfig | undefined>>;
  page: Page;
  depositPageSlug?: string;
}) => {
  const { useAppSelector, useAppDispatch } = useStoreHooks<FileMapperState & DepositState>();
  const dispatch = useAppDispatch();
  const siteTitle = useSiteTitle();
  const { t, i18n } = useTranslation("steps");
  const activeStep = useAppSelector(getActiveStep);
  const file = useAppSelector(getFile);
  const savedMap = useAppSelector(getSavedMap);
  const mapping = useAppSelector(getMapping);
  const fileError = useAppSelector(getFileError);
  const navigate = useNavigate();

  // submit to server, disabled for now
  // const [ submitMap, { isLoading, data } ] = useSubmitMapMutation();

  // set page title
  useEffect(() => {
    setSiteTitle(siteTitle, lookupLanguageString(page.name, i18n.language));
  }, [siteTitle, page.name]);

  // useEffect(() => {
  //   // save server returned data to state
  //   setMappedForm(data);
  // }, [data]);

  const handleNext = () => {
    if (activeStep !== steps.length - 1 && (!file || !savedMap)) {
      dispatch(setActiveStep(activeStep + 1));
    } else if (file) {
      // submit to server
      // let's disable this for now, and just load the file and the selected mapping into the Deposit package redux store
      // (async () => {
      //   const fetchedFile = await fetch(file.url);
      //   const blob = await fetchedFile.blob();
      //   submitMap({
      //     savedMap: savedMap,
      //     newMap: mapping,
      //     file: blob,
      //   });
      // })();

      // add file to deposit form directly
      const serializedFile = {
        id: uuidv4(),
        name: file.name,
        size: file.size,
        type: file.name.substring(file.name.lastIndexOf(".") + 1),
        location: "local" as FileLocation,
        url: file.url,
        private: false,
        lastModified: 0,
        mapping: mapping,
        mimeType: file.type,
      };

      // must initialize the form here, otherwise files will get overwritten
      config.form && dispatch(initForm(config.form));
      // add files to initialized form
      dispatch(addFiles([serializedFile]));
      // navigate to form
      depositPageSlug && navigate(depositPageSlug);
      // reset file mapper
      dispatch(reset());
    }
  };

  const handleBack = () => {
    dispatch(setActiveStep(activeStep - 1));
  };

  return (
    <Container>
      <Grid container>
        <Grid size={{ xs: 12 }} mt={4}>
          <Paper sx={{ p: 4 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
              {steps.map((label) => {
                const stepProps: { completed?: boolean } = {};
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel>{t(label)}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === 0 ?
              <SelectFile />
            : activeStep === 1 ?
              <SetMapping />
            : <SaveMapping />}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                pt: 2,
              }}
            >
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
                variant="contained"
              >
                {t("buttonBack")}
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                onClick={handleNext}
                disabled={
                  !file ||
                  /*isLoading ||*/
                  fileError !== undefined ||
                  (activeStep === steps.length - 1 &&
                    file &&
                    Object.keys(mapping).length === 0)
                }
                variant="contained"
              >
                {
                  activeStep === steps.length - 1 || (file && savedMap) ?
                    t("buttonLast")
                    // : isLoading ?
                    // <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" display="flex">
                    //   <span>{t("isLoading")}</span>
                    //   <CircularProgress size={18} />
                    // </Stack>
                  : t("buttonNext")
                }
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FileMapper;
