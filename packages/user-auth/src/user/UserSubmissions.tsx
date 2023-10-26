import { useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useTranslation } from 'react-i18next';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import { 
  DataGrid, 
  GridColDef, 
  GridActionsColDef, 
  GridValueGetterParams, 
  GridColumnMenuProps, 
  GridColumnMenu,
  GridActionsCellItem
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from '@mui/material/Box';
import moment from 'moment';
import { useSiteTitle, setSiteTitle } from '@dans-framework/utils';
import { useFetchUserSubmissionsQuery } from './userApi';
import { useAuth } from 'react-oidc-context';
import type { SubmissionResponse } from '../types';
import CircularProgress from '@mui/material/CircularProgress';

export const UserSubmissions = ({depositSlug}: {depositSlug: string;}) => {
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
        <Grid xs={12} mdOffset={1} md={10}>
          <Typography variant="h1">{t('userSubmissions')}</Typography>
          {/* Todo: <SubmissionList data={[]} isLoading={false} header={t('userSubmissionsDrafts')} />*/}
          <SubmissionList data={data || []} isLoading={isLoading} header={t('userSubmissionsCompleted')} depositSlug={depositSlug} />
        </Grid>
      </Grid>
    </Container>
  )
}

const SubmissionList = ({ 
  data, 
  isLoading, 
  header, 
  depositSlug = 'deposit'
}: { 
  data: SubmissionResponse[];
  isLoading: boolean; 
  header: string;
  depositSlug: string;
}) => {
  const { t } = useTranslation('user');
  const navigate = useNavigate();

  // useMemo to make sure columns don't change
  const columns = useMemo<GridColDef[]>(
    () => [
      { 
        field: 'viewLink', 
        headerName: '', 
        width: 100,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<VisibilityIcon />}
            label={t('viewItem')}
            onClick={() => window.open(params.row.viewLink, '_blank')}
          />,
          <GridActionsCellItem
            icon={<EditIcon />}
            label={t('editItem')}
            onClick={() => navigate(`/${depositSlug}?id=${params.row.id}`)}
          />
        ],
        type: 'actions',
      },
      { 
        field: 'title', 
        headerName: t('title'), 
        width: 250,
        renderCell: (params) => params.value ? params.value : t('noTitle'),
      },
      { 
        field: 'created', 
        headerName: t('createdOn'), 
        width: 250,
        type: 'dateTime',
        valueGetter: (params) => new Date(params.value),
        renderCell: (params) => moment(params.value).format('D-M-Y - HH:mm'),
      },
      { 
        field: 'target', 
        headerName: t('submittedTo'),
        width: 300,
      },
    ], 
  []);

  const rows = data && data.map( d => ({
    // Todo: API needs work and standardisation, also see types.
    id: d['metadata-id'],
    viewLink: d['target-url'],
    created: d['created-date'],
    title: '',
    target: d['target-repo-name'],
  }));

  return (
    <>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h5">
        {header}
      </Typography>
      {
        isLoading ?
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress /> 
        </Box> :
        rows.length === 0 ?
        <Typography>{t('noData')}</Typography> :
        <Paper>
          <DataGrid
            slots={{ columnMenu: CustomColumnMenu }}
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 25 },
              },
            }}
            pageSizeOptions={[25, 50, 100]}
            sx={{
              // disable cell outlines
              ".MuiDataGrid-columnHeader:focus-within, .MuiDataGrid-cell:focus-within": {
                 outline: "none !important",
              },
           }}
          />
        </Paper>
      }
    </>
  )
}

const CustomColumnMenu = (props: GridColumnMenuProps) => {
  return (
    <GridColumnMenu
      {...props}
      slots={{
        // Hide `columnMenuColumnsItem` - the manage columns function
        columnMenuColumnsItem: null,
      }}
    />
  );
}