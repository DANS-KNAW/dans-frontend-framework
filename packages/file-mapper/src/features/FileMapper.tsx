import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useTranslation } from "react-i18next";
import { Step1, Step2, Step3 } from './Steps';
import { getActiveStep, setActiveStep, getFile, getSavedMap } from './fileMapperSlice';
import { useAppSelector, useAppDispatch } from "../redux/hooks";

const steps = ['selectFile', 'createMapping', 'finish'];

const FileMapper = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("steps");
  const activeStep = useAppSelector(getActiveStep);
  const file = useAppSelector(getFile);
  const savedMap = useAppSelector(getSavedMap);

  console.log(activeStep)

   const handleNext = () => {
    activeStep !== steps.length - 1 && !savedMap ? 
    dispatch(setActiveStep(activeStep + 1)) :
    console.log('send to api and go to form')
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
                disabled={!file && !savedMap}
                variant="outlined"   
              >
                {
                  activeStep === steps.length - 1 || savedMap 
                  ? t("buttonLast") 
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
