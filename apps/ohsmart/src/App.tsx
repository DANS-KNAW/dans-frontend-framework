import { Suspense } from 'react';
import { LanguageBar } from '@dans-framework/layout';
import { MenuBar } from '@dans-framework/layout';
import { Footer } from '@dans-framework/layout';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Generic from '@dans-framework/pages/Generic';
import Deposit from '@dans-framework/deposit';
// import { SignInCallback, AuthRoute } from '@dans-framework/Auth';
// import { UserSettings, UserSubmissions } from '@dans-framework/Auth';
// import NotificationList from '@dans-framework/Notification';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

// Load variables
import theme from './config/theme';
import footer from './config/footer';
import pages from './config/pages';
import formSections from './config/form';
import languages from './config/languages';

const formProps = {
  form: formSections,
  targetRepo: 'demo.ssh.datastations.nl',
  dataverseApiKeyIdentifier: 'dataverse_api_key', // key to use from Keycloak user object
  submitKey: import.meta.env.VITE_PACKAGING_KEY, // maybe not use .env file anymore?
  targetAuth: 'API_KEY',
  targetKey: import.meta.env.VITE_TARGET_KEY, // todo.. dataverse api key, get this from auth using dataverseApiKeyIdentifier, so not needed here anymore
  skipValidation: true,
  geonamesApiKey: 'dans_deposit_webapp',
  // Todo: also pass along the user profile
}

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <BrowserRouter>
          <LanguageBar languages={languages} />
          <MenuBar pages={pages} />
          <Suspense fallback={<Box sx={{display: 'flex', justifyContent: 'center'}}><Skeleton height={600} width={900} /></Box>}>
            <Routes>
              {/*<Route path="signin-callback" element={<SignInCallback />} />*/}
              {/*<Route path="user-settings" element={<AuthRoute><UserSettings /></AuthRoute>} />*/}
              {/*<Route path="user-submissions" element={<AuthRoute><UserSubmissions /></AuthRoute>} />*/}
              {pages.map( page => {
                return (
                  <Route 
                    key={page.id} 
                    path={page.slug} 
                    element={
                      page.template === 'deposit' && 
                      // <AuthRoute>
                        <Deposit {...formProps} />
                      // </AuthRoute> : 
                      // <Generic page={page} />
                    } 
                  />
                )
              }
              )}
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Footer content={footer} />
        {/*<NotificationList />*/}
    </ThemeProvider>
  );
}

export default App;
