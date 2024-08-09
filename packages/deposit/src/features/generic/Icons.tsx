import InfoIcon from "@mui/icons-material/Info";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useTranslation } from "react-i18next";
import type { StatusIconProps } from "../../types/Generic";
import { LightTooltip } from "./Tooltip";
import parse, { domToReact } from "html-react-parser";

const titleStyle = {
  fontSize: 14,
}

// Convert a HTML string to MUI components using html react parser
export const parseOptions = {
  replace: ({ name, children, data }: any) => {
    if (data && !children) {
      return (
        <Typography sx={titleStyle} gutterBottom>
          {data}
        </Typography>
      );
    }
    if (name === 'ul') {
      return (
        <ul>
          {domToReact(children, parseOptions)}
        </ul>
      )
    }
    if (name === 'li') {
      return (
        <li>
          <Typography sx={titleStyle}>
            {domToReact(children, parseOptions)}
          </Typography>
        </li>
      )
    }
    return (
      <Typography sx={titleStyle} gutterBottom>
        {domToReact(children, parseOptions)}
      </Typography>
    );
  },
};

export const StatusIcon = ({
  status,
  title,
  subtitle,
  margin,
}: StatusIconProps) => {
  const { t } = useTranslation("generic");
  const iconSx = {
    cursor: "help",
    mr: margin && margin.includes("r") ? 1 : 0,
    ml: margin && margin.includes("l") ? 1 : 0,
    mt: margin && margin.includes("t") ? 2 : 0,
  };

  return (
    <LightTooltip
      title={
        <>
          {title && (
            <Box sx={{
              pt: 2,
              pl: 2,
              pr: 2,
              pb: 1,
              fontSize: 14,
            }}>
              {parse(title, parseOptions)}
            </Box>
          )}
          {subtitle && (
            <Typography
              sx={{
                fontSize: 12,
                pt: title ? 0 : 2,
                pl: 2,
                pr: 2,
                pb: 2,
              }}
            >
              {subtitle}
            </Typography>
          )}
          <Typography
            sx={{
              fontSize: 12,
              pl: 2,
              pr: 2,
              pb: 1,
              pt: 1,
              backgroundColor: `${status}.main`,
            }}
          >
            {t(status as string)}
          </Typography>
        </>
      }
    >
      {status === "error" ?
        <ErrorIcon sx={iconSx} color={status} />
      : status === "warning" || status === "neutral" ?
        <InfoIcon sx={iconSx} color={status} />
      : <CheckCircleIcon sx={iconSx} color={status} />}
    </LightTooltip>
  );
};
