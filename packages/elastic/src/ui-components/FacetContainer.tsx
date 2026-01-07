import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

interface FacetContainerProps {
  label: string;
  children: React.ReactNode;
}

const FacetContainer: React.FC<FacetContainerProps> = ({ 
  label, 
  children,
}) => {
  return (
    <Grid size={{ xs: 6, md: 4, lg: 3 }}>
      <Paper elevation={1} sx={{ p: 2, mb: 2, height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          {label}
        </Typography>
        <Box>
          {children}
        </Box>
      </Paper>
    </Grid>
  );
};

export default FacetContainer;