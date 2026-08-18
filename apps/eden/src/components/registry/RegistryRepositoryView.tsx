import { Link, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { RegistryRepository } from "./registryTypes";

type RegistryRepositoryViewProps = {
  repository: RegistryRepository;
};

function RegistryRepositoryView({ repository }: RegistryRepositoryViewProps) {
  const { t } = useTranslation("linkset-editor");

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }}>
      <Typography variant="body2" color="text.secondary">
        {t('registryRepositoryView.label')}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {repository.title}
      </Typography>
      <Link href={repository.url} target="_blank" rel="noreferrer" variant="body2">
        {repository.url}
      </Link>
    </Stack>
  );
}

export default RegistryRepositoryView;