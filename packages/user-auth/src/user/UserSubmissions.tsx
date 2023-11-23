import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
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
import type { SubmissionResponse, TargetOutput } from '../types';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Tooltip from '@mui/material/Tooltip';

export const UserSubmissions = ({depositSlug}: {depositSlug?: string;}) => {
  const [ skip, setSkip ] = useState<boolean>(false);
  const { t } = useTranslation('user');
  const siteTitle = useSiteTitle();
  const auth = useAuth();

  // Fetch the users submitted/saved forms, every 10 sec, to update submission status
  const { data, isLoading } = useFetchUserSubmissionsQuery(auth.user?.profile.sub, {
    pollingInterval: 10000,
    skip: skip,
  });

  // are there any targets that have been submitted not complete yet?
  const allTargetsComplete = data && data.filter( 
    d => d['release-version'] === 'PUBLISH' 
  ).every(
    // if all are finished, or one has an error, stop checking
    d => (d.targets.every(t => t['ingest-status'] === 'finish') || d.targets.some(t => t['ingest-status'] === 'error'))
  );

  console.log(data)

  // if all targets are complete, skip further fetching
  useEffect( () => {
    allTargetsComplete && setSkip(true);
  }, [allTargetsComplete]);

  useEffect( () => { 
    setSiteTitle(siteTitle, t('userSubmissions'));
  }, [siteTitle, name]);

  return (
    <Container>
      <Grid container>
        <Grid xs={12} mdOffset={1} md={10}>
          <Typography variant="h1">{t('userSubmissions')}</Typography>
          <SubmissionList 
            data={data?.filter( d => d['release-version'] === 'DRAFT' ) || []}
            type="draft"
            isLoading={isLoading} 
            header={t('userSubmissionsDrafts')}
            depositSlug={depositSlug}
          />
          <SubmissionList 
            data={data?.filter( d => d['release-version'] === 'PUBLISH' ) || []} 
            type="published"
            isLoading={isLoading} 
            header={t('userSubmissionsCompleted')}
          />
        </Grid>
      </Grid>
    </Container>
  )
}

const SubmissionList = ({ 
  data, 
  isLoading, 
  header, 
  type,
  depositSlug = 'deposit'
}: { 
  data: SubmissionResponse[];
  isLoading: boolean; 
  header: string;
  type: 'draft' | 'published';
  depositSlug?: string;
}) => {
  const { t, i18n } = useTranslation('user');
  const navigate = useNavigate();

  // useMemo to make sure columns don't change
  const columns = useMemo<GridColDef[]>(
    () => [
      ...type === 'draft' ?
      [{ 
        field: 'viewLink', 
        headerName: '', 
        width: 30,
        getActions: (params: any) => [
          <GridActionsCellItem
            icon={<EditIcon />}
            label={t('editItem')}
            onClick={() => navigate(`/${depositSlug}?id=${params.row.id}`)}
          />
        ],
        type: 'actions',
      }] : [],
      { 
        field: 'title', 
        headerName: t('title'), 
        width: 250,
        renderCell: (params) => params.value ? params.value : t('noTitle'),
      },
      { 
        field: 'created', 
        headerName: type === 'draft' ? t('createdOn') : t('submittedOn'), 
        width: 200,
        type: 'dateTime',
        valueGetter: (params) => new Date(params.value),
        renderCell: (params) => moment(params.value).format('D-M-Y - HH:mm'),
      },
      ...type === 'published' ? [{ 
        field: 'status', 
        headerName: t('submissionStatus'),
        width: 250,
        renderCell: (params: any) => 
          <Stack direction="column" pt={0.5} pb={0.5}>
            {params.value.map( (v: TargetOutput, i: number)  => 
              <Stack direction="row" alignItems="center" key={i} pt={0.1} pb={0.1}>
                <Tooltip title={t(v['ingest-status'] ? v['ingest-status'] : 'pending')} placement="left">
                  {
                    v['ingest-status'] === 'processing' ?
                    <CircularProgress size={16} /> :
                    v['ingest-status'] === 'error' ?
                    <ErrorIcon fontSize="small" color="error" /> :
                    v['ingest-status'] === 'finish' ?
                    <CheckCircleIcon fontSize="small" color="success" /> :
                    <PendingIcon fontSize="small" color="neutral" />
                  }
                </Tooltip>
                <Typography variant="body2" ml={1}>{v['target-repo-display-name']}</Typography>
              </Stack>
            )}
          </Stack>
      }] : [],
    ], 
  [i18n.language]);

  const rows = data && data.map( d => ({
    // Todo: API needs work and standardisation, also see types.
    id: d['metadata-id'],
    // viewLink: '',
    created: type === 'draft' ? d['created-date'] : d['submitted-date'],
    title: d['title'],
    ...type === 'published' ? {status: d['targets']} : null,
  }));

  return (
    <>
      <Typography sx={{ mt: 4, mb: 1 }} variant="h5">
        {header}
      </Typography>

      <Paper sx={{height: data.length === 0 ? 160 : 'auto', width: '100%'}}>
        <DataGrid
          loading={isLoading}
          slots={{ 
            columnMenu: CustomColumnMenu,
            loadingOverlay: LinearProgress,
            noRowsOverlay: () => <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>{t('noRows')}</Box>
          }}
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
          }}
          pageSizeOptions={[25, 50, 100]}
          getRowHeight={() => type === 'published' ? 'auto' : 45}
          sx={{
            // disable cell outlines
            ".MuiDataGrid-columnHeader:focus-within, .MuiDataGrid-cell:focus-within": {
               outline: "none !important",
            },
            // padding for auto height rows
            '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '8px' },
         }}
        />
      </Paper>

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