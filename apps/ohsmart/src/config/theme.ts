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
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      marginTop: '2rem',
      marginBottom: '1rem',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      marginBottom: '1rem',
    },
    h3: {
      fontSize: '1.8rem',
      fontWeight: 500,
      marginBottom: '1rem',
    },
    h4: {
      fontSize: '1.4rem',
      fontWeight: 500,
      marginBottom: '1rem',
    },
    h5: {
      fontSize: '1.15rem',
      fontWeight: 500,
      marginBottom: '0.5rem',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      marginBottom: '0.25rem',
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
    MuiAvatar: {
      styleOverrides: {
        colorDefault: {
           backgroundColor: grey[300],
           color: 'black'
         }
      }
    }
  }
});

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
    footerTop: Palette['primary'];
    footerBottom: Palette['primary'];
  }

  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
    footerTop: Palette['primary'];
    footerBottom: Palette['primary'];
  }
}

export default customTheme;