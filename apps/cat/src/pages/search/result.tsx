import type { ResultBodyProps } from "@dans-framework/rdt-search-ui";
import parse from "html-react-parser";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";

const ToolTipItem = ({ title, value }: {title: string; value?: string;}) => (
  <Stack direction="row" spacing={1}>
    <Typography variant="body2" sx={{ width: '6.5rem', textAlign: 'right' }}>{title}</Typography>
    <Typography variant="body2">{value || '-'}</Typography>
  </Stack>
)

export const gupriMap = (unique?: string, resolvable?: string, persistent?: string) => {
  const sx = {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: 0,
  };
  return (
    <Tooltip title={
      <Box>
        <ToolTipItem title="Globally Unique:" value={unique} />
        <ToolTipItem title="Persistent:" value={persistent} />
        <ToolTipItem title="Resolvable:" value={resolvable} />
      </Box>
    }>
      <Stack direction="row" sx={{
        backgroundColor: '#f1f1f1',
        pl: 1,
        pr: 1,
        pt: 0,
        pb: 0,
        borderRadius: 1,
      }}>
        <Typography sx={sx} color={
          unique?.toLowerCase().includes('global') 
          ? 'success.main' 
          : 'neutral.dark'}>G</Typography>
        <Typography sx={sx} color={
          unique?.toLowerCase().includes('global') || unique?.toLowerCase().includes('namespace') 
          ? 'success.main' 
          : unique?.toLowerCase().includes('local') 
          ? 'warning.main' 
          : 'neutral.dark'
        }>U</Typography>
        <Typography sx={sx} color={
          persistent?.toLowerCase().includes('explicit') 
          ? 'success.main' 
          : persistent?.toLowerCase().includes('implicit') && !persistent?.toLowerCase().includes('no') 
          ? 'warning.main' 
          : 'neutral.dark'
        }>P</Typography>
        <Typography sx={sx} color={
          resolvable?.toLowerCase() === 'direct' 
          ? 'success.main' 
          : resolvable?.toLowerCase() === 'indirect'
          ? 'warning.main' 
          : 'neutral.dark'
        }>R</Typography>
        <Typography sx={sx}>i</Typography>
      </Stack>
    </Tooltip>
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
      {gupriMap(item.unique, item.resolvable, item.persistent)}
    </Stack>
  );
}