import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
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

export default customTheme;