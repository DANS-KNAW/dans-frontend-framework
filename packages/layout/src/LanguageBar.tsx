import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { NL, GB } from "country-flag-icons/react/1x1";
import { useTranslation } from "react-i18next";
import styles from "./LanguageBar.module.css";
import type { Language } from "@dans-framework/utils";

// ─── LanguageBar ─────────────────────────────────────────────────────────────

/**
 * Slim language selector bar sitting above the main nav.
 * Uses a light strip with a subtle bottom border instead of a heavy dark background.
 * Active language is indicated by an underline + slightly bolder text.
 */
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
      component="aside"
      sx={{
        zIndex: 3,
        position: "relative",
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ height: 32 }}>
          {languages.map((lang: Language, i: number) => {
            const isActive = i18n.language === lang;

            return (
              <ButtonBase
                key={lang}
                onClick={() => { if (!isActive) changeLanguage(lang); }}
                disabled={isActive}
                disableRipple
                sx={{
                  ml: i === 0 ? 0 : 1.5,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.6,
                  px: 0.5,
                  py: 0.25,
                  borderRadius: 0,
                  opacity: isActive ? 1 : 0.55,
                  transition: "opacity 0.18s ease, border-color 0.18s ease",
                  cursor: isActive ? "default" : "pointer",
                  "&:hover:not(:disabled)": { opacity: 0.85 },
                  // Don't let MUI ButtonBase grey-out the disabled state
                  "&.Mui-disabled": { opacity: isActive ? 1 : 0.4 },
                }}
              >
                {/* Flag */}
                {lang === "en" ? (
                  <GB className={styles.flag} aria-hidden="true" />
                ) : lang === "nl" ? (
                  <NL className={styles.flag} aria-hidden="true" />
                ) : null}

                {/* Label */}
                <Typography
                  component="span"
                  sx={{
                    fontSize: "0.72rem",
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: "0.06em",
                    color: isActive ? "primary.main" : "text.secondary",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {t(lang)}
                </Typography>
              </ButtonBase>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
};

export default LanguageBar;