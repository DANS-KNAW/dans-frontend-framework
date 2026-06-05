import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { ExchangeableLinkSet } from "./types";

type PreviewPanelProps = {
  preview: ExchangeableLinkSet;
  onDownload: () => void;
};

function PreviewPanel({ preview, onDownload }: PreviewPanelProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Linkset preview; Exchangeable as FAIRiCat Linkset JSON</Typography>
          <Button variant="outlined" onClick={onDownload}>
            Download Linkset JSON
          </Button>
        </Stack>
        <Box
          component="pre"
          sx={{
            m: 0,
            p: 1.5,
            borderRadius: 1,
            backgroundColor: "grey.100",
            overflowX: "auto",
            fontSize: 13,
          }}
        >
          {JSON.stringify(preview, null, 2)}
        </Box>
      </Stack>
    </Paper>
  );
}

export default PreviewPanel;
