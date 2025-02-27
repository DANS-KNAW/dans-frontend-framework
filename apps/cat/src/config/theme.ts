import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createTheme } from "@mui/material/styles";

const customTheme = createTheme({
  palette: {
    primary: {
      main: "#6B7280", // Slate Gray
    },
    secondary: {
      main: "#A78B71", // Warm Taupe
    },
    background: {
      default: "#F5F5F5", // Light Gray
      paper: "#FFFFFF", // White
    },
    text: {
      primary: "#333333", // Charcoal
      secondary: "#6B7280", // Muted Gray
    },
    error: {
      main: "#D97777", // Soft Brick Red
    },
    success: {
      main: "#5B9279", // Desaturated Green
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
});

export default customTheme;
