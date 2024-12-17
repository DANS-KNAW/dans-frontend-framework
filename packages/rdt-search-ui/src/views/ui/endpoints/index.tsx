import { useContext, useMemo } from "react";
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

export const FixedFacetSelector = ({initialFixedFacets}) => {
  const { t } = useTranslation("views");
  const { fixedFacets, setFixedFacets } = useContext(FacetedSearchContext);

  // Filter the facets to exclude 'keyword' type when all are "active"
  const allActiveFacets = useMemo(
    () => initialFixedFacets.filter((facet) => facet.type !== "keyword"),
    []
  );

  // console.log(initialFixedFacets)
  // console.log(fixedFacets)

  // Compute active facets based on current fixedFacets
  const activeFacets = fixedFacets.length === 0 ? allActiveFacets : fixedFacets;

  // Group the facets by group key
  const groupedFacets = useMemo(() => {
    const groups = {};
    initialFixedFacets.forEach((facet) => {
      groups[facet.group] = groups[facet.group] || [];
      groups[facet.group].push(facet);
    });
    return groups;
  }, []);

  const handleToggle = (event, newValues) => {
    // Update fixedFacets to represent the currently active buttons
    setFixedFacets(
      newValues.length === 0 || newValues.length === allActiveFacets.length
        ? [] // All active if no selection or all non-keyword selected
        : initialFixedFacets.filter((facet) => newValues.includes(facet.value))
    );
  };

  return (
    <Box mb={2}>
      <Typography variant="h6">
        {t("selectSources")}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={3}>
      {Object.entries(groupedFacets).map(([groupName, facets]) => (
        <Box key={groupName}>
          <Typography variant="body2">{groupName}</Typography>
          <ToggleButtonGroup
            value={activeFacets.map((facet) => facet.value)} // Active values
            onChange={handleToggle}  
          >
            {facets.map(({ name, value }) => (
              <ToggleButton key={value} value={value} size="small" sx={{ fontSize: 10, }}>
                {name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      ))}
      </Stack>
    </Box>
  );
};