import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createTheme } from "@mui/material/styles";
import grey from "@mui/material/colors/grey";

const customTheme = createTheme({
  palette: {
    primary: {
      light: "#4FC3F7",
      main: "#039BE5",
      dark: "#01579B",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
    success: {
      main: "#4CAF50",
    },
    warning: {
      main: "#FF8F00",
    },
    error: {
      main: "#D32F2F",
    },
  },
  typography: {
    h1: {
      fontSize: "2rem",
      fontWeight: 500,
      marginTop: "2rem",
      marginBottom: "1rem",
    },
    h2: {
      fontSize: "1.35rem",
      fontWeight: 500,
      marginBottom: "1rem",
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 500,
      marginBottom: "1rem",
    },
    h4: {
      fontSize: "1.15rem",
      fontWeight: 500,
      marginBottom: "1rem",
    },
    h5: {
      fontSize: "1rem",
      fontWeight: 500,
      marginBottom: "0.5rem",
    },
    h6: {
      fontSize: "0.9rem",
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
  },
});

export default customTheme;
