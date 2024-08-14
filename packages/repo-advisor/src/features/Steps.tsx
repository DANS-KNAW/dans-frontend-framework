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
import type { DarwinOptions, Saves, SerializedFile } from "../types";
import { 
  getFile, 
  setFile, 
  getMapping, 
  setMapping, 
  getSavedMap,
  setSavedMap,
} from './fileMapperSlice';
import { useFetchDarwinTermsQuery } from "./fileMapperApi";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getRor, getNarcis, getDepositType, getFileType, setDepositType } from "./repoAdvisorSlice";
import { RorField, NarcisField, SelectField } from "./Components";
import { AnimatePresence, motion } from "framer-motion";

const StepWrap = ({ title, children, subtitle }: { title: string; children: ReactNode, subtitle?: string; }) => 
  <Box sx={{pt: 2, pb: 1}}>
    <Typography variant="h2">{title}</Typography>
    {subtitle && <Typography variant="subtitle1">{subtitle}</Typography>}
    {children}
  </Box>

export const Step1 = () => {
  const { t } = useTranslation("steps");
  const dispatch = useAppDispatch();
  const ror = useAppSelector(getRor);
  const narcis = useAppSelector(getNarcis);
  const depositType = useAppSelector(getDepositType);
  const fileType = useAppSelector(getFileType);

  return (
    <StepWrap title={t("repoAdvisor")} subtitle={t("repoAdvisorDescription")}>
      <RorField
        label="Your institution"
      />
      <NarcisField 
        label="Research domain"
      />
      <SelectField 
        label="Deposit type"
        value={depositType}
        onChange={setDepositType}
        options={[
          {label: "Dataset", value: "dataset"},
          {label: "Code", value: "code"},
          {label: "Report, article, or presentation", value: "report"},
          {label: "Publication", value: "publication"},
        ]}
      />
      <AnimatePresence>
        {depositType === 'dataset' &&
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <SelectField 
              label="File type"
              value={fileType}
              onChange={setFileType}
              options={[
                {label: "Audiovisual materials", value: "audiovisual_materials"},
                {label: "Statistical data", value: "statistical_data"},
                {label: "Geospatial data files", value: "geospatial_data_files"},
                {label: "NetCDF and HDF files", value: "netcdf_and_hdf_files"},
                {label: "Darwin core and ecological markup language files", value: "darwin_core_and_ecological_markup_language_files"},
                {label: "Other", value: "other"},
              ]}
            />
          </motion.div>
        }
      </AnimatePresence >
    </StepWrap>
  )
}

export const Step2 = () => {
  const { t } = useTranslation("steps");
  
  return (
    <StepWrap title={t("selectDataset")}>
      
    </StepWrap>
  )
}