import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import type { FilterType } from "@elastic/search-ui";

export default function FilterFacet({
  customFilterType,
  setFilterType,
  showSearch,
  options,
  setSearchTerm,
  searchTerm,
}: {
  customFilterType: FilterType;
  setFilterType: (value: FilterType) => void;
  showSearch?: boolean;
  options?: any[];
  setSearchTerm?: (value: string) => void;
  searchTerm?: string;
}) {
  return (
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
      {((showSearch && options && options.length > 6) || searchTerm) &&
        <TextField
          size="small"
          placeholder={`Filter...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
          fullWidth
        />
      }
      <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
        <InputLabel id="filter-type-label">Match</InputLabel>
        <Select
          labelId="filter-type-label"
          id="filter-type-select"
          value={customFilterType}
          onChange={(e) => setFilterType(e.target.value)}
          label="Must match"
        >
          <MenuItem value="any">Any</MenuItem>
          <MenuItem value="all">All</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  )
}