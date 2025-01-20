import { useContext } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { FacetedSearchContext } from "../../../context/Provider";
import type { FixedFacetsProps } from "../../../context/props";
import { DropDown } from "../drop-down";

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

  const groupedFacets = Object.values(
    initialFixedFacets.reduce((acc, facet) => {
      // Initialize the group if it doesn't exist
      if (!acc[facet.group]) {
        acc[facet.group] = { group: facet.group, facets: [] };
      }
      // Push the current facet into the `facets` array of the group
      acc[facet.group].facets.push(facet);
      return acc;
    }, {} as Record<string, { group: string; facets: FixedFacetsProps[] }>)
  );

  const handleToggle = (facet: FixedFacetsProps) => {
    const updatedFacets = fixedFacets.some(existingFacet => existingFacet.value === facet.value) ? 
      fixedFacets.filter(f => !(f.value === facet.value))
      : [...fixedFacets, facet];
    setFixedFacets(updatedFacets);
  };

  return (
    <Stack direction="row" mb={2} spacing={1} alignItems="center">
      <Typography variant="h6">
        {t("selectSources")}
      </Typography>
      <DropDown label={t('select')}>
        {groupedFacets.map(({ group, facets }) => 
          <List key={group} dense subheader={<ListSubheader sx={{ lineHeight: 2, mt: 1 }}>{group}</ListSubheader>}>
            {facets.map(f =>
              <ListItem
                key={f.value}
                disablePadding
              >
                <ListItemButton role={undefined} onClick={() => handleToggle(f)} sx={{pb: 0, pt: 0}}>
                  <ListItemIcon sx={{ minWidth: '2rem' }}>
                    <Checkbox
                      edge="start"
                      checked={fixedFacets.some(existingFacet => existingFacet.value === f.value)}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={f.name} />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        )}
      </DropDown>
    </Stack>
  );
};