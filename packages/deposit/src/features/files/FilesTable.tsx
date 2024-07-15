import { useState, forwardRef, useMemo } from "react";
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
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import ReplayCircleFilledIcon from "@mui/icons-material/ReplayCircleFilled";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getFiles, removeFile, setFileMeta } from "./filesSlice";
import { fileProcessing, fileRoles as defaultFileRoles } from "./filesOptions";
import type {
  SelectedFile,
  FileActionOptionsProps,
  FileItemProps,
  FileActions,
} from "../../types/Files";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { getSingleFileSubmitStatus, setFilesSubmitStatus } from "../submit/submitSlice";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { getFormDisabled, getData } from "../../deposit/depositSlice";
import FileStatusIndicator from "./FileStatusIndicator";
import { lookupLanguageString } from "@dans-framework/utils";
import { useFetchGroupedListQuery } from "./api/dansFormats";
import { findFileGroup } from "./filesHelpers";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment, { Moment } from "moment";
import type { DateValidationError } from "@mui/x-date-pickers/models";

const FilesTable = () => {
  const { t } = useTranslation("files");
  const selectedFiles = useAppSelector<SelectedFile[]>(getFiles);
  const formConfig = useAppSelector(getData);

  const { 
    displayRoles = true, 
    displayProcesses = true,
    displayPrivate = true,
    embargoDate = false,
  } = formConfig?.filesUpload || {};

  return selectedFiles.length !== 0 ?
      <TableContainer component={Paper} sx={{ overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ p: 1, width: 10 }} />
              <TableCell sx={{ p: 1 }}>{t("fileName")}</TableCell>
              <TableCell sx={{ p: 1 }}>{t("fileSize")}</TableCell>
              <TableCell sx={{ p: 1 }}>{t("fileType")}</TableCell>
              {displayPrivate && (
                <TableCell sx={{ p: 1, width: 10 }}>{t("private")}</TableCell>
              )}
              {displayRoles && (
                <TableCell sx={{ p: 1, width: 230 }}>{t("role")}</TableCell>
              )}
              {displayProcesses && (
                <TableCell sx={{ p: 1, width: 230 }}>
                  {t("processing")}
                </TableCell>
              )}
              {embargoDate && (
                <TableCell sx={{ p: 1, width: 161 }}>
                  <Box sx={{ display: "flex",alignItems: "center" }}>
                    {t("embargoDate")}
                    <Tooltip title={t("embargoDateDescription")}>
                      <InfoRoundedIcon color="neutral" fontSize="small" sx={{ml: 0.25}} />
                    </Tooltip>
                  </Box>
                </TableCell>
              )}
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
    : null;
};

const FileActionOptions = ({ file, type }: FileActionOptionsProps) => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation("files");
  const formDisabled = useAppSelector(getFormDisabled);
  const config = useAppSelector(getData);
  const fileRoles = config.filesUpload?.fileRoles || defaultFileRoles;
  const options = type === "process" ? fileProcessing : fileRoles;
  const localizedOptions =
    (options &&
      (options.map((option) => ({
        ...option,
        label: lookupLanguageString(option.label, i18n.language),
      })) as FileActions[])) ||
    [];

  // Need to check the type of file and provide valid processing options
  const { data } = useFetchGroupedListQuery(null);
  const typeKey =
    file.name && data ? findFileGroup(file.name.split(".").pop(), data) : "";
  const filteredOptions =
    type === "process" ?
      localizedOptions.filter(
        (o) => o.for && typeKey && o.for.indexOf(typeKey) !== -1,
      )
    : localizedOptions;

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
          inputProps={{
            ...params.inputProps,
            "data-testid": `actions-${type}-${file.name}`,
          }}
        />
      )}
      options={filteredOptions}
      value={file[type] || (type === "process" ? [] : null)}
      disabled={formDisabled}
      isOptionEqualToValue={(option, value) => option.value === value.value}
    />
  );
};

