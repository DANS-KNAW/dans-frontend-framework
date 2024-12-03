import { useContext } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
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
