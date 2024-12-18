import { useContext } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { FacetedSearchContext } from "../../../context/Provider";
import type { FixedFacetsProps } from "../../../context/props";

export const EndpointSelector = () => {
  const { t } = useTranslation("views");
  const { config, endpoint, setEndpoint } = useContext(FacetedSearchContext);

  const handleSelect = (e: SelectChangeEvent) => {
    setEndpoint(e.target.value);
  };

  return (
    <Stack direction="row" justifyContent="flex-end" alignItems="center" mb={2}>
      <Typography variant="h6" sx={{ mr: 2, mb: 0 }}>
        {t("selectDataset")}
      </Typography>
      <FormControl sx={{ width: "20rem" }}>
        <InputLabel id="dataset-select-label">{t("dataset")}</InputLabel>
        <Select
          labelId="dataset-select-label"
          id="dataset-select"
          value={endpoint}
          label={t("dataset")}
          onChange={handleSelect}
        >
          {config.map((endpoint) => (
            <MenuItem key={endpoint.url} value={endpoint.url}>
              {endpoint.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};

export const FixedFacetSelector = ({initialFixedFacets}: {initialFixedFacets: FixedFacetsProps[]}) => {
  const { t } = useTranslation("views");
  const { fixedFacets, setFixedFacets } = useContext(FacetedSearchContext);

  const buttonColors: Record<FixedFacetsProps['group'], 'warning' | 'secondary' | 'info'> = {
    DANS: 'secondary',
    External: 'info',
    Subject: 'warning',
  };

  // console.log(initialFixedFacets)
  // console.log(fixedFacets)

  const handleToggle = (_event: any, newValues: string[]) => {
    // Update fixedFacets to represent the currently active buttons
    setFixedFacets(
      newValues.length === 0
        ? initialFixedFacets.filter(facet => facet.defaultEnabled) // Reset to all facets if no selection
        : initialFixedFacets.filter(facet => newValues.includes(facet.value))
    );
  };

  return (
    <Box mb={2}>
      <Typography variant="h6">
        {t("selectSources")}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={3}>
        <ToggleButtonGroup
          value={fixedFacets.map((facet) => facet.value)} // Active values
          onChange={handleToggle}  
        >
          {initialFixedFacets.map(({ name, value, group }) => (
            <ToggleButton 
              key={value} 
              value={value} 
              size="small" 
              sx={{
                fontSize: 10,
                color: theme => theme.palette[buttonColors[group]].contrastText,
                backgroundColor: theme => theme.palette[buttonColors[group]].main,
                opacity: 0.5,
                '&:hover': {
                  backgroundColor: theme => theme.palette[buttonColors[group]].dark, // Darker on hover
                },
                '&.Mui-selected': {
                  backgroundColor: theme => theme.palette[buttonColors[group]].main,
                  color: theme => theme.palette[buttonColors[group]].contrastText,
                  opacity: 1,
                  '&:hover': {
                    backgroundColor: theme => theme.palette[buttonColors[group]].dark, // Darker on hover
                  },
                }
              }}
            >
              {name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
    </Box>
  );
};