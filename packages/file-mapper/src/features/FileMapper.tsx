import { useEffect } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useTranslation } from "react-i18next";
import { Step1, Step2, Step3 } from './Steps';
import { getActiveStep, setActiveStep, getFile, getSavedMap, getMapping } from './fileMapperSlice';
import { useSubmitMapMutation } from './fileMapperApi';
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import CircularProgress from '@mui/material/CircularProgress';
import { useSiteTitle, setSiteTitle } from "@dans-framework/utils/sitetitle";
import { lookupLanguageString } from "@dans-framework/utils/language";
import { type Page } from "@dans-framework/pages";

const steps = ['selectFile', 'createMapping', 'finish'];

const FileMapper = ({setMappedForm, page}: { 
  setMappedForm: (form: any) => void;
  page: Page;
}) => {
  const dispatch = useAppDispatch();
  const siteTitle = useSiteTitle();
  const { t, i18n } = useTranslation("steps");
  const activeStep = useAppSelector(getActiveStep);
  const file = useAppSelector(getFile);
  const savedMap = useAppSelector(getSavedMap);
  const mapping = useAppSelector(getMapping);
  const [ submitMap, { isLoading, data } ] = useSubmitMapMutation();

  // set page title
  useEffect(() => {
    setSiteTitle(siteTitle, lookupLanguageString(page.name, i18n.language));
  }, [siteTitle, page.name]);

  useEffect(() => {
    // save server return data to state
    setMappedForm(data);
  }, [data]);

  const handleNext = () => {
    if (activeStep !== steps.length - 1 && (!file || !savedMap)) { 
      dispatch(setActiveStep(activeStep + 1));
    } else if ( file ) {
      (async () => {
        const fetchedFile = await fetch(file.url);
        const blob = await fetchedFile.blob();
        submitMap({
          savedMap: savedMap,
          newMap: mapping,
          file: blob,
        });
      })();
    }
  };

  const handleBack = () => {
    dispatch(setActiveStep(activeStep - 1));
  };

  return (
    <Container>
      <Grid container>
        <Grid xs={12} mt={4}>
          <Paper sx={{p: 4}}>
            <Stepper 
              activeStep={activeStep} 
              sx={{mb: 2}}
            >
              {steps.map((label) => {
                const stepProps: { completed?: boolean } = {};
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel>{t(label)}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {
              activeStep === 0
              ? <Step1 />
              : activeStep === 1
              ? <Step2 />
              : <Step3 />
            }
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'row', 
              pt: 2 
            }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
                variant="outlined"
              >
                {t("buttonBack")}
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button 
                onClick={handleNext} 
                disabled={!file || isLoading}
                variant="outlined"   
              >
                {
                  activeStep === steps.length - 1 || (file && savedMap)
                  ? t("buttonLast") 
                  : isLoading ?
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" display="flex">
                    <span>{t("isLoading")}</span>
                    <CircularProgress size={18} />
                  </Stack>
                  : t("buttonNext")
                }
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
};

export default FileMapper;
