import { Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

type ValidationPanelProps = {
  errors: string[];
};

function ValidationPanel({ errors }: ValidationPanelProps) {
  const { t } = useTranslation('linkset-editor');
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Typography variant="h6">{t('validationPanel.heading')}</Typography>
        {errors.length === 0 ? (
          <Typography sx={{ color: 'success.main' }}>{t('validationPanel.validMessage')}</Typography>
        ) : (
          <Stack spacing={0.5}>
            {errors.map((error, index) => (
              <Typography key={`${index}-${error}`} sx={{ color: 'error.main' }}>
                {error}
              </Typography>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

export default ValidationPanel;
