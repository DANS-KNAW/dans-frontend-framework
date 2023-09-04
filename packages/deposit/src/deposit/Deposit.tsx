import { useEffect } from 'react';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Metadata from '../features/metadata/Metadata';
import Files from '../features/files/Files';
import type { TabPanelProps, TabHeaderProps } from '../types/Deposit';
import type { FormConfig } from '../types/Metadata';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { getMetadataStatus, getSessionId, getOpenTab, setOpenTab } from '../features/metadata/metadataSlice';
import { getFiles } from '../features/files/filesSlice';
import { StatusIcon } from '../features/generic/Icons';
import Submit from '../features/submit/Submit';
import { useTranslation, Trans } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { initForm } from '../features/metadata/metadataSlice';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { setData } from './depositSlice';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { fetchUserProfile } from '@dans-framework/auth';
import { useSiteInfo, setTitle, lookupLanguageString } from '@dans-framework/utils';
import type { Page } from '@dans-framework/pages';
import { useAuth } from 'react-oidc-context';

const Deposit = ({ config, page }: {config: FormConfig, page: Page}) => {
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const sessionId = useAppSelector(getSessionId);
  const openTab = useAppSelector(getOpenTab);
  const { t, i18n } = useTranslation('generic');
  const siteInfo = useSiteInfo();

  // set page title
  useEffect( () => { 
    setTitle(siteInfo.name, lookupLanguageString(page.name, i18n.language) as string);
  }, [siteInfo.name, name, i18n.language]);

  // We import this function from the Auth library. Don't have to add it to the Deposit store this way.
  const { data: userData } = fetchUserProfile({provider: auth.user?.profile.iss as string, id: auth.user?.profile.aud as string});

  // Initialize form on initial render when there's no sessionId yet
  // or when form gets reset
  useEffect(() => {
    if (!sessionId) {
      dispatch(initForm(config.form));  
    }
  }, [dispatch, sessionId, config.form]);

  // Set init form props in redux
  useEffect(() => {
    dispatch(setData(config));
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Container>
        <Grid container>
          <Grid xs={12} mt={4}>
            {userData && config.target.filter(t => 
              (userData.attributes[t.authKey] && !userData.attributes[t.authKey][0]) || !userData.attributes[t.authKey]
            ).length > 0 &&
              // show a message if keys are missing
              <Alert severity="warning">
                <AlertTitle>{t('missingInfoHeader')}</AlertTitle>
                <Trans
                  i18nKey="generic:missingInfoText"
                  components={[<Link component={RouterLink} to="/user-settings" />]}
                />
              </Alert>
            }
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabHeader value={openTab} handleChange={(e, val) => dispatch(setOpenTab(val))} />
            </Box>
            <AnimatePresence initial={false}>
              <TabPanel value={openTab} index={0} key="tab1">
                <Metadata />
              </TabPanel>
              <TabPanel value={openTab} index={1} key="tab2">
                <Files />
              </TabPanel>
            </AnimatePresence>
          </Grid>
          <Grid xs={12} mt={4} display="flex" justifyContent="end" alignItems="center">
            <Submit />
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  )
}

// Put Tabheader into a separate component, to handle namespace loading and suspense
const TabHeader = ({value, handleChange}: TabHeaderProps) => {
  const { t } = useTranslation(['metadata', 'files']);
  const selectedFiles = useAppSelector(getFiles);
  const metadataStatus = useAppSelector(getMetadataStatus);

  return (
    <Tabs value={value} onChange={handleChange}>
      <Tab 
        label={t('heading', {ns: 'metadata'})} 
        icon={<StatusIcon status={metadataStatus} margin="r" />}
        iconPosition="start" />
      <Tab 
        label={t('heading', {ns: 'files'})} 
        icon={<StatusIcon status={selectedFiles.length > 0 ? 'success' : 'warning'} margin="r" />} 
        iconPosition="start" />
    </Tabs>
  )
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    value === index ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Box mt={2}>
          {children}
        </Box>
      </motion.div>
    ) : null
  );
}

export default Deposit;