import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import Link from "@mui/material/Link";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CloseIcon from "@mui/icons-material/Close";
import Collapse from "@mui/material/Collapse";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import IconButton from "@mui/material/IconButton";
import { useTranslation, Trans } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getFiles, addFiles } from "./filesSlice";
import type {
  SelectedFile,
  FileLocation,
  RejectedFiles,
  DansSimpleListQueryResponse,
} from "../../types/Files";
import { v4 as uuidv4 } from "uuid";
import { useFetchSimpleListQuery } from "./api/dansFormats";
import { enqueueSnackbar } from "notistack";
import { getFormDisabled, getData } from "../../deposit/depositSlice";
import { getSessionId } from "../metadata/metadataSlice";

const FilesUpload = () => {
  const dispatch = useAppDispatch();
  const currentFiles = useAppSelector(getFiles);
  const { t } = useTranslation("files");
  const { data } = useFetchSimpleListQuery<DansSimpleListQueryResponse>(null);
  const formConfig = useAppSelector(getData);

  // Validate added files, needs to be synchronous, so no API calls possible here
  const fileValidator = (file: File) => {
    if (!file.name) return null;

    const forbiddenCharacters = /[\/:*?"<>|;#]/;
    if (forbiddenCharacters.test(file.name)) {
      return {
        code: "file-invalid",
        message: t("fileForbiddenCharacters"),
      };
    }

    // No files over the file size limit set in formConfig
    if (formConfig?.filesUpload?.maxSize && file.size > formConfig?.filesUpload?.maxSize) {
      return {
        code: "file-too-large",
        message: t("fileTooLarge", { size: (formConfig?.filesUpload?.maxSize / 1073741824).toFixed(2) }),
      };
    }

    if (!file.size || file.size === 0) {
      return {
        code: "file-invalid",
        message: t("fileNoSize"),
      };
    }

    // No duplicate files
    const extensionIndex = file.name.lastIndexOf(".");
    const baseName = file.name.slice(0, extensionIndex);
    const extension = file.name.slice(extensionIndex);
    if (
      currentFiles.find((f) => {
        const extensionIndexCurrent = f.name.lastIndexOf(".");
        const baseNameCurrent = f.name.slice(0, extensionIndexCurrent);
        const extensionCurrent = f.name.slice(extensionIndexCurrent);
        return (
          baseNameCurrent.indexOf(baseName) !== -1 &&
          extension === extensionCurrent &&
          f.size === file.size
        );
      })
    ) {
      return {
        code: "file-exists",
        message: t("fileAlreadyAdded", { file: file.name }),
      };
    }

    // No files with these file names
    if (
      file.name.indexOf("__generated__form-metadata") !== -1
      // oh smart specific. todo: move this all to form config.
      || file.name.toLowerCase() === "oral history metadata private.txt"
      || file.name.toLowerCase() === "oral history metadata public.txt"
    ) {
      return {
        code: "file-not-allowed",
        message: t("fileNotAllowed"),
      };
    }

    return null;
  };

  const onDrop = async (acceptedFiles: File[]) => {
    // Check if a file with the same name has been added; if so, rename to (1), (2), etc
    // Transform the file to a file blob URL so we can save it to the Redux store
    const serializedFiles = acceptedFiles.map((file) => {
      const fileExists = currentFiles.find((f) => f.name === file.name);
      // Logic to rename files to the next sequential number
      let updatedFile = file.name;
      if (fileExists) {
        let sequentialNumber = 0;
        const fileExistsWithUpdatedName = (f: SelectedFile) =>
          f.name === updatedFile;
        while (currentFiles.find(fileExistsWithUpdatedName)) {
          sequentialNumber++;
          const extensionIndex = file.name.lastIndexOf(".");
          const baseName = file.name.slice(0, extensionIndex);
          const extension = file.name.slice(extensionIndex);
          updatedFile = `${baseName}(${sequentialNumber})${extension}`;
        }

        // Set a notification that file has been renamed
        enqueueSnackbar(t("fileRenamed", { file: updatedFile }), {
          variant: "info",
        });
      }

      const fileName = fileExists ? updatedFile : file.name;

      return {
        id: uuidv4(),
        name: fileName,
        size: file.size,
        lastModified: file.lastModified,
        type: file.name.substring(file.name.lastIndexOf(".") + 1),
        location: "local" as FileLocation,
        url: URL.createObjectURL(file),
        private: false,
      };
    });

    dispatch(addFiles(serializedFiles));
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      multiple: true,
      accept: {
        "application/octet-stream": data ? data.map((d) => `.${d}`) : [],
      },
      validator: fileValidator,
    });

  const formDisabled = useAppSelector(getFormDisabled);

  return (
    <Card>
      <CardHeader title={t("addLocal") as string} />
      <CardContent>
        {!formDisabled ?
          <Box
            sx={{
              border: "1px dashed",
              borderColor: "neutral.main",
              backgroundColor: isDragActive ? "primary.light" : "transparent",
            }}
            p={3}
            {...getRootProps({ className: "dropzone" })}
          >
            {data ?
              <>
                <input {...getInputProps()} />
                <Typography
                  color="neutral.contrastText"
                  sx={{ textAlign: "center", cursor: "pointer" }}
                >
                  {isDragActive ? t("dropNow") : t("drop")}
                </Typography>
              </>
            : <Typography
                color="neutral.contrastText"
                sx={{ textAlign: "center", cursor: "pointer" }}
              >
                {t("dropLoading")}
              </Typography>
            }
          </Box>
        : <Box
            sx={{
              border: "1px dashed",
              borderColor: "neutral.main",
              backgroundColor: isDragActive ? "primary.light" : "transparent",
            }}
            p={3}
          >
            <Typography
              color="neutral.contrastText"
              sx={{ textAlign: "center" }}
            >
              {t("dropDisabled")}
            </Typography>
          </Box>
        }
        {fileRejections.length > 0 && (
          <FileAlert
            files={fileRejections}
            color="error"
            title={t("fileTypeError")}
          />
        )}
      </CardContent>
    </Card>
  );
};

// This alert show either rejected files, or warnings
const FileAlert = ({
  color,
  title,
  files,
  description,
}: {
  color: "warning" | "error";
  title: string;
  files: SelectedFile[] | RejectedFiles[];
  description?: string;
}) => {
  const [open, setOpen] = useState(true);
  const sessionId = useAppSelector(getSessionId);

  return (
    <Collapse in={open}>
      <Alert
        severity={color}
        sx={{ mt: 2 }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => setOpen(false)}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {description && (
          <Typography variant="body2" gutterBottom>
            <Trans
              i18nKey={`files:${description}`}
              components={[
                <Link
                  href={`mailto:info@dans.knaw.nl?subject=Large file upload for dataset: ${sessionId}`}
                />,
              ]}
            />
          </Typography>
        )}
        <List dense={true}>
          {files.map((file, i) => (
            <ListItem key={i} disableGutters>
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText
                primary={file.file?.name || file.name}
                secondary={
                  file.errors &&
                  file.errors.map(
                    (error, i) =>
                      `${error.message}${
                        i < file.errors.length - 1 ? " | " : ""
                      }`,
                  )
                }
              />
            </ListItem>
          ))}
        </List>
      </Alert>
    </Collapse>
  );
};

export default FilesUpload;
