import { Box, Typography, Link, List, ListItem } from "@mui/material";

const RDAColor600 = "oklch(0.498 0.121 137.23)";

const AccessibilityStatement = () => {
  return (
    <Box
      sx={{
        bgcolor: "white",
        px: 3,
        py: 16,
        "@media (min-width: 1024px)": {
          px: 4,
        },
      }}
    >
      <Box
        sx={{
          mx: "auto",
          maxWidth: "48rem",
          "& > *:not(:last-child)": {
            mb: 6,
          },
          fontSize: "1rem",
          lineHeight: 1.75,
          color: "rgb(55, 65, 81)",
        }}
      >
        <Box>
          <Typography
            variant="h2"
            sx={{
              mb: 1,
              fontSize: "1.5rem",
              fontWeight: 700,
            }}
          >
            Accessibility Statement for RDA Knowledge Base
          </Typography>
          <Typography>
            This is an accessibility statement from{" "}
            <Link
              href="http://dans.knaw.nl/"
              sx={{
                textDecoration: "underline",
                color: RDAColor600,
              }}
            >
              KNAW-DANS
            </Link>
            .
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontSize: "1.25rem",
              fontWeight: 500,
            }}
          >
            Measures to support accessibility
          </Typography>
          <Typography>
            KNAW-DANS takes the following measures to ensure accessibility of
            RDA Knowledge Base:
          </Typography>
          <List
            role="list"
            sx={{
              listStyleType: "disc",
              ml: 2,
              pt: 3,
              "& > li:not(:last-child)": {
                mb: 1,
              },
            }}
          >
            <ListItem sx={{ display: "list-item" }}>
              Include accessibility throughout our internal policies.
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              Assign clear accessibility goals and responsibilities.
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              Employ formal accessibility quality assurance methods.
            </ListItem>
          </List>
        </Box>

        <Box>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontSize: "1.25rem",
              fontWeight: 500,
            }}
          >
            Conformance status
          </Typography>
          <Typography>
            The{" "}
            <Link
              href="https://www.w3.org/WAI/standards-guidelines/wcag/"
              sx={{
                textDecoration: "underline",
                color: RDAColor600,
              }}
            >
              Web Content Accessibility Guidelines (WCAG)
            </Link>{" "}
            defines requirements for designers and developers to improve
            accessibility for people with disabilities. It defines three levels
            of conformance: Level A, Level AA, and Level AAA. RDA Knowledge Base
            is fully conformant with WCAG 2.1 level AA. Fully conformant means
            that the content fully conforms to the accessibility standard
            without any exceptions.
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontSize: "1.25rem",
              fontWeight: 500,
            }}
          >
            Feedback
          </Typography>
          <Typography>
            We welcome your feedback on the accessibility of RDA Knowledge Base.
            Please let us know if you encounter accessibility barriers on RDA
            Knowledge Base:
          </Typography>
          <List
            role="list"
            sx={{
              listStyleType: "disc",
              ml: 2,
              py: 3,
            }}
          >
            <ListItem sx={{ display: "list-item" }}>
              If you have any questions or feedback, please contact us by
              clicking the "Help" button at the bottom right corner of{" "}
              <Link
                href="https://kb-rda.org"
                sx={{
                  textDecoration: "underline",
                  color: RDAColor600,
                }}
              >
                kb-rda.org
              </Link>
            </ListItem>
          </List>
          <Typography>
            We try to respond to feedback within 2 business days.
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontSize: "1.25rem",
              fontWeight: 500,
            }}
          >
            Technical specifications
          </Typography>
          <Typography>
            Accessibility of RDA Knowledge Base relies on the following
            technologies to work with the particular combination of web browser
            and any assistive technologies or plugins installed on your
            computer:
          </Typography>
          <List
            role="list"
            sx={{
              listStyleType: "disc",
              ml: 2,
              py: 3,
            }}
          >
            <ListItem sx={{ display: "list-item" }}>HTML</ListItem>
          </List>
          <Typography>
            These technologies are relied upon for conformance with the
            accessibility standards used.
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontSize: "1.25rem",
              fontWeight: 500,
            }}
          >
            Assessment approach
          </Typography>
          <Typography>
            KNAW-DANS assessed the accessibility of RDA Knowledge Base by the
            following approaches:
          </Typography>
          <List
            role="list"
            sx={{
              listStyleType: "disc",
              ml: 2,
              py: 3,
              "& > li:not(:last-child)": {
                mb: 1,
              },
            }}
          >
            <ListItem sx={{ display: "list-item" }}>
              External evaluation
            </ListItem>
            <ListItem sx={{ display: "list-item" }}>
              Using the WAVE Web Accessibility Evaluation Tool:{" "}
              <Link
                href="https://wave.webaim.org"
                sx={{
                  textDecoration: "underline",
                  color: RDAColor600,
                }}
              >
                https://wave.webaim.org
              </Link>
            </ListItem>
          </List>
        </Box>

        <Box>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontSize: "1.25rem",
              fontWeight: 500,
            }}
          >
            Formal complaints
          </Typography>
          <Typography>
            For any complaints, please contact us by clicking the "Help" button
            at the bottom right corner of{" "}
            <Link
              href="https://kb-rda.org"
              sx={{
                textDecoration: "underline",
                color: RDAColor600,
              }}
            >
              kb-rda.org
            </Link>
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontSize: "1.25rem",
              fontWeight: 500,
            }}
          >
            Date
          </Typography>
          <Typography>
            This statement was created on 10 October 2025 using the{" "}
            <Link
              href="https://www.w3.org/WAI/planning/statements/"
              sx={{
                textDecoration: "underline",
                color: RDAColor600,
              }}
            >
              W3C Accessibility Statement Generator Tool
            </Link>
            .
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AccessibilityStatement;
