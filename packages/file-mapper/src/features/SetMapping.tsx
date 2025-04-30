import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import { useTranslation } from "react-i18next";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Tooltip from "@mui/material/Tooltip";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import type { DarwinOptions, FileError, SheetData } from "../types";
import {
  getFile,
  getMapping,
  setMapping,
  getFileError,
  setFileError,
  setFileData,
  getFileData,
} from "./fileMapperSlice";
import { useFetchDarwinTermsQuery } from "./fileMapperApi";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { StepWrap, maxRows } from "./Steps";
import LaunchIcon from "@mui/icons-material/Launch";
import InputAdornment from "@mui/material/InputAdornment";

export const SetMapping = () => {
  const { t } = useTranslation("steps");
  const dispatch = useAppDispatch();
  const file = useAppSelector(getFile);
  const fileData = useAppSelector(getFileData);
  const fileError = useAppSelector(getFileError);
  // loading indicator only if new file needs to be read
  const [loading, setLoading] = useState<boolean>(
    !Array.isArray(fileData) && !fileError,
  );

  useEffect(() => {
    const loadXLSX = async () => {
      const XLSX = await import("xlsx"); // Lazy load the library here

      const reader = new FileReader();
      reader.onload = (event) => {
        // parse the xlsx/csv file
        const workbook = XLSX.read(event.target?.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const sheetData: SheetData[] = XLSX.utils.sheet_to_json(sheet, {
          header: "A",
        });
        // check to see if sheet doesn't have too many rows (first row is headers, so doesn't count)
        const rowCount = sheetData.length - 1;
        if (rowCount > maxRows) {
          dispatch(setFileError("tooManyRows"));
        } else {
          // save sheet data so we only need to load and parse once
          dispatch(setFileData(sheetData));
        }
        setLoading(false);
      };

      if (file && !fileData && !fileError) {
        dispatch(setFileError(undefined));
        // if no file loaded yet, convert file url back to blob
        const fetchedFile = await fetch(file.url);
        const blob = await fetchedFile.blob();
        if (blob) {
          reader.readAsBinaryString(blob);
        }
      }
    };

    loadXLSX(); // Call the lazy loading function
  }, [file, fileData, fileError, dispatch]);

  return (
    <StepWrap title={t("createMapping")}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>{t("dataValue")}</TableCell>
              <TableCell>{t("mapTo")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(loading || fileError) && (
              <TableRow>
                <TableCell align="center" colSpan={2}>
                  {loading ?
                    <CircularProgress />
                  : <Alert severity="error">
                      {t(fileError as FileError, { max: maxRows })}
                    </Alert>
                  }
                </TableCell>
              </TableRow>
            )}
            {fileData &&
              Object.entries(fileData[0]).map(([key, value]) => (
                <Row key={key} rowKey={key} row={value} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StepWrap>
  );
};

export default SetMapping;

const Row = ({ rowKey, row }: { rowKey: string; row: string }) => {
  const { t } = useTranslation("steps");
  const [inputValue, setInputValue] = useState("");
  const mapping = useAppSelector(getMapping);
  const dispatch = useAppDispatch();
  const fileData = useAppSelector(getFileData);
  const columnData = fileData && fileData.slice(1).map((data) => data[rowKey]);
  const [open, setOpen] = useState<boolean>(false);

  const { data, isLoading } = useFetchDarwinTermsQuery("");

  const selectValue = (row: string, value: DarwinOptions | null) => {
    if (value === null) {
      // Create a new object excluding the [row] key
      const { [row]: _, ...rest } = mapping;
      dispatch(setMapping(rest));
    } else {
      dispatch(
        setMapping({
          ...mapping,
          [row]: value,
        }),
      );
    }
  };

  return (
    <>
      <TableRow>
        <TableCell width={20} sx={{ border: 0 }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ?
              <KeyboardArrowUpIcon />
            : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ border: 0 }}>{row}</TableCell>
        <TableCell sx={{ border: 0 }}>
          <Autocomplete
            options={(data as DarwinOptions[]) || []}
            getOptionLabel={(option) => option.label}
            groupBy={(option) => option.header}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("selectOption")}
                InputProps={{
                  ...params.InputProps,
                  startAdornment:
                    mapping.hasOwnProperty(row) ?
                      <InputAdornment position="start">
                        <InfoLink url={mapping[row].url} />
                      </InputAdornment>
                    : undefined,
                }}
              />
            )}
            onChange={(_e, value) => selectValue(row, value)}
            value={(mapping.hasOwnProperty(row) && mapping[row]) || null}
            inputValue={inputValue}
            isOptionEqualToValue={(option, value) =>
              option.term_localName === value.term_localName
            }
            onInputChange={(_e, newInputValue) => {
              setInputValue(newInputValue);
            }}
            loading={isLoading}
            size="small"
            renderOption={(props, option) => (
              <li {...props} key={option.label} style={{ flexWrap: "wrap" }}>
                <InfoLink url={option.url} margin />
                {option.label}
              </li>
            )}
          />
        </TableCell>
      </TableRow>
      {columnData && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} />
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Typography variant="h6">{t("dataHeader")}</Typography>
              {columnData.map((item, i) => (
                <Typography key={i} mb={i === columnData.length - 1 ? 3 : 0.5}>
                  {item}
                </Typography>
              ))}
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

const InfoLink = ({ url, margin }: { url: string; margin?: boolean }) => {
  const { t } = useTranslation("steps");

  return (
    <Tooltip title={t("moreInfo")}>
      <a
        href={url}
        target="_blank"
        rel="norefferer"
        style={{ marginRight: margin ? "0.5rem" : 0, lineHeight: 0 }}
      >
        <LaunchIcon
          color="primary"
          sx={{ fontSize: 16, "&:hover": { color: "primary.dark" } }}
        />
      </a>
    </Tooltip>
  );
};
