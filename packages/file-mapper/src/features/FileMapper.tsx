import { useState } from "react";
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
import type { MappingProps } from "../types";

const steps = ['selectFile', 'createMapping', 'finish'];

const FileMapper = () => {
  const [ activeStep, setActiveStep ] = useState(0);
  const [ mapping, setMapping ] = useState<MappingProps>({});
  const [ file, setFile ] = useState<File>();
  const [ savedMap, setSavedMap ] = useState<string>();
  const { t } = useTranslation("steps");

   const handleNext = () => {
    activeStep !== steps.length - 1 && !savedMap ? 
    setActiveStep(activeStep + 1) :
    console.log('send to api and go to form')
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
              ? <Step1 setFile={setFile} file={file} savedMap={savedMap} setSavedMap={setSavedMap} />
              : activeStep === 1
              ? <Step2 file={file} setMapping={setMapping} mapping={mapping} />
              : <Step3 mapping={mapping} />
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
