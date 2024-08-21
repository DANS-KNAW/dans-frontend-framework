import { useTranslation } from "react-i18next";
import TextField from '@mui/material/TextField';
import Typography from "@mui/material/Typography";
import { StepWrap } from "./Steps";

export const SaveMapping = () => {  
  const { t } = useTranslation("steps");

  return (
    <StepWrap title={t("finish")}>
    <Typography mb={3}>{t("saveMappingExtra")}</Typography>
      <TextField label={t('saveMapping')} sx={{ width: '30rem', maxWidth: '100%' }} />
    </StepWrap>
  )
}

export default SaveMapping;