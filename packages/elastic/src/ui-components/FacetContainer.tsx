import { useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Facet } from "@elastic/react-search-ui";
import { lookupLanguageString } from "@dans-framework/utils";
import { useTranslation } from "react-i18next";
import { FACET_VIEW_MAP } from "../utils/facetMap";

interface FacetContainerProps {
  field: string;
  config: any;
}

export default function FacetContainer({
  field,
  config,
  fullWidth,
}: FacetContainerProps) {
  const { i18n } = useTranslation();
  const largeWidth = fullWidth ? 12 : config.width === "large" ? 9 : config.width === "medium" ? 4.5 : 3;
  const mediumWidth = fullWidth ? 12 : config.width === "large" ? 8 : config.width === "medium" ? 8 : 4;

  // filtertype...todo this is no good
  const [ filterType, setFilterType ] = useState(config.filterType || "any");

  return (
    <Grid size={{ xs: fullWidth ? 12 : 6, md: mediumWidth, lg: largeWidth }}>
      <Paper elevation={1} sx={{ p: 2, mb: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          {lookupLanguageString(config.label, i18n.language)}
        </Typography>
        <Box>
          <Facet
            key={field}
            field={field}
            label={lookupLanguageString(config.label, i18n.language)}
            view={FACET_VIEW_MAP[config.display]}
            isFilterable={config.display === "list"}
            show={config.display === "list" ? 10 : 20}
            filterType={filterType}
            customFilterType={filterType}
            setFilterType={setFilterType}
          />
        </Box>
      </Paper>
    </Grid>
  );
};
