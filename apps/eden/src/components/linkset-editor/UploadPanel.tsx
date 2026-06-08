import { Alert, Box, Paper, Stack, Typography } from "@mui/material";
import { ChangeEvent, DragEvent, useRef } from "react";

type UploadPanelProps = {
  onFileSelected: (file: File) => Promise<void> | void;
  uploadSuccessMessage: string;
  uploadError: string;
};

function UploadPanel({ onFileSelected, uploadSuccessMessage, uploadError }: UploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const onFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    await onFileSelected(file);
    event.target.value = "";
  };

  const onDropUpload = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) {
      return;
    }

    await onFileSelected(file);
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Typography variant="h6">Upload a FAIRiCat LinkSet JSON file</Typography>
        <Box
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={onDropUpload}
          sx={{
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: 1,
            p: 3,
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: "grey.50",
          }}
        >
          <Typography variant="body1">Drag and drop a .json file here, or click to browse.</Typography>
        </Box>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept=".json,application/json"
          onChange={onFileInputChange}
        />
        {uploadSuccessMessage && <Alert severity="success">{uploadSuccessMessage}</Alert>}
        {uploadError && <Alert severity="error">{uploadError}</Alert>}
      </Stack>
    </Paper>
  );
}

export default UploadPanel;
