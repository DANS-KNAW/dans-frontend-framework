import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { type FacetViewProps } from "@elastic/react-search-ui-views";
import { useState, useEffect } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export default function ListFacet({
  onMoreClick,
  showMore,
  onRemove,
  onSelect,
  options,
  showSearch,
  onSearch,
}: FacetViewProps) {

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    onSearch(searchTerm);
  }, [searchTerm]);

  return (
    <>
      {showSearch && 
        <TextField
          size="small"
          placeholder={`Filter...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
      }

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
                    ? onRemove(option.value)
                    : onSelect(option.value)
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
                  primary={option.value} 
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
