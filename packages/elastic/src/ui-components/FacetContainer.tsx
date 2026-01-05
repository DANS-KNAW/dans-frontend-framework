import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface FacetContainerProps {
  label: string;
  children: React.ReactNode;
}

const FacetContainer: React.FC<FacetContainerProps> = ({ 
  label, 
  children,
}) => {
  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {label}
      </Typography>
      <Box>{children}</Box>
    </Paper>
  );
};

export default FacetContainer;