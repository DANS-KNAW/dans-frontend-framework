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
import { useFetchRorByNameQuery, useFetchDatastationsTermQuery } from "@dans-framework/deposit";
import { useTranslation } from "react-i18next";

type Option = {
  value: string;
  label: string;
};

export const SelectField = ({label, value, onChange, options, disabled}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  options: Option[];
  disabled?: boolean;
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
export const RorField = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedInputValue = useDebounce(inputValue, 500)[0];
  // Fetch data on input change
  const { data, isFetching, isLoading } =
    useFetchRorByNameQuery<QueryReturnType>(debouncedInputValue, {
      skip: debouncedInputValue === "",
    });

  return (
    <ApiField
      inputValue={inputValue}
      setInputValue={setInputValue}
      debouncedInputValue={debouncedInputValue}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
};

export const NarcisField = () => {
  const { i18n } = useTranslation();
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedInputValue = useDebounce(inputValue, 500)[0];
  // Fetch data on input change
  const { data, isFetching, isLoading } =
    useFetchDatastationsTermQuery<QueryReturnType>(
      {
        vocabulary: "narcis",
        lang: i18n.language,
        query: debouncedInputValue,
      },
      { skip: debouncedInputValue === "" },
    );

  return (
    <ApiField
      inputValue={inputValue}
      setInputValue={setInputValue}
      debouncedInputValue={debouncedInputValue}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
};

const ApiField = ({
  inputValue,
  setInputValue,
  debouncedInputValue,
  data,
  isLoading,
  isFetching,
  label, 
  disabled
}: {
  inputValue: any;
  setInputValue: any;
  debouncedInputValue: any;
  data: any;
  isLoading: boolean;
  isFetching: boolean;
  label: string;
  disabled?: boolean;
}) => {
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
        value={debouncedInputValue}
        inputValue={inputValue || debouncedInputValue?.label || ""}
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
        loading={isLoading}
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