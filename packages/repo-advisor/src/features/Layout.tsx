import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import { lookupLanguageString, type LanguageStrings } from "@dans-framework/utils/language";
import { I18nextProvider, useTranslation, Trans } from "react-i18next";
import Link from '@mui/material/Link';
import { Link as RouterLink } from "react-router-dom";
import i18n from "../languages/i18n";

export const RepoBar = ({repo}: {repo?: LanguageStrings | string}) =>
  <I18nextProvider i18n={i18n}>
    <RepoBarInner repo={repo} />
  </I18nextProvider>

const RepoBarInner = ({repo}: {repo?: LanguageStrings | string}) => {
  const { i18n, t } = useTranslation("repobar");
  return (
    <Box sx={{ backgroundColor: "secondary.contrastText"}}>
      <Container>
        <Grid container>
          <Grid>
            <Typography variant="caption" sx={{ color: "white" }}>
              {t("activeRepo", { repo: lookupLanguageString(repo, i18n.language) })}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export const NoRepoSelected = ({advisorLocation}: {advisorLocation: string}) =>
  <I18nextProvider i18n={i18n}>
    <NoRepoSelectedInner advisorLocation={advisorLocation} />
  </I18nextProvider>

const NoRepoSelectedInner = ({advisorLocation}: {advisorLocation: string}) => {
  const { t } = useTranslation("repobar");
  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid xs={12} sm={11} md={8} lg={7} xl={6} mt={4}>
          <Typography variant="h1">{t("selectRepoFirst")}</Typography>
          <Typography>
            <Trans
              i18nKey={"repobar:description"}
              components={[
                <Link component={RouterLink} to={advisorLocation} />,
              ]}
            />
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}

