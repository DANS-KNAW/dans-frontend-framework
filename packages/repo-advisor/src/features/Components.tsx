import { useState } from "react";
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useDebounce } from "use-debounce";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useFetchRorByNameQuery, useFetchDatastationsTermQuery, type OptionsType, type QueryReturnType } from "@dans-framework/deposit";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getRor, getNarcis, setRor, setNarcis } from "./repoAdvisorSlice";
import type { AutocompleteProps } from "../types";

type Option = {
  value: string;
  label: string;
};

export const SelectField = ({label, value, onChange, options, disabled}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  disabled?: boolean;
}) => 
  <Box mb={2}>
    <FormControl fullWidth disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value || ''}
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
  const { t } = useTranslation("steps");
  const dispatch = useAppDispatch();
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedInputValue = useDebounce(inputValue, 500)[0];
  // Fetch data on input change
  const { data, isFetching, isLoading } =
    useFetchRorByNameQuery<QueryReturnType>(debouncedInputValue, {
      skip: debouncedInputValue === "",
    });
  const value = useAppSelector(getRor);

  return (
    <ApiField
      inputValue={inputValue}
      setInputValue={setInputValue}
      debouncedInputValue={debouncedInputValue}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      label={t("ror")}
      setValue={(v) => dispatch(setRor(v))}
      value={value}
    />
  );
};

export const NarcisField = () => {
  const { t, i18n } = useTranslation("steps");
  const dispatch = useAppDispatch();
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
  const value = useAppSelector(getNarcis);

  return (
    <ApiField
      inputValue={inputValue}
      setInputValue={setInputValue}
      debouncedInputValue={debouncedInputValue}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      label={t("narcis")}
      setValue={(v) => dispatch(setNarcis(v))}
      value={value}
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
  setValue,
  value,
  disabled,
}: AutocompleteProps ) => {
  const { t } = useTranslation("steps");

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
        value={value || null}
        inputValue={inputValue || value?.label as string || ""}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder=""
          />
        )}
        onChange={(_e, newValue, _reason) => setValue(newValue as OptionsType)}
        filterOptions={(x) => x}
        onInputChange={(e, newValue) => {
          e && e.type === "change" && setInputValue(newValue);
          e && (e.type === "click" || e.type === "blur") && setInputValue("");
        }}
        noOptionsText={!inputValue ? t("startTyping") : t("noResults")}
        loading={isLoading || isFetching || inputValue !== debouncedInputValue}
        loadingText={
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="end"
          >
            {t("isLoading")} <CircularProgress size={18} />
          </Stack>
        }
        forcePopupIcon
        // isOptionEqualToValue={(option, value) => option.value === value.value}
        clearOnBlur
        disabled={disabled}
      />
    </Box>
  );
};
