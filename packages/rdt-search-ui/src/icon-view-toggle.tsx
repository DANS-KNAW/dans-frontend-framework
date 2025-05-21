import { Box, Button, SvgIcon, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface IconViewToggleProps {
  dashRoute: string;
  resultRoute: string;
}

const IconViewToggle = ({ dashRoute, resultRoute }: IconViewToggleProps) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        justifyContent: "flex-end",
        marginBottom: "2rem",
      }}
    >
      <Tooltip title="Go to Dashboard View" arrow>
        <Button
          onClick={() => navigate(dashRoute)}
          size="large"
          aria-label="Dashboard View"
        >
          <SvgIcon
            sx={{ width: "2.5rem", height: "2.5rem" }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z"
            />
          </SvgIcon>
        </Button>
      </Tooltip>
      <Tooltip title="Go to Results View" arrow>
        <Button
          onClick={() => navigate(resultRoute)}
          size="large"
          aria-label="Results View"
        >
          <SvgIcon
            sx={{ width: "2.5rem", height: "2.5rem" }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </SvgIcon>
        </Button>
      </Tooltip>
    </Box>
  );
};

export default IconViewToggle;