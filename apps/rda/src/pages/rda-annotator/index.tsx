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

export default function RDAAnnotator() {
  const features = [
    "Install the extension in your browser",
    "Navigate to any web page with relevant research content",
    "Select text you want to annotate",
    "Add context with metadata like title, date, and resource type",
    "Tag with vocabularies to connect to RDA working groups and interests",
    "Submit your annotation to add it to the RDA Knowledge Base",
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
      <Typography variant="h1">RDA Annotator Extension</Typography>

      <Typography marginTop={5} variant="h2">
        What is the RDA Annotator?
      </Typography>
      <Typography>
        The RDA Annotator is a browser extension that allows users to annotate
        and tag web-based resources, which contextualises and categorises the
        content. These annotations are then passed to the RDA Knowledge Base,
        where it can be accessed by other RDA community members.
        <br />
        <br />
        <span>
          Download the Annotator using this link. For instructions on how to
          install and use the tool, please refer to this <Link target="_blank" href="https://dans-knaw.github.io/RDA-TIGER-PDFs/3.3.7%20-%20Annotator%20support%20documentation%20-%20v0.2.pdf">document</Link>
        </span>
      </Typography>

      <Typography marginTop={5} variant="h2">
        Why Use the RDA Annotator?
      </Typography>
      <List>
        <ListItem>
          <ListItemText>
            <strong>Connect Research Resources:</strong> Easily link web content
            to the RDA Graph and contribute to a growing knowledge network
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            <strong>Contextual Tagging:</strong> Add meaningful metadata using
            established RDA vocabularies
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>
            <strong>Improved Discoverability:</strong> Make important research
            resources more findable for the entire research community
          </ListItemText>
        </ListItem>
      </List>

      <Typography marginTop={5} variant="h2">
        How Does It Work?
      </Typography>

      <List sx={{ listStyleType: "decimal", pl: 4 }}>
        {features.map((feature, index) => (
          <ListItem key={index} sx={{ display: "list-item", padding: "4px 0" }}>
            <ListItemText primary={feature} />
          </ListItem>
        ))}
      </List>

      <Typography marginTop={5} variant="h2">
        Getting Started
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
          Chromium-based
        </Button>
      </Box>
    </Container>
  );
}
