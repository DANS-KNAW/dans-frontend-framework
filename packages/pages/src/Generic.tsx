import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import type { Page } from './types';
import { lookupLanguageString } from '@dans-framework/utils/language';
import { useAuth } from 'react-oidc-context';
import { useTranslation } from 'react-i18next';
import { LoginButton } from '@dans-framework/auth';

const Generic = ({page}: {page: Page}) => {
  const auth = useAuth();
  const { i18n } = useTranslation();

  return (
    <Container>
      <Grid container>
        <Grid 
          mdOffset={page.logo ? 4 : 2.5} 
          md={page.logo ? 4 : 7} 
          smOffset={page.logo ? 3 : 0} 
          sm={page.logo ? 6 : 12} 
          xs={page.logo ? 8 : 12} 
          xsOffset={page.logo ? 2 : 0}
        >
          <Typography variant="h1">
            {page.logo ? 
              <img src={page.logo} alt="OH-SMArt" title="OH-SMArt" /> :
              lookupLanguageString(page.name, i18n.language)
            }
          </Typography>
        </Grid>

        <Grid xs={12} mdOffset={2.5} md={7}>
          {page.content && 
            <div dangerouslySetInnerHTML={{__html: lookupLanguageString(page.content, i18n.language) || ''}} />
          }
          {page.action && 
            <Box mt={4} display="flex" justifyContent="center">
              {
                (page.action.restricted && auth.isAuthenticated) || !page.action.restricted ?
                <Link to={`/${page.action.link}`}>
                  <Button variant="contained" size="large">{lookupLanguageString(page.action.text, i18n.language)}</Button>
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