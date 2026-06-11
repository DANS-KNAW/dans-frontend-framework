import { Paper, Stack, Typography } from "@mui/material";

type ValidationPanelProps = {
  errors: string[];
};

function ValidationPanel({ errors }: ValidationPanelProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Typography variant="h6">Validation</Typography>
        {errors.length === 0 ? (
          <Typography sx={{ color: 'success.main' }}>LinkSet draft is valid.</Typography>
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
