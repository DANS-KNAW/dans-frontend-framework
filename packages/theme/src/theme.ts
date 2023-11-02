import { createTheme } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';

export const theme = createTheme({
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
});

declare module '@mui/material/styles' {
  interface Palette {
    neutral?: Palette['primary'];
    footerTop?: Palette['primary'];
    footerBottom?: Palette['primary'];
  }

  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
    footerTop?: Palette['primary'];
    footerBottom?: Palette['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}

declare module '@mui/material/SvgIcon' {
  interface SvgIconPropsColorOverrides {
    neutral: true;
  }
}

