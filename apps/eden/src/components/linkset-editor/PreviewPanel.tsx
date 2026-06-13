import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ExchangeableLinkSet } from "./types";

type PreviewPanelProps = {
  preview: ExchangeableLinkSet;
  onDownload: () => void;
};

function PreviewPanel({ preview, onDownload }: PreviewPanelProps) {
  const { t } = useTranslation('linkset-editor');
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{t('previewPanel.heading')}</Typography>
          <Button variant="outlined" onClick={onDownload}>
            {t('previewPanel.downloadButton')}
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
