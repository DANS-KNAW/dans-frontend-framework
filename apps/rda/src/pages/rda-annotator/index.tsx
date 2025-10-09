import { lookupLanguageString } from "@dans-framework/utils";
import {
  Box,
  Button,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import annotatorLogo from "/annotator.jpeg?url";
import chromium from "/chromium.webp?url";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const RDAColor600 = "oklch(0.498 0.121 137.23)";
const RDAColor500 = "oklch(0.584 0.142 137.07)";

interface AnnotatorMetadata {
  version: string;
  chrome_zip_url: string;
  release_date: string;
  found_at: string;
  is_prerelease: boolean;
  file_size_bytes: string;
  sha256_digest: string;
  name: string;
}

const FeatureIcon = styled(Box)({
  position: "absolute",
  top: "0.25rem",
  left: "0.25rem",
  width: "1.5rem",
  height: "1.5rem",
  color: RDAColor600,
});

const StyledButton = styled(Button)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(2),
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 2),
  border: "1px solid #e5e7eb",
  backgroundColor: "white",
  color: "inherit",
  textTransform: "none",
  boxShadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    backgroundColor: "#f3f4f6",
    borderColor: RDAColor500,
  },
  "& img": {
    transition: "opacity 0.2s",
  },
  "&:hover img": {
    opacity: 0.8,
  },
}));

