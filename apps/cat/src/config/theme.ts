import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createTheme } from "@mui/material/styles";

const customTheme = createTheme({
  palette: {
    primary: {
      light: "#000000",
      main: "#000000",
      dark: "gray;",
      contrastText: "#000000",
    },
    secondary: {
      light: "#000000",
      main: "#000000",
      dark: "#000000",
      contrastText: "#000000",
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
          backgroundColor: "white",
          color: "black",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        colorDefault: {
          backgroundColor: "white",
          color: "black",
        },
      },
    },
  },
});

export default customTheme;
