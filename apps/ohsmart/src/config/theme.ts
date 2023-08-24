import { createTheme } from '@mui/material/styles';
import grey from '@mui/material/colors/grey';

const customTheme = createTheme({
  palette: {
    primary: {
      light: '#E4F9FF',
      main: '#38a7d4',
      dark: '#1f97c8',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
    neutral: {
      main: grey[200],
      contrastText: 'black',
    },
    neutralDark: {
      main: grey[300],
      contrastText: grey[500],
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          // backgroundColor: grey[200],
          color: 'white',
        }
      }
    },
  }
});

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
    neutralDark: Palette['primary'];
  }

  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
    neutralDark: PaletteOptions['primary'];
  }
}

export default customTheme;