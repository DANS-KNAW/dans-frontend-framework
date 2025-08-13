import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createTheme } from "@mui/material/styles";
import grey from "@mui/material/colors/grey";

const customTheme = createTheme({
  palette: {
    primary: {
      light: "#0095c9",
      main: "#007ea9",
      dark: "#006F94",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
    footerBottom: {
      main: grey[400],
      light: grey[300],
      dark: grey[500],
      contrastText: grey[700],
      link: "#006F94",
    },
  },
  typography: {
    h1: {
      fontSize: "2.5rem",
      fontWeight: 500,
      marginTop: "2rem",
      marginBottom: "1rem",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
      marginBottom: "1rem",
    },
    h3: {
      fontSize: "1.8rem",
      fontWeight: 500,
      marginBottom: "1rem",
    },
    h4: {
      fontSize: "1.4rem",
      fontWeight: 500,
      marginBottom: "1rem",
    },
    h5: {
      fontSize: "1.15rem",
      fontWeight: 500,
      marginBottom: "0.5rem",
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
      marginBottom: "0.25rem",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          color: "white",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        colorDefault: {
          backgroundColor: grey[300],
          color: "black",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "#005673",
          "&:hover": {
            textDecoration: "underline",
          },
        },
      },
    },
  },
});

export default customTheme;
