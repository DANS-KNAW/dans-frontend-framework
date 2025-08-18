import { createTheme } from "@mui/material/styles";
import grey from "@mui/material/colors/grey";

const base = createTheme({
  palette: {
    neutral: {
      light: grey[300],
      main: grey[400],
      dark: grey[500],
      contrastText: grey[700],
    },
    footerTop: {
      main: grey[200],
      light: grey[100],
      dark: grey[300],
      contrastText: grey[800],
    },
    footerBottom: {
      main: grey[400],
      light: grey[300],
      dark: grey[500],
      contrastText: grey[500],
    },
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            opacity: 0.7,
          }
        }
      }
    }
  }
});

base.palette.footerBottom!.link = base.palette.primary.main;

export const theme = base;

declare module "@mui/material/styles" {
  interface PaletteColor {
    link?: string;
  }

  interface SimplePaletteColorOptions {
    link?: string;
  }

  interface Palette {
    neutral?: Palette["primary"];
    footerTop?: Palette["primary"];
    footerBottom?: PaletteColor;
  }

  interface PaletteOptions {
    neutral?: PaletteOptions["primary"];
    footerTop?: Palette["primary"];
    footerBottom?: SimplePaletteColorOptions;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}

declare module "@mui/material/SvgIcon" {
  interface SvgIconPropsColorOverrides {
    neutral: true;
  }
}
