import { useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useTranslation } from 'react-i18next';
import List from '@mui/material/List';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ErrorIcon from '@mui/icons-material/Error';
import Divider from '@mui/material/Divider';
import moment from 'moment';
import ListSubheader from '@mui/material/ListSubheader';
import { useSiteTitle, setSiteTitle } from '@dans-framework/utils';

const fakeDrafts = [
  {
    id: '1',
    date: moment().subtract(1, 'hours').format('MMMM Do YYYY, h:mm:ss'),
    draft: true,
  },
  {
    id: '2',
    date: moment().subtract(1, 'days').format('MMMM Do YYYY, h:mm:ss'),
    draft: true,
  }
];

const fakeSubmissions = [
  {
    id: '1',
    date: moment().subtract(2, 'days').format('MMMM Do YYYY, h:mm:ss'),
    error: true,
  },
  {
    id: '2',
    date: moment().subtract(5, 'days').format('MMMM Do YYYY, h:mm:ss'),
    error: false,
  },
  {
    id: '3',
    date: moment().subtract(10, 'days').format('MMMM Do YYYY, h:mm:ss'),
    error: false,
  }
]

export const UserSubmissions = () => {
  const { t } = useTranslation('user');
  const siteTitle = useSiteTitle();

  useEffect( () => { 
    setSiteTitle(siteTitle, t('userSubmissions'));
  }, [siteTitle, name]);

  return (
    <Container>
      <Grid container>
        <Grid xs={12} mdOffset={2.5} md={7}>
          <Typography variant="h1">{t('userSubmissions')}</Typography>
          <SubmissionList list={fakeDrafts} header={t('userSubmissionsDrafts')} />
          <SubmissionList list={fakeSubmissions} header={t('userSubmissionsCompleted')} />
        </Grid>
      </Grid>
    </Container>
  )
}

const SubmissionList = ({ list, header }: { list: { id: string, date: string, error?: boolean; draft?: boolean }[], header: string; }) => {
  const { t } = useTranslation('user');
  return (
    <List 
      sx={{ width: '100%', bgcolor: 'background.paper', mb: 2 }} 
      subheader={<ListSubheader>{header}</ListSubheader>}
    >
      {list.map((item, index) => 
        <ListItem
          key={item.id}
          secondaryAction={item.error ? <Tooltip title={t('errorSubmission')}><ErrorIcon color="error" /></Tooltip> : undefined }
          disablePadding
        >
          <ListItemButton>
            <ListItemIcon>
              {
                item.error || item.draft ? 
                <Tooltip title={t('editSubmission')}><EditIcon /></Tooltip> : 
                <Tooltip title={t('viewSubmission')}><VisibilityIcon /></Tooltip>
              }
            </ListItemIcon>
            <ListItemText
              primary={item.date}
              secondary={
                item.error ?
                t('retrySubmission') :
                item.draft ?
                t('continueSubmission', {percent: 15}) :
                t('viewSubmissionExtended', {location: 'Dataverse'})
              }
            />
          </ListItemButton>
        </ListItem>
      )}
    </List>
  )
}