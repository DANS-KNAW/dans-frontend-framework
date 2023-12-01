import type { ReactNode } from "react";
import { ThemeProvider, createTheme, Theme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { deepmerge } from "@mui/utils";
import { theme as baseTheme } from "./theme";
import { SnackbarProvider } from "notistack";
import { SiteTitleProvider, CustomError } from "@dans-framework/utils";

export const ThemeWrapper = ({
  theme,
  siteTitle,
  children,
}: {
  theme: Partial<Theme>;
  siteTitle: string;
  children: ReactNode;
}) => {
  const customTheme = createTheme(deepmerge(baseTheme, theme));
  return (
    <ThemeProvider theme={customTheme}>
      {/* Provider to make sure we can set proper page title info when switching routes */}
      <SiteTitleProvider value={siteTitle}>
        {/* Needed for CSS normalisation */}
        <CssBaseline />
        {/* Component for showing feedback popups */}
        <SnackbarProvider Components={{ customError: CustomError }} />
        {children}
      </SiteTitleProvider>
    </ThemeProvider>
  );
};
