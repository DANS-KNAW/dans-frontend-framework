import type { ResultBodyProps } from "@dans-framework/rdt-search-ui";
import parse from "html-react-parser";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

const gupriMap = (coverage?: string, unique?: boolean, resolvable?: string, persistent?: string) => {
  const sx = {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: 0,
  };
  return (
    <Stack direction="row" sx={{
      backgroundColor: '#f1f1f1',
      padding: 1,
      borderRadius: 1,
    }}>
      <Typography sx={sx} color={coverage === 'Global' ? 'success.main' : coverage !== null ? 'error.main' : 'primary.gray'}>G</Typography>
      <Typography sx={sx} color={unique ? 'success.main' : unique !== null ? 'error.main' : 'primary.gray'}>U</Typography>
      <Typography sx={sx} color={persistent?.indexOf('Yes') !== -1 ? 'success.main' : persistent !== null ? 'error.main' : 'primary.gray'}>P</Typography>
      <Typography sx={sx} color={resolvable?.indexOf('Direct') !== -1 ? 'success.main' : persistent !== null ? 'warning.main' : 'primary.gray'}>R</Typography>
      <Typography sx={sx}>i</Typography>
    </Stack>
  )
}

/* Custom component for search results */
export function SingleResult(props: ResultBodyProps) {
  const { result: item } = props;
  const title = item.identifier || "<i>Untitled</i>";
  const description = item.description || "No description found";

  return (
    <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="flex-start">
      <Box>
        <Typography variant="h5">{parse(title)}</Typography>
        <Typography>{parse(description)}</Typography>
      </Box>
      {gupriMap(item.coverage, item.unique, item.resolvable, item.persistent)}
    </Stack>
  );
}