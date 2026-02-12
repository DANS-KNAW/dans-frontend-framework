import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import type { SearchResult } from "@elastic/search-ui";
import { useStoreHooks } from "@dans-framework/shared-store";
import { getResultViewConfig } from "../redux/slices";
import { formatESResult } from "../utils/esResultFormatter";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Result({
  result,
}: {
  result: SearchResult;
}) {
  const { t } = useTranslation('elastic');
  const { useAppSelector } = useStoreHooks();
  const resultViewConfig = useAppSelector(getResultViewConfig);
  const formattedResult = formatESResult(result, resultViewConfig);

  const description = 
    formattedResult.description && formattedResult.description.length > 200 
    ? `${formattedResult.description.substring(0, 200)}...` 
    : formattedResult.description;

  return (
    <Paper sx={{ p: 2, mb: 2, width: '100%' }}>
      <Typography variant="h6">
        {formattedResult.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {formattedResult.subTitle}
      </Typography>
      <Typography sx={{ mb: 2 }}>
        {description}
      </Typography>
      <Box sx={{
        display: "grid",
        gridTemplateColumns: "1fr 4fr",
        mb: 2,
      }}>
        {formattedResult.listItems?.map((item) => {
          const value = Array.isArray(item.value) ? item.value.join(" || ") : item.value.length < 1 ? "-" : item.value;
          return (
            <>
              <Typography variant="body2" color="neutral.dark" pr={1} gutterBottom>
                {item.label}
              </Typography>
              <Typography variant="body2">
                {value}
              </Typography>
            </>
          )
        })}
      </Box>
      <Button color="primary" component={Link} to={`/${resultViewConfig.linkToSlug}/${encodeURIComponent(result[ resultViewConfig.linkToId ].raw)}`}>
        {t('viewDetails')}
      </Button>
    </Paper>
  );
};
