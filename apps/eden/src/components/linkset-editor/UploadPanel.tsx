import { Alert, Box, Paper, Stack, Typography } from "@mui/material";
import { ChangeEvent, DragEvent, useRef } from "react";

type UploadPanelProps = {
  onFileSelected: (file: File) => Promise<void> | void;
  uploadSuccessMessage: string;
  uploadError: string;
};

function UploadPanel({ onFileSelected, uploadSuccessMessage, uploadError }: UploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const helperTextId = "upload-dropzone-helper-text";

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

  const onDropzoneKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Typography variant="h6">Upload a FAIRiCat LinkSet JSON file</Typography>
        <Box
          role="button"
          tabIndex={0}
          aria-label="Upload FAIRiCat LinkSet JSON file"
          aria-describedby={helperTextId}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={onDropzoneKeyDown}
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
            outline: "none",
            "&:focus-visible": {
              borderColor: "primary.main",
              boxShadow: (theme) => `0 0 0 3px ${theme.palette.primary.main}33`,
            },
          }}
        >
          <Typography id={helperTextId} variant="body1">
            Drag and drop a .json file here, or press Enter/Space to browse.
          </Typography>
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
