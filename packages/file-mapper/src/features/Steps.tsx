import { useState, useEffect, type ReactNode } from "react";
import { useDropzone } from "react-dropzone";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import type { DarwinOptions, MappingProps, Saves } from "../types";

const options = [
  {
    term_localName: "genericName",
    tdwgutility_organizedInClass: "Taxon",
    label: "Generic Name",
  },
  {
    term_localName: "scientificName",
    tdwgutility_organizedInClass: "Taxon",
    label: "Scientific Name",
  },
  {
    term_localName: "individualCount",
    tdwgutility_organizedInClass: "Occurrence",
    label: "Individual Count",
  },
  {
    term_localName: "lifeStage",
    tdwgutility_organizedInClass: "Occurrence",
    label: "Life Stage",
  },
  {
    term_localName: "organismName",
    tdwgutility_organizedInClass: "Organism",
    label: "Organism Name",
  },
];

const saves = [
  {
    name: "Fake save #1",
    date: "8-8-2024",
    id: "someUniqueId1",
  },
  {
    name: "Fake save #2",
    date: "7-8-2024",
    id: "someUniqueId2",
  },
];

const StepWrap = ({ title, children }: { title: string; children: ReactNode }) => 
  <Box sx={{pt: 2, pb: 1}}>
    <Typography variant="h2">{title}</Typography>
    {children}
  </Box>

export const Step1 = ({ setFile, file, savedMap, setSavedMap }: { 
  setFile: (file: File | undefined) => void;
  file?: File;
  savedMap?: string;
  setSavedMap: (save: string) => void;
}) => {
  const { t } = useTranslation("steps");
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  const onDrop = async (files: File[]) => {
    setFile(files[0]);
  }

  const {  
    getRootProps, 
    getInputProps, 
    isDragActive, 
  } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
  });

  // reset saved selection on file choice
  useEffect(() => {
    file && setSavedMap('');
  }, [file]);

  // reset file selection if a saved map is picked
  useEffect(() => {
    savedMap && setFile(undefined);
  }, [savedMap]);

  return (
    <StepWrap title={t("selectFile")}>
      <Stack 
        direction={{xs: "column", md: "row"}} 
        spacing={{xs: 3, md: 4}}
        divider={<Divider orientation={matches ? "vertical" : "horizontal"} flexItem />}
      >
        <Box sx={{flex: 1}}>
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
          { file && 
            <Box key={file.name}>
              <Alert severity="success">
                {t("selectedFile", { name: file.name, size: (file.size / 1024).toFixed(0) })}
              </Alert>
            </Box> 
          }
        </Box>
        {saves.length > 0 && 
          <Box sx={{flex: 1}}>
            <Typography variant="h4" mb={1}>{t("selectSave")}</Typography>
            <List>
            {saves.map( (save: Saves) => 
              <ListItem key={save.id} disablePadding>
                <ListItemButton onClick={() => setSavedMap(savedMap === save.id ? "" : save.id)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={savedMap === save.id}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': save.id }}
                    />
                  </ListItemIcon>
                  <ListItemText id={save.id} primary={save.name} secondary={t("savedOn", {date: save.date})} />
                </ListItemButton>
              </ListItem>
            )}
            </List>
          </Box>
        }
      </Stack>
    </StepWrap>
  )
}

export const Step2 = ({ file, setMapping, mapping }: { 
  file?: File;
  mapping: MappingProps;
  setMapping: (mapping: MappingProps) => void;
}) => {
  const [ fileCols, setFileCols ] = useState<string[]>([]);
  const { t } = useTranslation("steps");

  useEffect(() => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target?.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];

      Array.isArray(sheetData) && setFileCols(sheetData);
    };

    if (file) {
      reader.readAsBinaryString(file);
    }

  }, [file]);
  
  return (
    <StepWrap title={t("createMapping")}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>{t("dataValue")}</TableCell>
              <TableCell>{t("mapTo")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fileCols.length > 0 && fileCols.map((row) => (
              <Row key={row} row={row} mapping={mapping} setMapping={setMapping} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StepWrap>
  )
}

const Row = ({row, mapping, setMapping}: {
  row: string;
  mapping: MappingProps;
  setMapping: (mapping: MappingProps) => void;
}) => {
  const { t } = useTranslation("steps");
  const [inputValue, setInputValue] = useState('');

  const selectValue = (row: string, value: DarwinOptions | null) => {
    if (value === null) {
      // Create a new object excluding the [row] key
      const { [row]: _, ...rest } = mapping;
      setMapping(rest);
    } else {
      setMapping({
        ...mapping,
        [row]: value,
      })
    }
  }

  return (
    <TableRow
      key={row}
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        {row}
      </TableCell>
      <TableCell>
        <Autocomplete
          options={options}
          getOptionLabel={(option) => option.label}
          groupBy={(option) => option.tdwgutility_organizedInClass}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label={t('selectOption')} />}
          onChange={(_e, value) => selectValue(row, value)}
          value={(mapping.hasOwnProperty(row) && mapping[row]) || null}
          inputValue={inputValue}
          isOptionEqualToValue={(option, value) => option.term_localName === value.term_localName}
          onInputChange={(_e, newInputValue) => {
            setInputValue(newInputValue);
          }}
        />
      </TableCell>
    </TableRow>
  )
}

export const Step3 = ({ mapping }: { mapping: MappingProps }) => {  
  const { t } = useTranslation("steps");

  console.log(mapping)

  return (
    <StepWrap title={t("finish")}>
    <Typography mb={3}>{t("saveMappingExtra")}</Typography>
      <TextField label={t('saveMapping')} sx={{ width: '30rem', maxWidth: '100%' }} />
    </StepWrap>
  )
}