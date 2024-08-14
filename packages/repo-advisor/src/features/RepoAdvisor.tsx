import { useState, useEffect, Fragment, type Dispatch, type SetStateAction } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useDebounce } from "use-debounce";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import type { AutocompleteAPIFieldData, FormConfig } from "@dans-framework/deposit";
import { AnimatePresence, motion } from "framer-motion";
import { useSubmitMutation } from "./repoAdvisorApi";
import { enqueueSnackbar } from "notistack";
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getActiveStep } from './repoAdvisorSlice';
import { Step1, Step2 } from './Steps';

const steps = ['defineDataset', 'recommendations'];

const RepoAdvisor = ({setRepoConfig}: {setRepoConfig: Dispatch<SetStateAction<any>>}) => {
  const [recommendations, setRecommendations] = useState<FormConfig[]>();
  const [ror, setRor] = useState<Option | null>(null);
  const [narcis, setNarcis] = useState<Option | null>(null);
  const [depositType, setDepositType] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  const activeStep = useAppSelector(getActiveStep);
  const [ submit, { data, isLoading } ] = useSubmitMutation();
  const { t } = useTranslation('steps');
  const handleNext = () => {
    if (activeStep !== steps.length - 1) { 
      dispatch(setActiveStep(activeStep + 1));
    } else {
      submit({
        ror: ror,
        narcis: narcis,
        fileType: fileType,
      });
    }
  };
  const handleBack = () => {
    dispatch(setActiveStep(activeStep - 1));
  };

  const resetRecommendations = () => {
    setRecommendations(undefined);
  }

  const pickRepo = (repo: FormConfig) => {
    // set repo and redirect to deposit
    setRepoConfig(repo);
    navigate("/deposit");
    window.scrollTo({top: 0, behavior: "smooth"});
  }

  const dataMissing = 
    !ror ||
    !narcis ||
    !depositType ||
    (depositType === 'dataset' && !fileType);

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
                disabled={isLoading}
                variant="outlined"   
              >
                {
                  activeStep === steps.length - 1
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

    /*<Container>
      <Grid container justifyContent="center">
        <Grid xs={12} sm={11} md={8} lg={7} xl={6} mt={4}>
          <Paper sx={{p: 4}}>
            <Typography variant="h3">
              Repository advisor
            </Typography>
            <Typography mb={4}>
              Fill out the form below to get recommendations on where to submit your data.
            </Typography>
            <ApiField
              type="ror"
              label="Your institution"
              value={ror}
              setValue={setRor}
            />
            <ApiField 
              type="narcis"
              label="Research domain"
              value={narcis}
              setValue={setNarcis}
            />
            <SelectField 
              label="Deposit type"
              value={depositType}
              onChange={setDepositType}
              options={[
                {label: "Dataset", value: "dataset"},
                {label: "Code", value: "code"},
                {label: "Report, article, or presentation", value: "report"},
                {label: "Publication", value: "publication"},
              ]}
            />
            <AnimatePresence>
              {depositType === 'dataset' &&
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <SelectField 
                    label="File type"
                    value={fileType}
                    onChange={setFileType}
                    options={[
                      {label: "Audiovisual materials", value: "audiovisual_materials"},
                      {label: "Statistical data", value: "statistical_data"},
                      {label: "Geospatial data files", value: "geospatial_data_files"},
                      {label: "NetCDF and HDF files", value: "netcdf_and_hdf_files"},
                      {label: "Darwin core and ecological markup language files", value: "darwin_core_and_ecological_markup_language_files"},
                      {label: "Other", value: "other"},
                    ]}
                  />
                </motion.div>
              }
            </AnimatePresence >
            <Button 
              variant="contained" 
              size="large" 
              onClick={fetchRecommendations} 
              disabled={dataMissing || loading}
            >
              {dataMissing ? "Complete the form to get recommendations" : "Get recommendations"}
            </Button>
          </Paper>
          <div id="recommendations" />
          <AnimatePresence>
            {recommendations && 
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Paper sx={{p: 4, mt: 1}}>
                  <Typography variant="h5" mb={1}>
                    Recommended repositories
                  </Typography>
                  {recommendations.length === 0 ?
                    <Typography mb={2}>
                      Sorry, at the moment we cannot recommend a suitable repository for your data set
                    </Typography>
                    :
                    <List sx={{mb: 2}}>
                      {recommendations.map( (rec, i) =>
                        <Fragment key={i}>
                          <ListItem 
                            alignItems="flex-start"
                            disableGutters
                            secondaryAction={
                              rec.external ?
                              <Link href={rec.external} target="_blank">
                                <Button variant="contained">Deposit</Button>
                              </Link> :
                              <Button variant="contained" onClick={() => pickRepo(rec)}>
                                Deposit
                              </Button>
                            }
                          >
                           <ListItemText
                              primary={rec.displayName?.en}
                              secondary={
                                <>
                                  {rec.external && <Typography
                                    sx={{ display: 'inline', mr: 0.5 }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    External repository: opens in new tab  — 
                                  </Typography>}
                                  {rec.description?.en}
                                </>
                              }
                              sx={{pr: 6}}
                            />
                          </ListItem>
                          {i < recommendations.length - 1 && <Divider component="li" />}
                        </Fragment>
                      )}
                    </List>
                  }
                  <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                    <Button size="large" variant="contained" onClick={resetRecommendations} color="warning">
                      Reset advisor
                    </Button>
                  </Box>
                </Paper>
              </motion.div>
            }
          </AnimatePresence >
        </Grid>
      </Grid>
    </Container>*/
  );
};

export default RepoAdvisor;
