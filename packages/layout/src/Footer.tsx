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
import { Button } from "@mui/material";

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
                <FooterContent
                  {...item}
                  align={columnsBottom - 1 === i ? "right" : undefined}
                  bottom={true}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

const FooterContent = ({
  header,
  links,
  freetext,
  image,
  align,
  bottom,
}: FooterContent) => {
  const { i18n } = useTranslation();

  const renderIcon = (icon?: string) => {
    if (!icon) return null;

    switch (icon) {
      case "twitter":
        return <TwitterIcon sx={{ mr: 1 }} fontSize="small" />;
      case "youtube":
        return <YouTubeIcon sx={{ mr: 1 }} fontSize="small" />;
      case "email":
        return <EmailIcon sx={{ mr: 1 }} fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <Stack direction="column" alignItems="start">
      {header && (
        <Typography variant="h6">
          {lookupLanguageString(header, i18n.language)}
        </Typography>
      )}
      {image && <img src={image.src} alt={image.alt} width={image.width} />}
      {freetext && (
        <Box
          sx={{
            a: {
              color: "footerBottom.link",
              textDecoration: "none",
            },
            textAlign: {
              xs: bottom ? "center" : "left",
              md: align || "left",
              width: "100%",
            },
            color: "footerBottom.contrastText",
          }}
        >
          {parse(lookupLanguageString(freetext, i18n.language) as string)}
        </Box>
      )}
      {links &&
        links.map((item, j) => {
          // Type guard: check if item has onClick property (Button)
          if ("onClick" in item) {
            return (
              <Button
                key={`button-${j}`}
                onClick={item.onClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  textTransform: "none",
                  padding: 0,
                  minWidth: "auto",
                  justifyContent: "flex-start",
                  fontWeight: 400,
                  // Font 13 px in rem
                  fontSize: 16,
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                {renderIcon(item.icon)}
                {lookupLanguageString(item.name, i18n.language)}
              </Button>
            );
          } else {
            // It's a Link
            return (
              <Link
                href={item.link}
                underline="none"
                target="_blank"
                key={`link-${j}`}
                sx={{ display: "flex", alignItems: "center" }}
              >
                {renderIcon(item.icon)}
                {lookupLanguageString(item.name, i18n.language)}
              </Link>
            );
          }
        })}
    </Stack>
  );
};

export default Footer;
