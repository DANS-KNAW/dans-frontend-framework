import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from "@mui/material/Unstable_Grid2";
import Container from "@mui/material/Container";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getActiveStep, getRor, getNarcis, getFileType, getDepositType, setActiveStep, getRepo } from './repoAdvisorSlice';
import { Step1, Step2 } from './Steps';
import { useSiteTitle, setSiteTitle } from "@dans-framework/utils/sitetitle";
import { lookupLanguageString } from "@dans-framework/utils/language";
import type { Page } from "@dans-framework/pages";
import type { FormConfig } from "@dans-framework/deposit";

const steps = ['defineDataset', 'recommendations'];

const RepoAdvisor = ({setRepoConfig, page, depositLocation}: {
  setRepoConfig: Dispatch<SetStateAction<FormConfig | undefined>>;
  page: Page;
  depositLocation: string;
}) => {
  const dispatch = useAppDispatch();
  const siteTitle = useSiteTitle();
  const ror = useAppSelector(getRor);
  const narcis = useAppSelector(getNarcis);
  const fileType = useAppSelector(getFileType);
  const depositType = useAppSelector(getDepositType);
  const repo = useAppSelector(getRepo);
  const navigate = useNavigate();
  const activeStep = useAppSelector(getActiveStep);
  const { t, i18n } = useTranslation('steps');

  // set page title
  useEffect(() => {
    setSiteTitle(siteTitle, lookupLanguageString(page.name, i18n.language));
  }, [siteTitle, page.name]);

  const handleNext = () => {
    if (activeStep !== steps.length - 1) { 
      dispatch(setActiveStep(activeStep + 1));
    } 
    else if (repo && repo.external) {
      window.location.href = repo.external;
    }
    else {
      setRepoConfig(repo);
      navigate(depositLocation);
      window.scrollTo({top: 0, behavior: "smooth"});
    }
  };

  const handleBack = () => {
    dispatch(setActiveStep(activeStep - 1));
  };

  const dataMissing = 
    !ror ||
    !narcis ||
    !depositType ||
    (depositType === 'dataset' && !fileType);

  return (
    <Container>
      <Grid container display="flex" justifyContent="center">
        <Grid xs={12} md={10} lg={8} mt={4}>
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
              : <Step2 />
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
                variant="outlined"
                disabled={dataMissing || (!repo && activeStep === steps.length - 1)}
              >
                {
                  activeStep === steps.length - 1
                  ? t("buttonLast") 
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

export default RepoAdvisor;
