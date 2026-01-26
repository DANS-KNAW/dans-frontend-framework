import { type ComponentType } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Facet, useSearch } from "@elastic/react-search-ui";
import { lookupLanguageString } from "@dans-framework/utils";
import { useTranslation } from "react-i18next";
import { FACET_VIEW_MAP, type FacetDisplayType } from "../utils/facetMap";
import LinearProgress from '@mui/material/LinearProgress';

interface FacetContainerProps {
  field: string;
  config: any;
  fullWidth?: boolean;
}

export default function FacetContainer({
  field,
  config,
  fullWidth,
}: FacetContainerProps) {
  const { filters, setFilter, removeFilter, isLoading, facets } = useSearch();
  const { i18n } = useTranslation();
  const largeWidth = fullWidth ? 12 : config.width === "large" ? 9 : config.width === "medium" ? 4.5 : 3;
  const mediumWidth = fullWidth ? 12 : config.width === "large" ? 8 : config.width === "medium" ? 8 : 4;
  
  const facetData = facets?.[field]?.[0]?.data;
  const hasOptions = facetData && facetData.length > 0;

  // Get current filter values for this field
  const currentFilter = filters?.find(f => f.field === field);

  const clearFilter = () => {
    removeFilter(field);
  }

  const handleFilterTypeChange = (newFilterType: string) => {    
    if (currentFilter && currentFilter.values.length > 0) {
      // Store the current selected values
      const selectedValues = currentFilter.values;
      
      // Remove the old filter
      removeFilter(field);
      
      // Re-apply with new filter type
      setFilter(field, selectedValues as any, newFilterType as any);
      // selectedValues.forEach(value => {
      //   setFilter(field, value as any, newFilterType as any);
      // });
    }
  };

  return (
    <Grid size={{ xs: fullWidth ? 12 : 6, md: mediumWidth, lg: largeWidth }}>
      <Paper elevation={1} sx={{ p: 2, mb: 2, height: '100%', position: 'relative' }}>
        <Typography variant="h6" gutterBottom>
          {lookupLanguageString(config.label, i18n.language)}
        </Typography>
        <Box>
          <Facet
            key={field}
            field={field}
            label={lookupLanguageString(config.label, i18n.language) || ''}
            view={FACET_VIEW_MAP[config.display as FacetDisplayType] as ComponentType<any>}
            isFilterable={config.display === "list"}
            show={config.display === "list" ? 10 : 20}
            filterType={currentFilter?.type || config.filterType || "any"}
            {...(config.display === "list"
              ? { 
                  customFilterType: currentFilter?.type || config.filterType || "any", 
                  setFilterType: handleFilterTypeChange 
                }
              : {})}
          />
          {!hasOptions && !isLoading &&
            <Typography variant="body2" color="textSecondary" sx={{ my: 2 }}>
              No options found for current selection
            </Typography>
          }
        </Box>
        {currentFilter && currentFilter.values.length > 0 && (
          <Box sx={{ textAlign: 'right' }}>
            <Button onClick={clearFilter}>
              Clear filter
            </Button>
          </Box>
        )}
        {isLoading && 
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 }}>
            <LinearProgress />
          </Box>
        }
      </Paper>
    </Grid>
  );
}