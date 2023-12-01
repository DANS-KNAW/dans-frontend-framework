import { useTranslation } from "react-i18next";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import type { Footer as FooterType, FooterContent } from "./types";
import { lookupLanguageString } from "@dans-framework/utils";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import EmailIcon from "@mui/icons-material/Email";
import parse from "html-react-parser";

const Footer = ({ top, bottom }: FooterType) => {
  const columnsTop = top.length;
  const columnsBottom = bottom.length;
  return (
    <>
      <Box
        sx={{
          color: "footerTop.contrastText",
          bgcolor: "footerTop.main",
          mt: 8,
          pt: 4,
          pb: 4,
        }}
      >
        <Container>
          <Grid container columns={columnsTop} spacing={2}>
            {top.map((item, i) => (
              <Grid xs={4} sm={2} md={1} key={`footer-${i}`}>
                <FooterContent {...item} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Box
        sx={{
          bgcolor: "footerBottom.light",
          color: "footerBottom.contrastText",
          pt: 4,
          pb: 4,
        }}
      >
        <Container>
          <Grid container columns={columnsBottom}>
            {bottom.map((item, i) => (
              <Grid xs={2} md={1} key={i}>
                <FooterContent {...item} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

const FooterContent = ({ header, links, freetext, image }: FooterContent) => {
  const { i18n } = useTranslation();
  return (
    <Stack direction="column" alignItems="start">
      {header && (
        <Typography variant="h6">
          {lookupLanguageString(header, i18n.language)}
        </Typography>
      )}
      {image && <img src={image.src} alt={image.alt} />}
      {freetext && (
        <Box sx={{ a: { color: "primary.main", textDecoration: "none" } }}>
          {parse(lookupLanguageString(freetext, i18n.language) || "")}
        </Box>
      )}
      {links &&
        links.map((link, j) => (
          <Link
            href={link.link}
            underline="none"
            target="_blank"
            key={`link-${j}`}
            sx={{ display: "flex", alignItems: "center" }}
          >
            {link.icon && link.icon === "twitter" && (
              <TwitterIcon sx={{ mr: 1 }} fontSize="small" />
            )}
            {link.icon && link.icon === "youtube" && (
              <YouTubeIcon sx={{ mr: 1 }} fontSize="small" />
            )}
            {link.icon && link.icon === "email" && (
              <EmailIcon sx={{ mr: 1 }} fontSize="small" />
            )}
            {lookupLanguageString(link.name, i18n.language)}
          </Link>
        ))}
    </Stack>
  );
};

export default Footer;
