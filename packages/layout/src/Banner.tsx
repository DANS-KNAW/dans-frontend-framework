import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";

interface BannerProps {
  text:
    | {
        en: string;
        nl: string;
      }
    | string;
}

const Banner = ({ text }: BannerProps) => {
  const { i18n } = useTranslation("languagebar");

  const language = i18n.language || "en";
  const label = typeof text === "string" 
  ? text 
  : text[language as keyof typeof text] || text.en;

  return (
    <Box
      sx={{
        zIndex: 2,
        position: "relative",
        color: "black",
      }}
    >
      <Container>
        <Stack direction="row" justifyContent="end" pt={0.5} pb={0.5}>
          <Typography
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              width: "100%",
            }}
          >
            {label}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Banner;
