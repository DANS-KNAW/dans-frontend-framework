import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { NL, GB } from "country-flag-icons/react/1x1";
import { useTranslation } from "react-i18next";
import styles from "./LanguageBar.module.css";
import i18nProvider from "./languages/i18n";
import { I18nextProvider } from "react-i18next";
import type { Language } from "@dans-framework/utils";

const LanguageBar = ({
  languages = [],
  changeLanguage = () => null,
}: {
  languages?: Language[];
  changeLanguage?: (lang: Language) => void;
}) => {
  const { t, i18n } = useTranslation("languagebar");

  return (
    <Box
      sx={{
        zIndex: 2,
        position: "relative",
        bgcolor: "primary.dark",
        color: "white",
      }}
    >
      <Container>
        <Stack direction="row" justifyContent="end" pt={0.5} pb={0.5}>
          {languages.map((lang: Language, i: number) => (
            <Button
              key={lang}
              size="small"
              startIcon={
                lang === "en" ? <GB className={styles.flag} />
                : lang === "nl" ?
                  <NL className={styles.flag} />
                : ""
              }
              sx={{ mr: i === languages.length - 1 ? 0 : 2, color: "#fff" }}
              onClick={() => {
                if (i18n.language !== lang) {
                  changeLanguage(lang);
                }
              }}
            >
              {t(lang)}
            </Button>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

const LanguageBarWrapper = ({ ...props }) => (
  <I18nextProvider i18n={i18nProvider}>
    <LanguageBar {...props} />
  </I18nextProvider>
);

export default LanguageBarWrapper;
