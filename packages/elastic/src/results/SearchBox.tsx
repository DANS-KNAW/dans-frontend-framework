import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import type { FormEvent } from "react";

import type { SearchBoxViewProps } from "@elastic/react-search-ui-views";

export default function SearchBox({
  autocompleteResults,
  autocompletedResults = [],
  autocompletedSuggestions = [],
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
    const results = autocompletedResults?.map(result => ({
      type: "Results" ,
      label: result[autocompleteResults.titleField]?.snippet?.[0] 
        ?? result[autocompleteResults.titleField]?.raw,
      value: result,
    })) ?? [];
    const suggestions = autocompletedSuggestions?.suggestions?.map(result => ({
      type: "Suggestions",
      label: result[autocompleteResults.titleField]?.snippet?.[0]
        ?? result[autocompleteResults.titleField]?.raw,
      value: result,
    })) ?? [];
    
    console.log(suggestions);

    return [...suggestions, ...results];
  }, [autocompletedResults, autocompletedSuggestions, useAutocomplete]);

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
