import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Grid from "@mui/material/Unstable_Grid2";
import Container from '@mui/material/Container';

function ActionCard({ title, content, link }: { title: string; content: string; link?: string }) {
  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {content}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}


export default function Dashboard() {
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid xs={12} md={6} lg={3}>
          <ActionCard title="View assessments" content="" />
        </Grid>
        <Grid xs={12} md={6} lg={3}>
          <ActionCard title="Perform an assessment" content="" />
        </Grid>
        <Grid xs={12} md={6} lg={3}>
          <ActionCard title="FAIR Guidance" content="" />
        </Grid>
        <Grid xs={12} md={6} lg={3}>
          <ActionCard title="Manage your profile" content="" link="/user-settings" />
        </Grid>
      </Grid>
    </Container>
  );
}