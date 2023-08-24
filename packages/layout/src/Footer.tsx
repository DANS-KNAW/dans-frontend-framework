import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import styles from './Footer.module.css';
import { useTranslation } from 'react-i18next';
import type { Footer as FooterType } from './types/Pages';
import { lookupLanguageString } from '@dans-framework/utils/language';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';

const Footer = ({content = {top: [], bottom: []}}) => {
  return (
    <>
      <Box
        sx={{
          bgcolor: 'neutral.main',
          mt: 8,
          pt: 4,
          pb: 4,
        }}
      >
        <Container>
          <Grid container columns={4} spacing={2}>
            {content.top.map( (item: FooterType, i) => 
              <Grid xs={4} sm={2} md={1} key={`footer-${i}`}>
                <FooterContent item={item} />
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
      <Box
        sx={{
          bgcolor: 'neutralDark.main',
          color: 'neutralDark.contrastText',
          pt: 4,
          pb: 4,
        }}
      >
        <Container>
          <Grid container columns={2}>
            {content.bottom.map( (item: FooterType, i) => 
              <Grid xs={2} md={1} key={i}>
                <FooterContent item={item} />
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
    </>
  )
}

const FooterContent = ({ item }) =>
  <Stack direction="column" alignItems="start">
    {item.header && 
      <h4>{lookupLanguageString(item.header, 'en')}</h4>
    }
    {item.links && item.links.map( (link, j) =>
      <Link href={link.link} underline="none" target="_blank" key={`link-${j}`} sx={{ display: 'flex', alignItems: 'center'}}>
        {link.icon && link.icon === 'twitter' && <TwitterIcon sx={{mr: 1}} fontSize="small" />}
        {link.icon && link.icon === 'youtube' && <YouTubeIcon sx={{mr: 1}} fontSize="small" />}
        {link.icon && link.icon === 'email' && <EmailIcon sx={{mr: 1}} fontSize="small" />}
        {lookupLanguageString(link.name, 'en')}
      </Link>
    )}
    {item.freetext && 
      <span dangerouslySetInnerHTML={{__html: lookupLanguageString(item.freetext, 'en') || '' }} className={styles.footerFreeText} />
    }
  </Stack>

export default Footer;