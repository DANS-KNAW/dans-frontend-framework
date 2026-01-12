import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import type { SearchResult } from "@elastic/search-ui";

export default function Result({
  result,
  onClickLink
}: {
  result: SearchResult,
  onClickLink: () => void
}) {
  return (
    <Paper sx={{ p: 2, mb: 2, width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {result.title.raw}
      </Typography>
      <Button color="primary" onClick={onClickLink}>
        View Details
      </Button>
    </Paper>
  );
};
