import Grid from "@mui/material/Grid";
import FilesTable from "./FilesTable";
import FilesUpload from "./FilesUpload";

const Files = () => (
  <Grid container spacing={2}>
    <Grid size={{ xs: 12 }}>
      <FilesUpload />
    </Grid>
    <Grid size={{ xs: 12 }}>
      <FilesTable />
    </Grid>
  </Grid>
);

export default Files;
