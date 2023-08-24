import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Unstable_Grid2';
import FilesTable from './FilesTable';
import FilesUpload from './FilesUpload';

const Files = () => 
  <Grid container spacing={2}>
    <Grid xs={12}>
      <FilesUpload />
    </Grid>
    <Grid xs={12}>
      <FilesTable />
    </Grid>
  </Grid>

export default Files;