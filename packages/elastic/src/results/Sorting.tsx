import { useEffect } from "react";
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import type { SortingViewProps } from "@elastic/react-search-ui-views";
import { useTranslation } from "react-i18next";
import SouthIcon from '@mui/icons-material/South';
import IconButton from '@mui/material/IconButton';
import NorthIcon from '@mui/icons-material/North';

export default function Sorting({ options, onChange, value }: SortingViewProps) {
  const { t } = useTranslation('elastic');

  // Normalize the value
  const normalizedValue = value === "null|||null" || value === "|||" || !value ? "[]" : value;
  const currentSort = JSON.parse(normalizedValue);
  const currentDirection = currentSort[0]?.direction ?? "asc";
  const currentField = currentSort[0]?.field ?? null;

  // Deduplicate options by label — keep only first occurrence
  const uniqueOptions = options.filter((opt, idx, arr) =>
    arr.findIndex(o => o.label === opt.label) === idx
  );

  // Select first value on load for default sorting
  useEffect(() => {
    const parsedValue = [JSON.parse(options[0].value)[0]];
    onChange(JSON.stringify(parsedValue));
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as string);
  };

  const toggleDirection = () => {
    const newDirection = currentDirection === "asc" ? "desc" : "asc";
    // Find the matching option with the toggled direction
    const match = options.find(opt => {
      const parsed = JSON.parse(opt.value);
      return parsed[0]?.field === currentField && parsed[0]?.direction === newDirection;
    });
    if (match) onChange(match.value);
  };

  // Normalize the select value to match uniqueOptions (always asc variant for display)
  const selectValue = currentField
    ? options.find(opt => {
        const parsed = JSON.parse(opt.value);
        return parsed[0]?.field === currentField && parsed[0]?.direction === "asc";
      })?.value ?? normalizedValue
    : normalizedValue;

  return (
    <Stack sx={{ minWidth: 120, mb: 2 }} direction="row" alignItems="center" spacing={1}>
      <FormControl fullWidth>
        <InputLabel id="sort-by-label">{t('sortBy')}</InputLabel>
        <Select
          labelId="sort-by-label"
          id="sort-by-select"
          value={selectValue}
          label={t('sortBy')}
          onChange={handleChange}
          size="small"
        >
          {uniqueOptions.map((option) => (
            <MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {currentField &&
        <IconButton aria-label="sort direction" size="small" onClick={toggleDirection}>
          {currentDirection === "asc" ? <SouthIcon fontSize="small" /> : <NorthIcon fontSize="small" />}
        </IconButton>
      }
    </Stack>
  );
}