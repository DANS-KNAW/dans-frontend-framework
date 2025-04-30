import { useDropzone } from "react-dropzone";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { useTranslation } from "react-i18next";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import type { Saves, SerializedFile } from "../types";
import {
  getFile,
  setFile,
  getSavedMap,
  setSavedMap,
  resetMapping,
  getFileError,
  resetFileError,
  resetFileData,
} from "./fileMapperSlice";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { StepWrap, maxRows, saves } from "./Steps";

const SelectFile = () => {
  const { t } = useTranslation("steps");
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const dispatch = useAppDispatch();
  const file = useAppSelector(getFile);
  const savedMap = useAppSelector(getSavedMap);
  const fileError = useAppSelector(getFileError);

  const onDrop = async (files: File[]) => {
    // serialize files to store in redux
    const serializedFile: SerializedFile = {
      name: files[0].name,
      size: files[0].size,
      url: URL.createObjectURL(files[0]),
    };

    dispatch(setFile(serializedFile));

    // reset saved mapping and column values after selecting a different file
    dispatch(resetMapping());
    dispatch(resetFileData());
    dispatch(resetFileError());
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
  });

  return (
    <StepWrap title={t("selectFile")}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 3, md: 4 }}
        divider={
          <Divider orientation={matches ? "vertical" : "horizontal"} flexItem />
        }
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4">{t("uploadNew")}</Typography>
          <Box
            sx={{
              border: "1px dashed",
              borderColor: "neutral.main",
              backgroundColor: isDragActive ? "primary.light" : "transparent",
              mb: matches ? 3 : 0,
            }}
            p={3}
            {...getRootProps({ className: "dropzone" })}
          >
            <input {...getInputProps()} />
            <Typography
              color="neutral.contrastText"
              sx={{ textAlign: "center", cursor: "pointer" }}
            >
              {isDragActive ? t("dropNow") : t("drop")}
            </Typography>
          </Box>
          {file && (
            <Box key={file.name}>
              <Alert severity="success">
                {t("selectedFile", {
                  name: file.name,
                  size: (file.size / 1024).toFixed(0),
                })}
              </Alert>
              {fileError && (
                <Alert severity="error">{t(fileError, { max: maxRows })}</Alert>
              )}
            </Box>
          )}
        </Box>
        {saves.length > 0 && (
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" mb={1}>
              {t("selectSave")}
            </Typography>
            <List>
              {saves.map((save: Saves) => (
                <ListItem key={save.id} disablePadding>
                  <ListItemButton
                    onClick={() =>
                      dispatch(setSavedMap(savedMap === save.id ? "" : save.id))
                    }
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={savedMap === save.id}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": save.id }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={save.id}
                      primary={save.name}
                      secondary={t("savedOn", { date: save.date })}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Stack>
    </StepWrap>
  );
};

export default SelectFile;
