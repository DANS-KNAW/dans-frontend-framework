import type { ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Pagination from '@mui/material/Pagination';
import type { ResultsPerPageViewProps, PagingInfoViewProps, PagingViewProps } from "@elastic/react-search-ui-views";
import { useTranslation } from "react-i18next";

export function ResultsPerPage({ options, onChange, value }: ResultsPerPageViewProps ) {
  const { t } = useTranslation('elastic');
  const handleChange = (event: SelectChangeEvent) => {
    onChange(Number(event.target.value));
  };

  return (
    <Box sx={{ minWidth: 80, mb: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="results-per-page-label">{t('pageSize')}</InputLabel>
        <Select
          labelId="results-per-page-label"
          id="results-per-page-select"
          value={String(value)}
          label={t('pageSize')}
          onChange={handleChange}
          size="small"
        >
          {options?.map((option) => (
            <MenuItem key={option} value={String(option)}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export function PaginationInfo({ end, searchTerm, start, totalResults }: PagingInfoViewProps ) {
  const { t } = useTranslation('elastic');
  return (
    <Box sx={{ mb: 2 }}>
      <Typography>
        {t('resultsInfo', { start, end, totalResults, searchTerm })}
      </Typography>
    </Box>
  );
};

export function PaginationAction({ current, onChange, totalPages }: PagingViewProps ) {
  const handleChange = (_event: ChangeEvent<unknown>, value: number) => {
    onChange(value);
  };
  return (
    <Pagination count={totalPages} shape="rounded" page={current} onChange={handleChange} />
  );
};
