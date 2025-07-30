import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Grid from "@mui/material/Unstable_Grid2";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CreateIcon from '@mui/icons-material/Create';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from "react-router-dom";
import type { SvgIconComponent } from '@mui/icons-material';

function ActionCard({ title, content, link, icon: Icon }: { title: string; content: string; link: string; icon: SvgIconComponent }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardActionArea component={Link} to={link} sx={{ height: '100%' }}>
        <Box sx={{ backgroundColor: 'neutral.light', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 150 }}>
          <Icon color="neutral" sx={{ fontSize: '4rem' }} />
        </Box>
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
    <Container sx={{ mt: 6 }}>
      <Grid container spacing={2} alignItems="stretch">
        <Grid xs={12} md={6} lg={3}>
          <ActionCard title="View assessments" content="Overview of previously submitted assessments" icon={AssessmentIcon} link="/assessments" />
        </Grid>
        <Grid xs={12} md={6} lg={3}>
          <ActionCard title="Perform an assessment" content="Create a new FAIR assessment" icon={CreateIcon} link="/assessments/create" />
        </Grid>
        <Grid xs={12} md={6} lg={3}>
          <ActionCard title="FAIR Guidance" content="Find out what FAIR is all about" icon={MenuBookIcon} link="/guidance" />
        </Grid>
        <Grid xs={12} md={6} lg={3}>
          <ActionCard title="Manage your profile" content="Define your role and preferences" link="/user-settings" icon={PersonIcon} />
        </Grid>
      </Grid>
    </Container>
  );
}