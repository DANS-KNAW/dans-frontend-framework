import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import type { SortingViewProps } from "@elastic/react-search-ui-views";
import { useTranslation } from "react-i18next";

export default function Sorting({ options, onChange, value }: SortingViewProps) {
  const { t } = useTranslation('elastic');
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as string);
  };

  // Normalize the value
  const normalizedValue = value === "null|||null" || value === "|||" || !value ? "[]" : value;

  return (
    <Box sx={{ minWidth: 120, mb: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="sort-by-label">{t('sortBy')}</InputLabel>
        <Select
          labelId="sort-by-label"
          id="sort-by-select"
          value={normalizedValue}
          label={t('sortBy')}
          onChange={handleChange}
          size="small"
        >
          {options?.map((option) => (
            <MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}