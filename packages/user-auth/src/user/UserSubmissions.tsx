import { useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useTranslation } from 'react-i18next';
import List from '@mui/material/List';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ErrorIcon from '@mui/icons-material/Error';
import Divider from '@mui/material/Divider';
import moment from 'moment';
import { useSiteTitle, setSiteTitle } from '@dans-framework/utils';
import { useFetchUserSubmissionsQuery } from './userApi';
import { useAuth } from 'react-oidc-context';
import type { SubmissionResponse } from '../types';
import CircularProgress from '@mui/material/CircularProgress';

export const UserSubmissions = () => {
  const { t } = useTranslation('user');
  const siteTitle = useSiteTitle();
  const auth = useAuth();
  console.log(auth)

  const { data, isLoading } = useFetchUserSubmissionsQuery(auth.user?.profile.sub);

  console.log(data)

  useEffect( () => { 
    setSiteTitle(siteTitle, t('userSubmissions'));
  }, [siteTitle, name]);

  return (
    <Container>
      <Grid container>
        <Grid xs={12} mdOffset={2.5} md={7}>
          <Typography variant="h1">{t('userSubmissions')}</Typography>
          <SubmissionList data={[]} isLoading={false} header={t('userSubmissionsDrafts')} />
          <SubmissionList data={data || []} isLoading={isLoading} header={t('userSubmissionsCompleted')} />
        </Grid>
      </Grid>
    </Container>
  )
}

const columns: GridColDef[] = [
  { 
    field: 'viewLink', 
    headerName: '', 
    width: 60,
    renderCell: (params) => <Link href={params.value} target="_blank"><IconButton><VisibilityIcon /></IconButton></Link>,
    sortable: false,
    filterable: false,
    hideable: false,
  },
  { 
    field: 'created', 
    headerName: 'Created on', 
    width: 250,
    type: 'dateTime',
    valueGetter: (params) => new Date(params.value),
    renderCell: (params) => moment(params.value).calendar(),
  },
  { 
    field: 'target', 
    headerName: 'Submitted to',
    width: 300,
  },
];

const SubmissionList = ({ data, isLoading, header }: { data: SubmissionResponse[], isLoading: boolean; header: string; }) => {
  const { t } = useTranslation('user');

  const rows = data && data.map( d => ({
    id: d['metadata-id'],
    viewLink: d['target-url'],
    created: d['created-date'],
    target: d['target-repo-name'],
  }));

  return (
    <>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h5">
        {header}
      </Typography>
      {
        isLoading ?
        <CircularProgress /> :
        rows.length === 0 ?
        <Typography>{t('noData')}</Typography> :

        <Paper>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
          }}
          pageSizeOptions={[25, 50, 100]}
        />
        </Paper>
      }
    </>
  )
}