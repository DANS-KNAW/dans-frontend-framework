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
import { fetchTypeaheadApiData, postRecommendationsApiData } from "./apiHelpers";
import { enqueueSnackbar } from "notistack";
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';

const RepoAdvisor = ({setRepoConfig}: {setRepoConfig: Dispatch<SetStateAction<any>>}) => {
  const [recommendations, setRecommendations] = useState<FormConfig[]>([]);
  const [ror, setRor] = useState<Option | null>(null);
  const [narcis, setNarcis] = useState<Option | null>(null);
  const [depositType, setDepositType] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(false);
    const result = await postRecommendationsApiData(ror!.value, narcis!.value, depositType, fileType);
    result ? setRecommendations(result) : setError(true);
    setLoading(false);
    // and scroll down a bit to show recommendations
    const recs = document.getElementById("recommendations");
    recs && recs.scrollIntoView({
      behavior: 'smooth'
    });
  }

  const resetRecommendations = () => {
    setRecommendations([]);
  }

  const pickRepo = (repo: FormConfig) => {
    // set repo and redirect to deposit
    setRepoConfig(repo);
    navigate("/deposit");
    window.scrollTo({top: 0, behavior: "smooth"});
  }

  useEffect(() => {
    error && enqueueSnackbar("Something's gone wrong fetching recommendations. Please try again.", { variant: "customError" });
  }, [error]);

  const dataMissing = 
    !ror ||
    !narcis ||
    !depositType ||
    (depositType === 'dataset' && !fileType);

  return (
    <Container>
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
              disabled={recommendations.length > 0}
            />
            <ApiField 
              type="narcis"
              label="Research domain"
              value={narcis}
              setValue={setNarcis}
              disabled={recommendations.length > 0}
            />
            <SelectField 
              label="Deposit type"
              value={depositType}
              onChange={setDepositType}
              options={[
                {label: "Dataset", value: "dataset"},
                {label: "Code", value: "code"},
                {label: "Report", value: "report"},
                {label: "Publication", value: "publication"},
              ]}
              disabled={recommendations.length > 0}
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
                      {label: "Audiovisual", value: "audiovisual"},
                      {label: "Other", value: "other"},
                    ]}
                    disabled={recommendations.length > 0}
                  />
                </motion.div>
              }
            </AnimatePresence >
            <Button 
              variant="contained" 
              size="large" 
              onClick={fetchRecommendations} 
              disabled={recommendations.length > 0 || dataMissing || loading}
            >
              {dataMissing ? "Complete the form to get recommendations" : "Get recommendations"}
            </Button>
          </Paper>
          <div id="recommendations" />
          <AnimatePresence>
            {recommendations.length > 0 && 
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Paper sx={{p: 4, mt: 1}}>
                  <Typography variant="h5" mb={1}>
                    Recommended repositories
                  </Typography>
                  <List sx={{mb: 2}}>
                    {recommendations.map( (rec, i) =>
                      <Fragment key={i}>
                        <ListItem 
                          alignItems="flex-start"
                          disableGutters
                          secondaryAction={
                            <Button key={i} variant="contained" onClick={() => pickRepo(rec)}>
                              Deposit
                            </Button>
                          }
                        >
                         <ListItemText
                            primary={rec.displayName?.en}
                            secondary={rec.description?.en}
                            sx={{pr: 6}}
                          />
                        </ListItem>
                        {i < recommendations.length - 1 && <Divider component="li" />}
                      </Fragment>
                    )}
                  </List>
                  <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                    <Button size="large" variant="contained" onClick={resetRecommendations} color="warning">
                      Reset recommendations
                    </Button>
                  </Box>
                </Paper>
              </motion.div>
            }
          </AnimatePresence >
        </Grid>
      </Grid>
    </Container>
  );
};

type Option = {
  value: string;
  label: string;
};

const SelectField = ({label, value, onChange, options, disabled}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  options: Option[];
  disabled: boolean;
}) =>
  <Box mb={2}>
    <FormControl fullWidth disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={(e: SelectChangeEvent) => onChange(e.target.value)}
      >
        {options.map( option => 
          <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
        )}
      </Select>
    </FormControl>
  </Box>

// Derived from the API field in the Deposit package
const ApiField = ({type, label, value, setValue, disabled}: {
  type: string;
  label: string;
  value: Option | null;
  setValue: Dispatch<SetStateAction<any>>;
  disabled: boolean;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [data, setData] = useState<AutocompleteAPIFieldData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const debouncedInputValue = useDebounce(inputValue, 500)[0];

  useEffect(() => {
    error && enqueueSnackbar(`Could not reach the ${type} database`, { variant: "customError" });
  }, [error])
  
  useEffect( () => {
    const fetchData = async () => {
      const results = await fetchTypeaheadApiData(type, debouncedInputValue);
      results ? setData(results) : setError(true);
      setLoading(false);
    };
    debouncedInputValue && fetchData();
  }, [debouncedInputValue]);

  useEffect( () => {
    inputValue && setLoading(true);
  }, [inputValue]);

  return (
    <Box mb={2}>
      <Autocomplete
        fullWidth
        includeInputInList
        options={
          (
            inputValue &&
            debouncedInputValue === inputValue &&
            data &&
            data.arg === debouncedInputValue
          ) ?
            data.response
          : []
        }
        value={value}
        inputValue={inputValue || value?.label || ""}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder=""
          />
        )}
        onChange={(_e, newValue, _reason) => {
          setValue(newValue);
        }}
        filterOptions={(x) => x}
        onInputChange={(e, newValue) => {
          e && e.type === "change" && setInputValue(newValue);
          e && (e.type === "click" || e.type === "blur") && setInputValue("");
        }}
        noOptionsText={!inputValue ? "Start typing..." : "No results found"}
        loading={loading}
        loadingText={
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="end"
          >
            Loading... <CircularProgress size={18} />
          </Stack>
        }
        forcePopupIcon
        isOptionEqualToValue={(option, value) => option.value === value.value}
        clearOnBlur
        disabled={disabled}
      />
    </Box>
  );
};

export const NoRepoSelected = () => 
  <Container>
    <Grid container justifyContent="center">
      <Grid xs={12} sm={11} md={8} lg={7} xl={6} mt={4}>
        <Typography variant="h1">Select a repository first</Typography>
        <Typography>
          Please go to the <Link component={RouterLink} to="/">repository advisor</Link> and fill in the form to get recommendations.
        </Typography>
      </Grid>
    </Grid>
  </Container>

export const CurrentlySelected = ({repo}: {repo: string}) => 
  <Box sx={{ backgroundColor: "primary.dark"}}>
    <Container>
      <Grid container>
        <Grid>
          <Typography variant="caption" sx={{ color: "white" }}>
            Active repository: {repo}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  </Box>

export default RepoAdvisor;
