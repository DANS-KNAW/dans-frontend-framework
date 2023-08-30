import type { ReactNode } from 'react';
import { ThemeProvider, createTheme, Theme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import { theme as baseTheme } from './theme'; 

export const ThemeWrapper = ({theme, children}: {theme: Partial<Theme>, children: ReactNode}) => {
  const customTheme = createTheme(deepmerge(baseTheme, theme));
  return (
    <ThemeProvider theme={customTheme}>
      {children}
    </ThemeProvider>
  )
}