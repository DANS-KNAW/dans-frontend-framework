import Checkbox from "@mui/material/Checkbox";
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
import FilterFacet from "../ui-components/FilterFacet";
import type { FilterType } from "@elastic/search-ui";
import { useTranslation } from "react-i18next";

interface ListFacetProps extends FacetViewProps {
  setFilterType: (type: FilterType) => void;
  customFilterType: FilterType;
  defaultShow: number;
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
  defaultShow,
}: ListFacetProps) {
  const { t } = useTranslation('elastic');
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedOptions, setExpandedOptions] = useState(false);

  // sort options to have selected ones on top
  const sortedOptions = [...options].sort((a, b) => {
    if (a.selected === b.selected) {
      return 0;
    }
    return a.selected ? -1 : 1;
  });

  const displayedOptions = expandedOptions ? sortedOptions : sortedOptions.slice(0, defaultShow);

  useEffect(() => {
    onSearch(searchTerm);
  }, [searchTerm]);

  return (
    <>
      <FilterFacet
        customFilterType={customFilterType}
        setFilterType={setFilterType}
        showSearch={showSearch}
        options={options}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
      />

      { options.length === 0 && (
        <Typography variant="body2" color="textSecondary" sx={{ my: 2, textAlign: 'center' }}>
          No options found
        </Typography>
      ) }

      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {displayedOptions.map((option, index) => {
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
      <Stack direction="row" justifyContent="space-between">
        {
          expandedOptions && (
            <Button size="small" onClick={() => setExpandedOptions(false)}>
              {t('showLess')}
            </Button>
          )
        }
        {(showMore || displayedOptions.length < options.length) && (
          <Button 
            size="small" 
            onClick={() => { 
              if (options.length > defaultShow && !expandedOptions) {
                // Have loaded items but collapsed: just expand
                setExpandedOptions(true);
              } else if (showMore) {
                // Either initial load or already expanded: fetch more
                onMoreClick();
                setExpandedOptions(true);
              }
            }}
          >
            {t('showMore')}
          </Button>
        )}
      </Stack>
    </>
  );
};
