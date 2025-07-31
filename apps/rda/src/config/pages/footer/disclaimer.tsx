import type { Page } from "@dans-framework/pages";
import { Box, Link, Typography } from "@mui/material";

const page: Page = {
  id: "disclaimer",
  name: "Disclaimer",
  slug: "disclaimer",
  template: "generic",
  inMenu: false,
  content: {
    en: (
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          py: 8,
          px: 3,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
        }}
      >
        <Box mb={4}>
          <Typography variant="h4" component="h2" gutterBottom>
            RDA TIGER Output Services Disclaimer
          </Typography>
          <Typography variant="body1" paragraph>
            The work of RDA TIGER is done in close collaboration with the
            Research Data Alliance (RDA). However, the RDA is in no way
            responsible for RDA TIGER outputs and services, including those
            described here, and provides no guarantees for their use and content
            (in particular, any user-generated content).
          </Typography>
          <Typography variant="body1" paragraph>
            The use of the RDA Logo is a registered trademark of the Research
            Data Alliance Foundation, the use of which is permitted the project
            under the{" "}
            <Link href="https://www.rd-alliance.org/rda-endorsement-and-logo-usage-guidelines/">
              Usage Guidelines
            </Link>{" "}
            available on the RDA Website. The EOSC logo is copyrighted by the
            EOSC Association, and the use of the logo for co-branding by
            EOSC-funded projects is permitted under the EOSC Association's{" "}
            <Link href="https://www.eosc.eu/sites/default/files/2022-09/EOSC%20Co-Branding%20Guidelines%20for%20HE%20INFRAEOSC%20Projects_HR.pdf">
              co-branding guidelines
            </Link>
            .
          </Typography>
        </Box>
        <Box
          sx={{
            borderTop: 1,
            borderColor: "grey.300",
            pt: 2,
            mt: 6,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography variant="caption" sx={{ display: "block" }}>
            Effective Date: July, 2025
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", textAlign: { xs: "left", sm: "right" } }}
          >
            © RDA Tiger
          </Typography>
        </Box>
      </Box>
    ),
    nl: (
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          py: 8,
          px: 3,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontFamily: "serif", fontWeight: 600, mb: 1 }}
        >
          Disclaimer
        </Typography>
        <Box mb={4}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontFamily: "serif" }}
          >
            RDA TIGER / Research Data Alliance
          </Typography>
          <Typography variant="body1" paragraph>
            Het werk van RDA TIGER wordt in nauwe samenwerking met de Research
            Data Alliance (RDA) uitgevoerd. De RDA is echter op geen enkele
            wijze verantwoordelijk voor de resultaten en diensten van RDA TIGER,
            inclusief de hier beschreven diensten, en biedt geen garanties voor
            het gebruik en de inhoud ervan (in het bijzonder
            gebruikersgegenereerde inhoud).
          </Typography>
          <Typography variant="body1" paragraph>
            Het gebruik van het RDA-logo is een geregistreerd handelsmerk van de
            Research Data Alliance Foundation, waarvan het gebruik door het
            project is toegestaan onder de{" "}
            <Link href="https://www.rd-alliance.org/rda-endorsement-and-logo-usage-guidelines/">
              Gebruikersrichtlijnen
            </Link>{" "}
            beschikbaar op de RDA-website. Het EOSC-logo is auteursrechtelijk
            beschermd door de EOSC Association, en het gebruik van het logo voor
            co-branding door EOSC-gesubsidieerde projecten is toegestaan onder
            de{" "}
            <Link href="https://www.eosc.eu/sites/default/files/2022-09/EOSC%20Co-Branding%20Guidelines%20for%20HE%20INFRAEOSC%20Projects_HR.pdf">
              co-branding richtlijnen
            </Link>{" "}
            van de EOSC Association.
          </Typography>
        </Box>
        <Box
          sx={{
            borderTop: 1,
            borderColor: "grey.300",
            pt: 2,
            mt: 6,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography variant="caption" sx={{ display: "block" }}>
            Ingangsdatum: juli 2025
          </Typography>
          <Typography
            variant="caption"
            sx={{ display: "block", textAlign: { xs: "left", sm: "right" } }}
          >
            © Research Data Alliance
          </Typography>
        </Box>
      </Box>
    ),
  },
};

export default page;