export default function RDAAnnotator() {
  const { i18n } = useTranslation();
  const [download, setDownload] = useState<AnnotatorMetadata | undefined>(
    undefined
  );

  useEffect(() => {
    (async () => {
      const response = await fetch(
        import.meta.env.VITE_ANNOTATOR_VERSION_ENDPOINT
      );
      if (!response.ok) {
        console.error("Failed to fetch annotator");
        return;
      }
      const data = await response.json();
      setDownload(data);
    })();
  }, [download]);

  const onDownload = () => {
    const link = document.createElement("a");
    link.href = download?.chrome_zip_url || "";
    link.download = download?.name || "";
    link.click();
  };
  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: { xs: 8, sm: 12 }, px: 3 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "3rem", sm: "4.5rem" },
            fontWeight: 600,
            letterSpacing: "-0.025em",
            textDecoration: "underline",
            textDecorationColor: RDAColor600,
            color: "#111827",
            textWrap: "balance",
          }}
        >
          RDA Annotator
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography
            sx={{
              mt: 3,
              fontSize: "1rem",
              lineHeight: 2,
              color: "#4b5563",
              maxWidth: "48rem",
              textWrap: "pretty",
            }}
          >
            {lookupLanguageString(
              {
                en: "The RDA Annotator is a browser extension that allows users to annotate and tag web-based resources, which contextualises and categorises the content. These annotations are then passed to the RDA Knowledge Base, where it can be accessed by other RDA community members. (see section 3.3 of the Annotator Guidelines)",
                nl: "De RDA Annotator is een browserextensie waarmee gebruikers webgebaseerde bronnen kunnen annoteren en taggen, waardoor de inhoud wordt gecontextualiseerd en gecategoriseerd. Deze annotaties worden vervolgens doorgegeven aan de RDA Knowledge Base, waar ze toegankelijk zijn voor andere leden van de RDA-gemeenschap. (zie sectie 3.3 van de Annotator-richtlijnen)",
              },
              i18n.language
            )}
          </Typography>
          <Typography
            sx={{
              mt: 3,
              fontSize: "1rem",
              lineHeight: 2,
              color: "#4b5563",
              maxWidth: "48rem",
              textWrap: "pretty",
            }}
          >
            {lookupLanguageString(
              {
                en: "Please refer to the Annotator Guidelines document in the Support Materials Drawer (clicking 'Support' in the bottom right).",
                nl: "Zie het document Annotator-richtlijnen in het Support Materials-lade (klik op 'Support' rechtsonder).",
              },
              i18n.language
            )}
          </Typography>
        </Box>
      </Container>

      <Box sx={{ overflow: "hidden", pb: 12 }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, lg: 4 } }}>
          <Grid
            container
            spacing={{ xs: 8, sm: 10 }}
            sx={{ mx: "auto", maxWidth: { xs: "42rem", lg: "none" } }}
          >
            <Grid item xs={12} lg={6} sx={{ order: { lg: 2 } }}>
              <Box sx={{ pt: { lg: 2 }, pl: { lg: 2 } }}>
                <Box sx={{ maxWidth: { lg: "32rem" } }}>
                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: { xs: "2.25rem", sm: "3rem" },
                      fontWeight: 600,
                      letterSpacing: "-0.025em",
                      textWrap: "pretty",
                      color: "#111827",
                      lineHeight: { xs: 1.11, sm: 1 },
                    }}
                  >
                    {lookupLanguageString(
                      {
                        en: "Why use the Annotator?",
                        nl: "Waarom de Annotator gebruiken?",
                      },
                      i18n.language
                    )}
                  </Typography>
                  <Box sx={{ mt: 5, maxWidth: { xs: "36rem", lg: "none" } }}>
                    <Box sx={{ position: "relative", pl: 4.5, mb: 4 }}>
                      <FeatureIcon>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          data-slot="icon"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          aria-hidden="true"
                          style={{ width: "100%", height: "100%" }}
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                          />
                        </svg>
                      </FeatureIcon>
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: 600,
                          color: "#111827",
                          fontSize: "1rem",
                          lineHeight: 1.75,
                        }}
                      >
                        {lookupLanguageString(
                          {
                            en: "Connect Research Resources.",
                            nl: "Verbind Onderzoeksbronnen.",
                          },
                          i18n.language
                        )}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "1rem",
                          lineHeight: 1.75,
                          color: "#4b5563",
                        }}
                      >
                        {" "}
                        {lookupLanguageString(
                          {
                            en: "Easily link web content to the RDA Graph and contribute to a growing knowledge network.",
                            nl: "Koppel webinhoud eenvoudig aan de RDA Graph en draag bij aan een groeiend kennissennetwerk.",
                          },
                          i18n.language
                        )}
                      </Typography>
                    </Box>
                    <Box sx={{ position: "relative", pl: 4.5, mb: 4 }}>
                      <FeatureIcon>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          data-slot="icon"
                          aria-hidden="true"
                          style={{ width: "100%", height: "100%" }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 6h.008v.008H6V6Z"
                          />
                        </svg>
                      </FeatureIcon>
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: 600,
                          color: "#111827",
                          fontSize: "1rem",
                          lineHeight: 1.75,
                        }}
                      >
                        {lookupLanguageString(
                          {
                            en: "Contextual Tagging.",
                            nl: "Contextuele Tagging.",
                          },
                          i18n.language
                        )}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "1rem",
                          lineHeight: 1.75,
                          color: "#4b5563",
                        }}
                      >
                        {" "}
                        {lookupLanguageString(
                          {
                            en: "Add meaningful metadata using established RDA vocabularies.",
                            nl: "Voeg betekenisvolle metadata toe met behulp van gevestigde RDA-vocabulaire.",
                          },
                          i18n.language
                        )}
                      </Typography>
                    </Box>
                    <Box sx={{ position: "relative", pl: 4.5 }}>
                      <FeatureIcon>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2.5"
                          stroke="currentColor"
                          data-slot="icon"
                          aria-hidden="true"
                          style={{ width: "100%", height: "100%" }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                          />
                        </svg>
                      </FeatureIcon>
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: 600,
                          color: "#111827",
                          fontSize: "1rem",
                          lineHeight: 1.75,
                        }}
                      >
                        {lookupLanguageString(
                          {
                            en: "Improved Discoverability.",
                            nl: "Verbeterde Vindbaarheid.",
                          },
                          i18n.language
                        )}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "1rem",
                          lineHeight: 1.75,
                          color: "#4b5563",
                        }}
                      >
                        {" "}
                        {lookupLanguageString(
                          {
                            en: "Make important research resources more findable for the entire research community.",
                            nl: "Maak belangrijke onderzoeksbronnen beter vindbaar voor de hele onderzoeksgemeenschap.",
                          },
                          i18n.language
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              lg={6}
              sx={{
                order: { lg: 1 },
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Box
                component="img"
                src={annotatorLogo}
                alt="Product screenshot"
                sx={{
                  width: { xs: "48rem", sm: "57rem" },
                  maxWidth: "none",
                  borderRadius: "0.75rem",
                  boxShadow:
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e5e7eb",
                  ring: "1px solid rgba(153, 161, 175, 0.1)",
                }}
              />
            </Grid>
          </Grid>
        </Container>

        <Container
          maxWidth="lg"
          sx={{ px: { xs: 3, lg: 4 }, pt: { xs: 12, sm: 16 } }}
        >
          <Grid
            container
            spacing={{ xs: 8, sm: 10 }}
            sx={{ mx: "auto", maxWidth: { xs: "42rem", lg: "none" } }}
          >
            <Grid item xs={12} lg={6}>
              <Box sx={{ pt: { lg: 2 }, pl: { lg: 2 } }}>
                <Typography
                  sx={{
                    mt: 1,
                    fontSize: { xs: "2.25rem", sm: "3rem" },
                    fontWeight: 600,
                    letterSpacing: "-0.025em",
                    textWrap: "pretty",
                    color: "#111827",
                    lineHeight: { xs: 1.11, sm: 1 },
                  }}
                >
                  {lookupLanguageString(
                    {
                      en: "How Does It Work?",
                      nl: "Hoe Werkt Het?",
                    },
                    i18n.language
                  )}
                </Typography>
                <List sx={{ mt: 4, maxWidth: "36rem", color: "#4b5563" }}>
                  <ListItem
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "flex-start",
                      px: 0,
                    }}
                  >
                    <Typography sx={{ color: RDAColor600 }}>1.</Typography>
                    <ListItemText
                      primary={lookupLanguageString(
                        {
                          en: "Install the extension in your browser.",
                          nl: "Installeer de extensie in je browser.",
                        },
                        i18n.language
                      )}
                      primaryTypographyProps={{ sx: { fontSize: "1rem" } }}
                    />
                  </ListItem>
                  <ListItem
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "flex-start",
                      px: 0,
                    }}
                  >
                    <Typography sx={{ color: RDAColor600 }}>2.</Typography>
                    <ListItemText
                      primary={lookupLanguageString(
                        {
                          en: "Navigate to any web page with relevant research content.",
                          nl: "Navigeer naar een webpagina met relevante onderzoeksinhoud.",
                        },
                        i18n.language
                      )}
                      primaryTypographyProps={{ sx: { fontSize: "1rem" } }}
                    />
                  </ListItem>
                  <ListItem
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "flex-start",
                      px: 0,
                    }}
                  >
                    <Typography sx={{ color: RDAColor600 }}>3.</Typography>
                    <ListItemText
                      primary={lookupLanguageString(
                        {
                          en: "Select text you want to annotate.",
                          nl: "Selecteer de tekst die je wilt annoteren.",
                        },
                        i18n.language
                      )}
                      primaryTypographyProps={{ sx: { fontSize: "1rem" } }}
                    />
                  </ListItem>
                  <ListItem
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "flex-start",
                      px: 0,
                    }}
                  >
                    <Typography sx={{ color: RDAColor600 }}>4.</Typography>
                    <ListItemText
                      primary={lookupLanguageString(
                        {
                          en: "Add context with metadata like title, date, and resource type.",
                          nl: "Voeg context toe met metadata zoals titel, datum en type bron.",
                        },
                        i18n.language
                      )}
                      primaryTypographyProps={{ sx: { fontSize: "1rem" } }}
                    />
                  </ListItem>
                  <ListItem
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "flex-start",
                      px: 0,
                    }}
                  >
                    <Typography sx={{ color: RDAColor600 }}>5.</Typography>
                    <ListItemText
                      primary={lookupLanguageString(
                        {
                          en: "Tag with vocabularies to connect to RDA working groups and interests.",
                          nl: "Tag met vocabulaire om verbinding te maken met RDA-werkgroepen en -interesses.",
                        },
                        i18n.language
                      )}
                      primaryTypographyProps={{ sx: { fontSize: "1rem" } }}
                    />
                  </ListItem>
                  <ListItem
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "flex-start",
                      px: 0,
                    }}
                  >
                    <Typography sx={{ color: RDAColor600 }}>6.</Typography>
                    <ListItemText
                      primary={lookupLanguageString(
                        {
                          en: "Submit your annotation to add it to the RDA Knowledge Base.",
                          nl: "Dien je annotatie in om deze toe te voegen aan de RDA Knowledge Base.",
                        },
                        i18n.language
                      )}
                      primaryTypographyProps={{ sx: { fontSize: "1rem" } }}
                    />
                  </ListItem>
                </List>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              lg={6}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  pt: { lg: 2 },
                  width: "100%",
                  maxWidth: { lg: "32rem" },
                  ml: { lg: "auto" },
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: { xs: "2.25rem", sm: "3rem" },
                      fontWeight: 600,
                      letterSpacing: "-0.025em",
                      textWrap: "pretty",
                      color: "#111827",
                      lineHeight: { xs: 1.11, sm: 1 },
                    }}
                  >
                    {lookupLanguageString(
                      {
                        en: "Getting Started",
                        nl: "Aan de slag",
                      },
                      i18n.language
                    )}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 3,
                      fontSize: "1rem",
                      lineHeight: 2,
                      color: "#4b5563",
                      maxWidth: "48rem",
                      textWrap: "pretty",
                    }}
                  >
                    {lookupLanguageString(
                      {
                        en: "Click below to download the latest version of the Annotator.",
                        nl: "Klik hieronder om de nieuwste versie van de Annotator te downloaden.",
                      },
                      i18n.language
                    )}
                  </Typography>
                  <Box sx={{ mt: 5 }}>
                    <StyledButton onClick={onDownload} fullWidth>
                      <Box
                        component="img"
                        src={chromium}
                        alt="Chromium"
                        sx={{ width: "3rem", height: "3rem" }}
                      />
                      <Typography>
                        {lookupLanguageString(
                          {
                            en: "Download for Chromium",
                            nl: "Download voor Chromium",
                          },
                          i18n.language
                        )}{" "}
                        {download && download.version}
                      </Typography>
                    </StyledButton>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
