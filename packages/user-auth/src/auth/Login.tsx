import { useTranslation } from "react-i18next";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { LoginButton } from "../user/Buttons";

export const LoginPage = () => {
  const { t } = useTranslation(["auth", "user"]);
  return (
    <Container>
      <Grid container>
        <Grid mdOffset={2.5} md={7} xs={12}>
          <Typography variant="h1" sx={{ textAlign: "center" }}>
            {t("login", { ns: "user" })}
          </Typography>
        </Grid>

        <Grid xs={12} mdOffset={2.5} md={7}>
          <Typography sx={{ textAlign: "center" }}>
            {t("loginMessage", { ns: "auth" })}
          </Typography>
          <Box mt={4} display="flex" justifyContent="center">
            <LoginButton variant="contained" />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
