import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
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
import type { AutocompleteAPIFieldData } from "@dans-framework/deposit";

const RepoAdvisor = ({setRepoConfig}: {setRepoConfig: Dispatch<SetStateAction<any>>}) => {
  const [recommendations, setRecommendations] = useState<any>([]);
  const [ror, setRor] = useState(null);
  const [narcis, setNarcis] = useState(null);
  const [depositType, setDepositType] = useState('');
  const [fileType, setFileType] = useState('');

  const fetchRecommendations = () => {
    // fetch the recommendations list
    const result = ['something', 'other'];

    // set state accordingly
    setRecommendations(result);
  }

  const resetRecommendations = () => {
    setRecommendations([]);
  }

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
            {depositType === 'dataset' &&
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
            }
            <Box>
              <Button variant="contained" size="large" onClick={fetchRecommendations} disabled={recommendations.length > 0}>
                Get recommendations
              </Button>
            </Box>
          </Paper>
          {recommendations.length > 0 && 
            <Paper sx={{p: 4, mt: 1}}>
              <Typography variant="h5" mb={4}>
                Recommended repositories
              </Typography>
              {recommendations.map( rec =>
                <Box mb={2}>
                  <Button key={rec} variant="contained" size="large" onClick={() => setRepoConfig(rec)}>
                    Repo 1
                  </Button>
                </Box>
              )}
              <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                <Button size="large" variant="contained" onClick={resetRecommendations} color="warning">
                  Reset recommendations
                </Button>
              </Box>
            </Paper>
          }
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

// Basic API fetching function, based on the API calls in the Deposit package
const fetchData = async (
  type: string, 
  setData: (option: AutocompleteAPIFieldData) => void, 
  debouncedInputValue: string, 
  setLoading: (b: boolean) => void
) => {
  const uri = 
    type === 'ror' ?
    `https://api.ror.org/organizations?query.advanced=name:${debouncedInputValue}*` :
    type === 'narcis' ?
    `https://vocabs.datastations.nl/rest/v1/NARCIS/search?query=${debouncedInputValue}*&unique=true&lang=en` :
    '';
  try {
    const result = await fetch(uri, {
      headers: { Accept: "application/json" }
    });
    const json = await result.json();
    const transformResult = 
      type === 'ror' ?
        (json.number_of_results > 0 ? 
          {
            arg: debouncedInputValue,
            response: json.items.map((item: any) => ({
              label: item.name,
              value: item.id,
              extraLabel: "country",
              extraContent: item.country.country_name,
            }))
          } : 
          []
        ) :
      type === 'narcis' ?
        (json.results.length > 0 ? 
          {
            arg: debouncedInputValue,
            response: json.results.map((item: any) => ({
              label: item.prefLabel,
              value: item.uri,
              id: item.localname,
            })).filter(Boolean),
          } :
          []
        ) :
      [];
    setData(transformResult as AutocompleteAPIFieldData);
  } catch (error) {
    console.error(error);
  }
  setLoading(false);
}

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
  const [loading, setLoading] = useState(false);
  const debouncedInputValue = useDebounce(inputValue, 500)[0];
  
  useEffect( () => {
    debouncedInputValue && fetchData(
      type, 
      setData, 
      debouncedInputValue,
      setLoading
    ); 
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

export default RepoAdvisor;
