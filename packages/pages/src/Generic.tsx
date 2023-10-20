import { useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import type { Page } from './types';
import { lookupLanguageString } from '@dans-framework/utils';
import { useAuth } from 'react-oidc-context';
import { useTranslation } from 'react-i18next';
import { LoginButton } from '@dans-framework/user-auth';
import { useSiteTitle, setSiteTitle } from '@dans-framework/utils';
import parse from 'html-react-parser';

const Generic = ({ logo, name, content, action }: Page) => {
  const auth = useAuth();
  const { i18n } = useTranslation();
  const siteTitle = useSiteTitle();

  useEffect( () => { 
    setSiteTitle(siteTitle, lookupLanguageString(name, i18n.language));
  }, [siteTitle, name]);

  return (
    <Container>
      <Grid container>
        <Grid 
          mdOffset={logo ? 4 : 2.5} 
          md={logo ? 4 : 7} 
          smOffset={logo ? 3 : 0} 
          sm={logo ? 6 : 12} 
          xs={logo ? 8 : 12} 
          xsOffset={logo ? 2 : 0}
        >
          <Typography variant="h1" sx={{textAlign: 'center'}}>
            {logo ? 
              <img src={logo} alt="RDA" title="RDA" /> :
              lookupLanguageString(name, i18n.language)
            }
          </Typography>
        </Grid>

        <Grid xs={12} mdOffset={2.5} md={7}>
          {content && 
            <Box>
              {parse(lookupLanguageString(content, i18n.language) || '')}
            </Box>
          }
          {action && 
            <Box mt={4} display="flex" justifyContent="center">
              {
                (action.restricted && auth.isAuthenticated) || !action.restricted ?
                <Link to={`/${action.link}`}>
                  <Button variant="contained" size="large">{lookupLanguageString(action.text, i18n.language)}</Button>
                </Link>:
                <LoginButton variant="contained" />
              }
            </Box>
          }
        </Grid>
      </Grid>
    </Container>
  )
}

export default Generic;