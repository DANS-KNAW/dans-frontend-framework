import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import CloseIcon from "@mui/icons-material/Close";
import Collapse from "@mui/material/Collapse";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import * as XLSX from "xlsx";
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const steps = ['Select file', 'Create mapping', 'Fill in form'];

const FileMapper = () => {
  const [ activeStep, setActiveStep ] = useState(0);
  const [ mapping, setMapping ] = useState();
  const [ file, setFile ] = useState();

   const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Paper sx={{p: 2}}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {
        activeStep === 0
        ? <Step1 setFile={setFile} />
        : <Step2 file={file} />
      }
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button onClick={handleNext} disabled={!file}>
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Paper>
  )
};

const Step1 = ({ setFile }) => {
  const { t } = useTranslation("files");


  const onDrop = async (files) => {
    setFile(files[0]);
  }

  const { 
    acceptedFiles, 
    getRootProps, 
    getInputProps, 
    isDragActive, 
    fileRejections 
  } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
  });

  return (
    <Box sx={{pt: 2, pb: 1}}>
      <Typography variant="h2">
        {t("selectFile")}
      </Typography>
      <Box
        sx={{
          border: "1px dashed",
          borderColor: "neutral.main",
          backgroundColor: isDragActive ? "primary.light" : "transparent",
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
      {fileRejections.length > 0 && (
        <FileAlert
          files={fileRejections}
          title={t("fileTypeError")}
        />
      )}
      {acceptedFiles.length > 0 && acceptedFiles.map(file =>
        <Box key={file.name}>
          <Alert severity="success">Selected {file.name} ({file.size}) for processing</Alert>
        </Box>
      )}
    </Box>
  )
}

const Step2 = ({ file }) => {
  const [ fileCols, setFileCols ] = useState([]);
  const { t } = useTranslation("files");

  useEffect(() => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      console.log(sheet)
      const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];

      setFileCols(sheetData);
    };

    reader.readAsBinaryString(file);

  }, [file]);
  
  return (
    <Box sx={{pt: 2, pb: 1}}>
      <Typography variant="h2">
        {t("setMapping")}
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Datasheet value</TableCell>
              <TableCell>Map to</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fileCols.length > 0 && fileCols.map((row) => (
              <TableRow
                key={row}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row}
                </TableCell>
                <TableCell>
                  Selector here
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

const FileAlert = ({
  title,
  files,
}: {
  title: string;
  files: any;
}) => {
  const { t } = useTranslation("files");
  const [open, setOpen] = useState(true);

  return (
    <Collapse in={open}>
      <Alert
        severity="warning"
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

export default FileMapper;
