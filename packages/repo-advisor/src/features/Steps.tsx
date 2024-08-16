import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getRor, getNarcis, getDepositType, getFileType, setFileType, setDepositType, getRepo, setRepo } from "./repoAdvisorSlice";
import { useFetchDataQuery } from "./repoAdvisorApi";
import { RorField, NarcisField, SelectField } from "./Components";
import { AnimatePresence, motion } from "framer-motion";
import { lookupLanguageString, type LanguageStrings } from "@dans-framework/utils/language";
import type { FormConfig } from "@dans-framework/deposit";

const StepWrap = ({ title, children, subtitle }: { title: string; children: ReactNode, subtitle?: string; }) => 
  <Box sx={{pt: 2, pb: 1}}>
    <Typography variant="h2">{title}</Typography>
    {subtitle && <Typography variant="subtitle1" mb={3}>{subtitle}</Typography>}
    {children}
  </Box>

export const Step1 = () => {
  const { t } = useTranslation("steps");
  const depositType = useAppSelector(getDepositType);
  const fileType = useAppSelector(getFileType);
  const dispatch = useAppDispatch();

  return (
    <StepWrap title={t("repoAdvisor")} subtitle={t("repoAdvisorDescription")}>
      <RorField />
      <NarcisField />
      <SelectField 
        label={t("depositType")}
        value={depositType}
        onChange={(value) => dispatch(setDepositType(value))}
        options={[
          {label: t("dataset"), value: "dataset"},
          {label: t("code"), value: "code"},
          {label: t("report"), value: "report"},
          {label: t("publication"), value: "publication"},
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
              label={t("fileType")}
              value={fileType}
              onChange={setFileType}
              options={[
                {label: t("audiovisual_materials"), value: "audiovisual_materials"},
                {label: t("statistical_data"), value: "statistical_data"},
                {label: t("geospatial_data_files"), value: "geospatial_data_files"},
                {label: t("netcdf_and_hdf_files"), value: "netcdf_and_hdf_files"},
                {label: t("darwin_core_and_ecological_markup_language_files"), value: "darwin_core_and_ecological_markup_language_files"},
                {label: t("other"), value: "other"},
              ]}
            />
          </motion.div>
        }
      </AnimatePresence >
    </StepWrap>
  )
}

export const Step2 = () => {
  const { t, i18n } = useTranslation("steps");
  const ror = useAppSelector(getRor);
  const narcis = useAppSelector(getNarcis);
  const depositType = useAppSelector(getDepositType);
  const fileType = useAppSelector(getFileType);
  const repo = useAppSelector(getRepo);
  const dispatch = useAppDispatch();

  const { data, isLoading, isError, refetch } = useFetchDataQuery<{
    data: FormConfig[]; 
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
  }>({
    ror: ror,
    narcis: narcis,
    depositType: depositType,
    fileType: fileType,
  });
  
  return (
    <StepWrap title={t("selectDataset")} subtitle={t("selectDatasetDescription")}>
      {data && data.length > 0 ?
        <List sx={{mb: 2}}>
          {data.map( (rec, i) =>
            <ListItem 
              key={i}
              alignItems="flex-start"
              disableGutters
            >
              <ListItemButton role={undefined} onClick={() => dispatch(setRepo(rec))} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={(repo?.displayName as LanguageStrings)?.en === (rec?.displayName as LanguageStrings)?.en}
                    tabIndex={-1}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={lookupLanguageString(rec.displayName, i18n.language)}
                  secondary={
                    <>
                      {rec.external && <Typography
                        sx={{ display: 'inline', mr: 0.5 }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {t("externalRepo")}
                      </Typography>}
                      {lookupLanguageString(rec.description, i18n.language)}
                    </>
                  }
                  sx={{pr: 6}}
                />
              </ListItemButton>
            </ListItem>
          )}
        </List>
        : isLoading ?
        <CircularProgress />
        : isError ?
        <Alert severity="error">
          <Typography gutterBottom>{t("fetchError")}</Typography>
          <Button 
            variant="contained" 
            size="small" 
            color="warning"
            onClick={() => refetch()}
          >
            {t("retryFetch")}
          </Button>
        </Alert>
        :
        <Alert severity="info">{t("noRepoFound")}</Alert>
      }
    </StepWrap>
  )
}