const EmbargoDate = ({ file }: { file: SelectedFile }) => {
  const { t } = useTranslation("files");
  const [error, setError] = useState<DateValidationError | null>(null);
  const dispatch = useAppDispatch();
  const formDisabled = useAppSelector(getFormDisabled);
  const dateFormat = "DD-MM-YYYY";
  const serverDateFormat = "YYYY-MM-DD";
  const config = useAppSelector(getData);

  const errorMessage = useMemo(() => {
    switch (error) {
      case "minDate": {
        return t("minDate");
      }
      case "invalidDate": {
        return t("dateInvalid");
      }
      default: {
        return "";
      }
    }
  }, [error]);

  return (
    <DatePicker 
      format={dateFormat}
      onChange={(value: Moment | null, context) => {
        // Serialize the date value we get from the component so we can store it using Redux
        const dateValue =
          !context.validationError && value ? value.format(serverDateFormat) : "";
        dispatch(
          setFileMeta({
            id: file.id,
            type: "embargo",
            value: dateValue,
          }),
        );
      }}
      value={moment(file.embargo, serverDateFormat) || null}
      disabled={formDisabled}
      minDate={moment().add(config.filesUpload?.embargoDateMin || 1, 'days')}
      maxDate={moment().add(config.filesUpload?.embargoDateMax || 10000, 'days')}
      onError={(newError) => setError(newError as DateValidationError)}
      slotProps={{
        textField: {
          error: error && file.hasOwnProperty("embargo") ? true : false,
          helperText: file.hasOwnProperty("embargo") && errorMessage,
          size: "small",
        },
      }}
    />
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
  const formConfig = useAppSelector(getData);

  const {
    displayRoles = true,
    displayProcesses = true,
    displayPrivate = true,
    convertFiles = true,
    embargoDate = false,
  } = formConfig?.filesUpload || {};

  return (
    <>
      <MotionRow
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        sx={{
          backgroundColor:
            file.valid === false ? "warning.light"
            : toDelete ? "neutral.light"
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
              (!file.submittedFile ?
                dispatch(removeFile(file))
              : setToDelete(!toDelete))
            }
            disabled={formDisabled}
            data-testid={`delete-${file.name}`}
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
          <FileStatusIndicator convertFiles={convertFiles} file={file} />
        </TableCell>
        {displayPrivate && (
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
              data-testid={`private-${file.name}`}
              disabled={file.valid === false || formDisabled}
              />
          </TableCell>
        )}
        {displayRoles && (
          <TableCell
            sx={{ p: 1, minWidth: 150, borderWidth: fileStatus ? 0 : 1 }}
          >
            <FileActionOptions type="role" file={file} />
          </TableCell>
        )}
        {/* TODO: remove or spec this */}
        {displayProcesses && (
          <TableCell
            sx={{ p: 1, minWidth: 150, borderWidth: fileStatus ? 0 : 1 }}
          >
            <FileActionOptions type="process" file={file} />
          </TableCell>
        )}
        {embargoDate && (
          <TableCell
            sx={{ p: 1, minWidth: 150, borderWidth: fileStatus ? 0 : 1 }}
          >
            <EmbargoDate file={file} />
          </TableCell>
        )}
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

const UploadProgress = ({ file }: FileItemProps) => {
  const dispatch = useAppDispatch();
  // We handle progress and manually retrying/restarting of file uploads here
  const fileStatus = useAppSelector(getSingleFileSubmitStatus(file.id));
  const { t } = useTranslation("files");
  const handleSingleFileUpload = () => {
    console.log('retrying')
    dispatch(setFilesSubmitStatus({
      id: file.id,
      progress: 0,
      status: "queued",
    }));
  };

  return (
    fileStatus && (
      <TableCell
        sx={{
          paddingBottom: 0,
          paddingTop: 0,
        }}
        colSpan={8}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ width: "100%", mr: 1 }}>
            <LinearProgress
              variant="determinate"
              value={fileStatus.progress || 0}
              color={
                fileStatus.status === "success" ? "success"
                : fileStatus.status === "error" ?
                  "error"
                : "primary"
              }
              sx={{ borderRadius: 2 }}
            />
          </Box>
          <Box sx={{ minWidth: 35, textAlign: "right" }}>
            {(fileStatus.status === "submitting" || fileStatus.status === "queued") && (
              <Typography variant="body2" color="text.secondary">{`${
                fileStatus.progress || 0
              }%`}</Typography>
            )}
            {fileStatus.status === "finalising" && (
              <Tooltip title={t("fileSubmitWaiting")}>
                <CircularProgress size={20} />
              </Tooltip>
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
