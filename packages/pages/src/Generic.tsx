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

const Generic = ({ ...props }: Page) => {
  const auth = useAuth();
  const { i18n } = useTranslation();

  return (
    <Container>
      <Grid container>
        <Grid 
          mdOffset={props.logo ? 4 : 2.5} 
          md={props.logo ? 4 : 7} 
          smOffset={props.logo ? 3 : 0} 
          sm={props.logo ? 6 : 12} 
          xs={props.logo ? 8 : 12} 
          xsOffset={props.logo ? 2 : 0}
        >
          <Typography variant="h1">
            {props.logo ? 
              <img src={props.logo} alt="OH-SMArt" title="OH-SMArt" /> :
              lookupLanguageString(props.name, i18n.language)
            }
          </Typography>
        </Grid>

        <Grid xs={12} mdOffset={2.5} md={7}>
          {props.content && 
            <div dangerouslySetInnerHTML={{__html: lookupLanguageString(props.content, i18n.language) || ''}} />
          }
          {props.action && 
            <Box mt={4} display="flex" justifyContent="center">
              {
                (props.action.restricted && auth.isAuthenticated) || !props.action.restricted ?
                <Link to={`/${props.action.link}`}>
                  <Button variant="contained" size="large">{lookupLanguageString(props.action.text, i18n.language)}</Button>
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