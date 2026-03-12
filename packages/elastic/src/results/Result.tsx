import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import type { SearchResult } from "@elastic/search-ui";
import { useStoreHooks } from "@dans-framework/shared-store";
import { getResultViewConfig } from "../redux/slices";
import { formatESResult } from "../utils/esResultFormatter";
import { Link as RouterLink } from "react-router-dom";
import Chip from "@mui/material/Chip";

export default function Result({
  result,
}: {
  result: SearchResult;
}) {
  const { useAppSelector } = useStoreHooks();
  const resultViewConfig = useAppSelector(getResultViewConfig);
  const formattedResult = formatESResult(result, resultViewConfig);
  
  console.log(result)
  
  const description = 
    formattedResult.description && formattedResult.description.length > 200 
    ? `${formattedResult.description.substring(0, 200)}...` 
    : formattedResult.description;

  return (
    <Box sx={{ mb: 2, pb: 2, width: '100%', overflow: 'hidden', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <Link 
        variant="h4" 
        component={RouterLink} 
        sx={{ 
          textDecoration: 'none',
          "&:hover": { textDecoration: 'underline' },
          display: 'block',
          mb: 1,
        }}
        to={`/${resultViewConfig.linkToSlug}/${encodeURIComponent(result[ resultViewConfig.linkToId ].raw)}`}
      >
        {formattedResult.title}
      </Link>
      {formattedResult.tags && 
        <Stack direction="row" spacing={1} mb={1}>
          {formattedResult.tags.map(tag =>
            <Chip key={tag} label={tag} size="small" />
          )}
        </Stack>
      }
      {description && (
        <Typography>
          {description}
        </Typography>
      )}
    </Box>
  );
};
