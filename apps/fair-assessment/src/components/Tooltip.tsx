import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import ListItemIcon from '@mui/material/ListItemIcon';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const StatusTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 0,
    boxShadow: theme.shadows[1],
  },
}));

export function TooltipWithIcon({ status, text, type }: { status: 'success' | 'error' | 'warning' | null, text: string, type: 'principle' | 'criterion' | 'test' }) {
  return (
    <StatusTooltip 
      title={
        <TooltipContent 
          text={text} 
          color={status}
          type={type}
        />
      }
    >
      <ListItemIcon sx={{ minWidth: 40 }}>
        <GuidanceIcons status={status} />
      </ListItemIcon>
    </StatusTooltip>
  )
}

function GuidanceIcons({ status }: { status: 'success' | 'error' | 'warning' | null }) {
  if (status === 'success') {
    return <CheckCircleIcon color="success" />;
  }
  if (status === 'error') {
    return <ErrorIcon color="error" />;
  }
  if (status === 'warning') {
    return <ErrorIcon color="warning" />;
  }
  return <HelpOutlineIcon color="disabled" />;
}

function TooltipContent ({ text, color, type }: { text: string, color: string | null, type: 'principle' | 'criterion' | 'test' }) {
  return (
    <>
       <Typography color="inherit" variant="body2" sx={{ p: 2 }}>{text}</Typography>
       {color && (
         <Box sx={{ px: 2, py: 1, backgroundColor: `${color}.main` }}>
           <Typography variant="body2" color="white" sx={{ fontSize: "0.75rem" }}>
              This {type} is marked as {color === "success" ? "passed" : color === "error" ? "failed" : "partially passed"}.
           </Typography>
         </Box>
       )}
    </>
  )
}