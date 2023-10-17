import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { ThemeWrapper } from '@dans-framework/theme';
import { LanguageBar, MenuBar, Footer } from '@dans-framework/layout';
import { Deposit } from '@dans-framework/deposit';
import { Generic, Page } from '@dans-framework/pages';
import { AuthWrapper, AuthRoute, UserSettings, UserSubmissions, SignInCallback } from '@dans-framework/user-auth';
import logo from './config/images/logo.png';
import { RdaSearch } from './pages/search';
import { RdaRecord } from './pages/record';

// import { AuthWrapper, AuthRoute, SignInCallback } from '@dans-framework/auth';
// import { UserSettings, UserSubmissions } from '@dans-framework/user';

// Load config variables
import theme from './config/theme';
import footer from './config/footer';
import pages from './config/pages';
import siteTitle from './config/siteTitle';
import languages from './config/languages';
import authProvider from './config/auth';
import form from './config/form';

const App = () => {
  const { i18n } = useTranslation();

  const createElementByTemplate = (page: Page) => {
    switch (page.template) {
      case 'dashboard':
        return <RdaSearch dashboard={{areas: ["indi date date date date", "indi rights rights lang lang", "pw pw wf restype reltype"]}} />;
      case 'search':
        return <RdaSearch />;
      case 'record':
        return <RdaRecord />;
      case 'deposit':
        return <AuthRoute><Deposit config={form} page={page} /></AuthRoute>;
      default:
        return <Generic {...page} />;
    }
  }

  return (
    <AuthWrapper authProvider={authProvider}>
      <ThemeWrapper theme={theme} siteTitle={siteTitle}>
        <BrowserRouter>
          {/* Need to pass along root i18n functions to the language bar */}
          <LanguageBar languages={languages} changeLanguage={i18n.changeLanguage} />
          <MenuBar pages={pages} logo={logo} />
          {/* Suspense to make sure languages can load first */}
          <Suspense fallback={
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
              <Skeleton height={600} width={900} />
            </Box>
          }>
            <Routes>
              <Route path="signin-callback" element={<SignInCallback />} />
              <Route path="user-settings" element={<AuthRoute><UserSettings target={form.targetCredentials} /></AuthRoute>} />
              <Route path="user-submissions" element={<AuthRoute><UserSubmissions /></AuthRoute>} />
              {(pages as Page[]).map( page => {
                return (
                  <Route 
                    key={page.id} 
                    path={page.slug} 
                    element={createElementByTemplate(page)} 
                  />
                )
              }
              )}
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Footer {...footer} />
      </ThemeWrapper>
    </AuthWrapper>
  );
}

export default App;