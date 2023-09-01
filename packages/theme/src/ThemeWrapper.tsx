import type { ReactNode } from 'react';
import { ThemeProvider, createTheme, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { deepmerge } from '@mui/utils';
import { theme as baseTheme } from './theme'; 
import { SnackbarProvider } from 'notistack';

export const ThemeWrapper = ({theme, children}: {theme: Partial<Theme>, children: ReactNode}) => {
  const customTheme = createTheme(deepmerge(baseTheme, theme));
  return (
    <ThemeProvider theme={customTheme}>
      {/* Needed for CSS normalisation */}
      <CssBaseline />
      <SnackbarProvider />
      {children}
    </ThemeProvider>
  )
}