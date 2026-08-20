import { Alert, Button, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { RegistryRepository } from "../registry/registryTypes";

type RegistryImportPanelProps = {
  repositories: RegistryRepository[];
  onRepositorySelected: (repository: RegistryRepository) => Promise<void> | void;
  onReloadRepositories: () => Promise<void> | void;
  isLoadingRepositories: boolean;
  isLoadingLinkSet: boolean;
  successMessage: string;
  errorMessage: string;
};

function RegistryImportPanel({
  repositories,
  onRepositorySelected,
  onReloadRepositories,
  isLoadingRepositories,
  isLoadingLinkSet,
  successMessage,
  errorMessage,
}: RegistryImportPanelProps) {
  const { t } = useTranslation("linkset-editor");
  const [selectedRepositoryUrl, setSelectedRepositoryUrl] = useState<string>(repositories[0]?.url ?? "");
  const selectedRepository =
    repositories.find((repository) => repository.url === selectedRepositoryUrl) ?? null;

  useEffect(() => {
    if (repositories.length === 0) {
      setSelectedRepositoryUrl("");
      return;
    }

    if (!repositories.some((repository) => repository.url === selectedRepositoryUrl)) {
      setSelectedRepositoryUrl(repositories[0].url);
    }
  }, [repositories, selectedRepositoryUrl]);

  const handleRepositoryChange = (event: SelectChangeEvent) => {
    setSelectedRepositoryUrl(event.target.value);
  };

  const handleRepositorySelected = async () => {
    if (!selectedRepository) {
      return;
    }

    await onRepositorySelected(selectedRepository);
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Typography variant="h6">{t('registryPanel.heading')}</Typography>
        {repositories.length === 0 ? (
          <Stack spacing={1.5}>
            {!isLoadingRepositories ? (
              <Alert severity="info">{t('registryPanel.empty')}</Alert>
            ) : null}
            <Button
              variant="outlined"
              onClick={onReloadRepositories}
              disabled={isLoadingRepositories}
              sx={{ alignSelf: "flex-start" }}
            >
              {isLoadingRepositories ? t('registryPanel.loadingRepositories') : t('registryPanel.reload')}
            </Button>
          </Stack>
        ) : (
          <>
            <FormControl fullWidth>
              <InputLabel id="registry-repository-label">{t('registryPanel.repositoryLabel')}</InputLabel>
              <Select
                labelId="registry-repository-label"
                value={selectedRepositoryUrl}
                label={t('registryPanel.repositoryLabel')}
                onChange={handleRepositoryChange}
              >
                {repositories.map((repository) => (
                  <MenuItem key={repository.url} value={repository.url}>
                    {repository.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedRepository && (
              <Typography variant="body2" color="text.secondary">
                {selectedRepository.url}
              </Typography>
            )}

            <Button
              variant="contained"
              onClick={handleRepositorySelected}
              disabled={!selectedRepository || isLoadingLinkSet}
              sx={{ alignSelf: "flex-start", fontWeight: 600 }}
            >
              {isLoadingLinkSet ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={16} />
                  <span>{t('registryPanel.loading')}</span>
                </Stack>
              ) : (
                t('registryPanel.action')
              )}
            </Button>
          </>
        )}

        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      </Stack>
    </Paper>
  );
}

export default RegistryImportPanel;
