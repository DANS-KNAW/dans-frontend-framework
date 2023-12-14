import { useState, forwardRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow, { TableRowProps } from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import ReplayCircleFilledIcon from "@mui/icons-material/ReplayCircleFilled";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getFiles, removeFile, setFileMeta } from "./filesSlice";
import { fileRoles, fileProcessing } from "./filesOptions";
import type {
  SelectedFile,
  FileActionOptionsProps,
  FileItemProps,
} from "../../types/Files";
import { dansUtilityApi, useCheckTypeQuery } from "./api/dansUtility";
import { LightTooltip } from "../generic/Tooltip";
import { getSessionId } from "../metadata/metadataSlice";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { getSingleFileSubmitStatus } from "../submit/submitSlice";
import { useSubmitFilesMutation } from "../submit/submitApi";
import { formatFileData } from "../submit/submitHelpers";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { getFormDisabled } from "../../deposit/depositSlice";

const FilesTable = () => {
  const { t } = useTranslation("files");
  const selectedFiles = useAppSelector<SelectedFile[]>(getFiles);

  return selectedFiles.length !== 0 ? (
    <TableContainer component={Paper} sx={{ overflow: "hidden" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ p: 1, width: 10 }} />
            <TableCell sx={{ p: 1 }}>{t("fileName")}</TableCell>
            <TableCell sx={{ p: 1 }}>{t("fileSize")}</TableCell>
            <TableCell sx={{ p: 1 }}>{t("fileType")}</TableCell>
            <TableCell sx={{ p: 1, width: 10 }}>{t("private")}</TableCell>
            <TableCell sx={{ p: 1, width: 230 }}>{t("role")}</TableCell>
            <TableCell sx={{ p: 1, width: 280 }}>{t("processing")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <AnimatePresence initial={false}>
            {selectedFiles.map((file) => (
              <FileTableRow key={file.name} file={file} />
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </TableContainer>
  ) : null;
};

const FileActionOptions = ({ file, type }: FileActionOptionsProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("files");
  const formDisabled = useAppSelector(getFormDisabled);

  return (
    <Autocomplete
      id={`${file.name}_${type}`}
      size="small"
      multiple={type === "process"}
      onChange={(_e, newValue) =>
        dispatch(
          setFileMeta({
            id: file.id,
            type: type,
            value: newValue,
          }),
        )
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={t(type === "process" ? "selectOptions" : "selectOption")}
        />
      )}
      options={type === "process" ? fileProcessing : fileRoles}
      value={file[type] || (type === "process" ? [] : null)}
      disabled={formDisabled}
      isOptionEqualToValue={(option, value) => option.value === value.value}
    />
  );
};

const FileConversion = ({ file }: FileItemProps) => {
  const dispatch = useAppDispatch();
  const { data, isError } = useCheckTypeQuery<any>(file.type);
  const { t } = useTranslation("files");

  return data ? (
    <LightTooltip
      title={
        <>
          <Typography sx={{ fontSize: 14, p: 2 }}>
            {file.submittedFile
              ? t("submittedFile")
              : file.valid === false
                ? t("invalid", { type: file.type })
                : data.preferred
                  ? t("noConversion")
                  : t("conversion", { type: data["required-convert-to"] })}
          </Typography>
          {!file.submittedFile && (
            <Typography
              sx={{
                fontSize: 12,
                pl: 2,
                pr: 2,
                pb: 1,
                pt: 1,
                backgroundColor: `${
                  file.valid === false
                    ? "error"
                    : data.preferred
                      ? "success"
                      : "warning"
                }.main`,
              }}
            >
              {file.valid === false
                ? t("invalidHead")
                : data.preferred
                  ? t("noConversionHead")
                  : t("conversionHead", { type: file.type })}
            </Typography>
          )}
        </>
      }
    >
      {file.submittedFile ? (
        <InfoRoundedIcon color="neutral" />
      ) : file.valid === false ? (
        <ErrorRoundedIcon color="error" />
      ) : data.preferred ? (
        <CheckCircleIcon color="success" />
      ) : (
        <InfoRoundedIcon color="warning" />
      )}
    </LightTooltip>
  ) : isError ? (
    <IconButton
      onClick={() =>
        dispatch(
          dansUtilityApi.endpoints.checkType.initiate(file.type, {
            forceRefetch: true,
          }),
        )
      }
      sx={{ marginLeft: "-8px" }}
    >
      <Tooltip title={t("fileTypeCheckError")}>
        <ReplayCircleFilledIcon color="error" />
      </Tooltip>
    </IconButton>
  ) : (
    <CircularProgress size={20} />
  );
};

const ForwardRow = forwardRef<
  HTMLTableRowElement,
  TableRowProps & HTMLMotionProps<"tr">
>((props, ref) => <TableRow ref={ref} {...props} />);
const MotionRow = motion(ForwardRow);

const FileTableRow = ({ file }: FileItemProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("files");
  const [toDelete, setToDelete] = useState<boolean>(false);
  const fileStatus = useAppSelector(getSingleFileSubmitStatus(file.id));
  const formDisabled = useAppSelector(getFormDisabled);

  return (
    <>
      <MotionRow
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        sx={{
          backgroundColor:
            file.valid === false
              ? "warning.light"
              : toDelete
                ? "neutral.light"
                : "",
          transition: "background 0.2s ease",
        }}
      >
        <TableCell sx={{ p: 0, pl: 1, borderWidth: fileStatus ? 0 : 1 }}>
          <IconButton
            color="primary"
            size="small"
            onClick={() =>
              !formDisabled &&
              (!file.submittedFile
                ? dispatch(removeFile(file))
                : setToDelete(!toDelete))
            }
            disabled={formDisabled}
          >
            <DeleteIcon fontSize="small" color="error" />
          </IconButton>
        </TableCell>
        <TableCell
          sx={{
            p: 1,
            minWidth: 150,
            maxWidth: 200,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            borderWidth: fileStatus ? 0 : 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AnimatePresence>
              {toDelete && (
                <motion.div
                  layout
                  key="delete"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      fontSize: 11,
                      mr: 1,
                    }}
                    color="error"
                    onClick={() => dispatch(removeFile(file))}
                  >
                    {t(`confirmDelete`)}
                  </Button>
                </motion.div>
              )}
              <motion.div layout key="name">
                {file.name}
              </motion.div>
            </AnimatePresence>
          </Box>
        </TableCell>
        <TableCell sx={{ p: 1, borderWidth: fileStatus ? 0 : 1 }}>
          {file.size ? `${(file.size / 1048576).toFixed(2)} MB` : "-"}
        </TableCell>
        <TableCell sx={{ p: 1, borderWidth: fileStatus ? 0 : 1 }}>
          <FileConversion file={file} />
        </TableCell>
        <TableCell sx={{ p: 0, borderWidth: fileStatus ? 0 : 1 }}>
          <Checkbox
            checked={file.private}
            onChange={(e) =>
              dispatch(
                setFileMeta({
                  id: file.id,
                  type: "private",
                  value: e.target.checked,
                }),
              )
            }
            disabled={file.valid === false || formDisabled}
          />
        </TableCell>
        <TableCell
          sx={{ p: 1, minWidth: 150, borderWidth: fileStatus ? 0 : 1 }}
        >
          <FileActionOptions type="role" file={file} />
        </TableCell>
        {/* TODO: remove or spec this */}
        <TableCell
          sx={{ p: 1, minWidth: 150, borderWidth: fileStatus ? 0 : 1 }}
        >
          <FileActionOptions type="process" file={file} />
        </TableCell>
      </MotionRow>
      <MotionRow 
        layout 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <AnimatePresence>
          <UploadProgress file={file} key={`progress-${file.name}`} />
        </AnimatePresence>
      </MotionRow>
    </>
  );
};

/*
const ForwardCell = forwardRef<
  HTMLTableCellElement,
  TableCellProps & HTMLMotionProps<"td">
>((props, ref) => <TableCell ref={ref} {...props} />);
const MotionCell = motion(ForwardCell);
*/

const UploadProgress = ({ file }: FileItemProps) => {
  // We handle progress and retrying/restarting of file uploads here
  // If metadata submission is successful, and file fails right away, there needs to be an option to manually start file upload.
  // So we check if the submit button has been touched.
  const sessionId = useAppSelector(getSessionId);
  const fileStatus = useAppSelector(getSingleFileSubmitStatus(file.id));
  const { t } = useTranslation("files");
  const [submitFiles] = useSubmitFilesMutation();

  const handleSingleFileUpload = () => {
    formatFileData(sessionId, [file]).then((d) => {
      submitFiles(d);
    });
  };

  return (
    fileStatus && (
      <TableCell
        sx={{
          paddingBottom: 0,
          paddingTop: 0,
        }}
        colSpan={7}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ width: "100%", mr: 1 }}>
            <LinearProgress
              variant="determinate"
              value={fileStatus.progress || 0}
              color={
                fileStatus.status === "success"
                  ? "success"
                  : fileStatus.status === "error"
                    ? "error"
                    : "primary"
              }
              sx={{ borderRadius: 2 }}
            />
          </Box>
          <Box sx={{ minWidth: 35, textAlign: "right" }}>
            {fileStatus.status === "submitting" && (
              <Typography variant="body2" color="text.secondary">{`${
                fileStatus.progress || 0
              }%`}</Typography>
            )}
            {fileStatus.status === "success" && (
              <Tooltip title={t("fileSubmitSuccess")}>
                <CheckCircleIcon color="success" />
              </Tooltip>
            )}
            {fileStatus.status === "error" && (
              <Stack direction="row" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {t("uploadFailed")}
                </Typography>
                <IconButton onClick={() => handleSingleFileUpload()}>
                  <Tooltip title={t("fileSubmitError")}>
                    <ReplayCircleFilledIcon color="error" />
                  </Tooltip>
                </IconButton>
              </Stack>
            )}
          </Box>
        </Box>
      </TableCell>
    )
  );
};

export default FilesTable;
