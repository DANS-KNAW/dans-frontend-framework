import { lookupLanguageString } from "@dans-framework/utils";
import {
  Box,
  Button,
  Container,
  Link,
  List,
  ListItemText,
  Typography,
} from "@mui/material";
import ListItem from "@mui/material/ListItem";
import { useTranslation } from "react-i18next";

export default function RDAAnnotator() {
  const { i18n } = useTranslation();

  const features = [
    {
      en: "Install the extension in your browser",
      nl: "Installeer de extensie in uw browser",
    },
    {
      en: "Navigate to any web page with relevant research content",
      nl: "Navigeer naar een webpagina met relevante onderzoeksinhoud",
    },
    {
      en: "Select text you want to annotate",
      nl: "Selecteer de tekst die u wilt annoteren",
    },
    {
      en: "Add context with metadata like title, date, and resource type",
      nl: "Voeg context toe met metadata zoals titel, datum en type bron",
    },
    {
      en: "Tag with vocabularies to connect to RDA working groups and interests",
      nl: "Tag met vocabularies om verbinding te maken met RDA-werkgroepen en -interesses",
    },
    {
      en: "Submit your annotation to add it to the RDA Knowledge Base",
      nl: "Dien uw annotatie in om deze toe te voegen aan de RDA Knowledge Base",
    },
  ];

  const onDownload = () => {
    const link = document.createElement("a");
    link.href =
      "https://github.com/DANS-KNAW/rda-annotator/releases/download/0.13.0/rawr_0.13.0.zip"; // Replace with the actual download URL
    link.download = "rawr_0.13.0.zip"; // Replace with the actual file name
    link.click();
  };

  return (
    <Container>
      <Typography variant="h1">
        {lookupLanguageString(
          { en: "RDA Annotator Extension", nl: "RDA Annotator Extensie" },
          i18n.language
        )}
      </Typography>

      <Typography marginTop={5} variant="h2">
        {lookupLanguageString(
          { en: "What is the RDA Annotator?", nl: "Wat is de RDA Annotator?" },
          i18n.language
        )}
      </Typography>
      <Typography>
        {lookupLanguageString(
          {
            en: "The RDA Annotator is a browser extension that allows users to annotate and tag web-based resources, which contextualises and categorises the content. These annotations are then passed to the RDA Knowledge Base, where it can be accessed by other RDA community members.",
            nl: "De RDA Annotator is een browserextensie waarmee gebruikers webgebaseerde bronnen kunnen annoteren en taggen, waardoor de inhoud wordt gecontextualiseerd en gecategoriseerd. Deze annotaties worden vervolgens doorgegeven aan de RDA Knowledge Base, waar ze toegankelijk zijn voor andere leden van de RDA-gemeenschap.",
          },
          i18n.language
        )}
        <br />
        <br />
        <span>
          {lookupLanguageString(
            {
              en: "Download the Annotator using this link. For instructions on how to install and use the tool, please refer to this",
              nl: "Download de Annotator met deze link. Voor instructies over hoe u de tool kunt installeren en gebruiken, verwijzen we naar dit",
            },
            i18n.language
          )}
          <Link
            target="_blank"
            href="https://dans-knaw.github.io/RDA-TIGER-PDFs/3.3.7%20-%20Annotator%20Guidelines%20-%20v0.3.pdf"
          >
            document
          </Link>
        </span>
      </Typography>

      <Typography marginTop={5} variant="h2">
        {lookupLanguageString(
          {
            en: "Why Use the RDA Annotator?",
            nl: "Waarom de RDA Annotator gebruiken?",
          },
          i18n.language
        )}
      </Typography>
      <List>
        <ListItem>
          <ListItemText>
            <strong>
              {lookupLanguageString(
                {
                  en: "Connect Research Resources:",
                  nl: "Verbind Onderzoeksbronnen:",
                },
                i18n.language
              )}
            </strong>{" "}
            <span>
              {lookupLanguageString(
                {
                  en: "Easily link web content to the RDA Graph and contribute to a growing knowledge network",
                  nl: "Verbind eenvoudig webinhoud met de RDA Graph en draag bij aan een groeiend kennisnetwerk",
                },
                i18n.language
              )}
            </span>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            <strong>
              {lookupLanguageString(
                {
                  en: "Contextual Tagging:",
                  nl: "Contextuele Tagging:",
                },
                i18n.language
              )}
            </strong>{" "}
            <span>
              {lookupLanguageString(
                {
                  en: "Add meaningful metadata using established RDA vocabularies",
                  nl: "Voeg betekenisvolle metadata toe met behulp van gevestigde RDA-woordenschatten",
                },
                i18n.language
              )}
            </span>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            <strong>
              {lookupLanguageString(
                {
                  en: "Improved Discoverability:",
                  nl: "Verbeterde Vindbaarheid:",
                },
                i18n.language
              )}
            </strong>{" "}
            <span>
              {lookupLanguageString(
                {
                  en: "Make important research resources more findable for the entire research community",
                  nl: "Zorg ervoor dat belangrijke onderzoeksbronnen beter vindbaar zijn voor de hele onderzoeksgemeenschap",
                },
                i18n.language
              )}
            </span>
          </ListItemText>
        </ListItem>
      </List>

      <Typography marginTop={5} variant="h2">
        {lookupLanguageString(
          { en: "How Does It Work?", nl: "Hoe Werkt Het?" },
          i18n.language
        )}
      </Typography>

      <List sx={{ listStyleType: "decimal", pl: 4 }}>
        {features.map((feature, index) => (
          <ListItem key={index} sx={{ display: "list-item", padding: "4px 0" }}>
            <ListItemText
              primary={lookupLanguageString(feature, i18n.language)}
            />
          </ListItem>
        ))}
      </List>

      <Typography marginTop={5} variant="h2">
        {lookupLanguageString(
          { en: "Getting Started", nl: "Aan de Slag" },
          i18n.language
        )}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Button onClick={onDownload} variant="contained" color="primary">
          {lookupLanguageString(
            { en: "Chromium-based", nl: "Gebaseerd op Chromium" },
            i18n.language
          )}
        </Button>
      </Box>
    </Container>
  );
}
