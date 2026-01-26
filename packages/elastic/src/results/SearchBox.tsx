import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import type { SearchBoxViewProps } from "@elastic/react-search-ui-views";
import type { AutocompleteResult } from "@elastic/search-ui";

interface ResultOption {
  type: "Results" | "Suggestions";
  label: string;
  value: any;
}

export default function SearchBox({
  autocompleteResults,
  autocompletedSuggestions,
  onChange,
  onSelectAutocomplete,
  onSubmit,
  value,
  useAutocomplete,
  inputProps,
  ...props
}: SearchBoxViewProps) {
  const [localValue, setLocalValue] = React.useState(value);
  console.log(props)

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const options = React.useMemo(() => {
    if (!useAutocomplete) return [];
    const results: ResultOption[] = (Array.isArray(autocompleteResults) ? autocompleteResults.map(result => ({
      type: "Results" ,
      label: result[(autocompleteResults as AutocompleteResult)?.titleField]?.snippet?.[0] 
        ?? result[(autocompleteResults as AutocompleteResult)?.titleField]?.raw,
      value: result,
    })) : []);
    // const suggestions: ResultOption[] = autocompletedSuggestions?.suggestions?.map(suggestion => ({
    //   type: "Suggestions",
    //   label: suggestion[autocompletedSuggestions?.titleField]?.snippet?.[0]
    //     ?? suggestion[autocompletedSuggestions?.titleField]?.raw,
    //   value: suggestion,
    // })) ?? [];

    const suggestions: [] = [];
    
    return [...suggestions, ...results];
  }, [autocompleteResults, autocompletedSuggestions, useAutocomplete]);

  const debouncedOnChange = React.useMemo(() => {
    let timeout: number | undefined;
    return (nextValue: string) => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        onChange(nextValue);
      }, 150);
    };
  }, [onChange]);

  return (
    <Box 
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
      sx={{ minWidth: 250, mb: 2 }}
    >
      <Autocomplete
        freeSolo
        groupBy={(option) => option.type}
        filterOptions={(x) => x}
        options={options}
        inputValue={localValue}
        onInputChange={(_, newValue, reason) => {
          if (reason == "clear") {
            setLocalValue("");
            debouncedOnChange("");
            return;
          };
          setLocalValue(newValue);
          debouncedOnChange(newValue);
        }}
        onChange={(_, newValue) => {
          const val =
            typeof newValue === "string"
              ? newValue
              : // @ts-expect-error
                newValue?.suggestion || newValue?.value || "";
          onSelectAutocomplete(val);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            {...inputProps}
            size="small"
            label="Search terms"
          />
        )}
      />
    </Box>
  );
}
