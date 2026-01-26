import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { type FacetViewProps } from "@elastic/react-search-ui-views";
import { useState, useEffect } from "react";
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

interface ListFacetProps extends FacetViewProps {
  setFilterType: (type: string) => void;
  customFilterType: string;
}

export default function ListFacet({
  onMoreClick,
  showMore,
  onRemove,
  onSelect,
  options,
  showSearch,
  onSearch,
  setFilterType,
  customFilterType,
}: ListFacetProps) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    onSearch(searchTerm);
  }, [searchTerm]);

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        {((showSearch && options.length > 6) || searchTerm) &&
          <TextField
            size="small"
            placeholder={`Filter...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

      { options.length === 0 && (
        <Typography variant="body2" color="textSecondary" sx={{ my: 2, textAlign: 'center' }}>
          No options found
        </Typography>
      ) }

      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {options.map((option, index) => {
          const labelId = `checkbox-list-label-${option.value}`;

          return (
            <ListItem
              key={`${option.value}-${index}`}
              secondaryAction={
                <Typography variant="body2" color="textSecondary" sx={{ mr: 0.5 }}>{option.count}</Typography>
              }
              disablePadding
              disableGutters
            >
              <ListItemButton 
                role={undefined} 
                onClick={() => {
                  option.selected
                    ? onRemove(option.value as any)
                    : onSelect(option.value as any)
                }} 
                dense
              >
                <ListItemIcon sx={{ minWidth: '1.2rem' }}>
                  <Checkbox
                    edge="start"
                    checked={option.selected}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                    size="small"
                    sx={{ p: 0, }}
                  />
                </ListItemIcon>
                <ListItemText 
                  id={labelId} 
                  primary={String(option.value)} 
                  sx={{ m: 0 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {showMore && (
        <Button size="small" onClick={onMoreClick}>
          Show more
        </Button>
      )}
    </>
  );
};
