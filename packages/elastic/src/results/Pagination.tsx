import type { ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Pagination from '@mui/material/Pagination';
import type { ResultsPerPageViewProps, PagingInfoViewProps, PagingViewProps } from "@elastic/react-search-ui-views";

export function ResultsPerPage({ options, onChange, value }: ResultsPerPageViewProps ) {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 80, mb: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="results-per-page-label">Page size</InputLabel>
        <Select
          labelId="results-per-page-label"
          id="results-per-page-select"
          value={value}
          label="Page size"
          onChange={handleChange}
          size="small"
        >
          {options?.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export function PaginationInfo({ end, searchTerm, start, totalResults }: PagingInfoViewProps ) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography>
        {start} - {end} of {totalResults} results {searchTerm && `for "${searchTerm}"`}
      </Typography>
    </Box>
  );
};

export function PaginationAction({ current, resultsPerPage, onChange, totalPages }: PagingViewProps ) {
  const handleChange = (_event: ChangeEvent<unknown>, value: number) => {
    onChange(value);
  };
  return (
    <Pagination count={totalPages} shape="rounded" page={current} onChange={handleChange} />
  );
};
