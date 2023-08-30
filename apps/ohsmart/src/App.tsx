import { Suspense } from 'react';
import { LanguageBar, MenuBar, Footer } from '@dans-framework/layout';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Deposit } from '@dans-framework/deposit';
import { Generic } from '@dans-framework/pages';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { SnackbarProvider } from 'notistack';
import type { Page } from '@dans-framework/pages';
import { AuthWrapper, AuthRoute, UserSettings, UserSubmissions, SignInCallback } from '@dans-framework/auth';

// Load config variables
import theme from './config/theme';
import footer from './config/footer';
import pages from './config/pages';
import languages from './config/languages';
import authProvider from './config/auth';
import form from './config/form';

const App = () => {
  const { i18n } = useTranslation();
  return (
    <AuthWrapper authProvider={authProvider}>
      <ThemeProvider theme={theme}>
        {/* Needed for CSS normalisation */}
        <CssBaseline />
        <BrowserRouter>
          {/* Need to pass along root i18n functions to the language bar */}
          <LanguageBar languages={languages} changeLanguage={i18n.changeLanguage} />
          <MenuBar pages={pages} />
          {/* Suspense to make sure languages can load first */}
          <Suspense fallback={
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
              <Skeleton height={600} width={900} />
            </Box>
          }>
            <Routes>
              <Route path="signin-callback" element={<SignInCallback />} />
              <Route path="user-settings" element={<AuthRoute><UserSettings targetKeyIdentifiers={form.targetKeyIdentifiers} /></AuthRoute>} />
              <Route path="user-submissions" element={<AuthRoute><UserSubmissions /></AuthRoute>} />
              {(pages as Page[]).map( page => {
                return (
                  <Route 
                    key={page.id} 
                    path={page.slug} 
                    element={
                      page.template === 'deposit' ? 
                      <AuthRoute>
                        <Deposit {...form} />
                      </AuthRoute> 
                      : 
                      <Generic {...page} />
                    } 
                  />
                )
              }
              )}
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Footer {...footer} />
        <SnackbarProvider />
      </ThemeProvider>
    </AuthWrapper>
  );
}

export default App;
