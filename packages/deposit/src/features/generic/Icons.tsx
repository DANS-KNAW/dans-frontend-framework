import InfoIcon from '@mui/icons-material/Info';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useTranslation } from 'react-i18next';
import type { StatusIconProps } from '../../types/Generic';
import { LightTooltip } from './Tooltip';

export const StatusIcon = ({status, title, subtitle, margin}: StatusIconProps) => {
  const { t } = useTranslation('generic');
  const iconSx = {
    cursor: 'help', 
    mr: margin && margin.includes('r') ? 1 : 0, 
    ml: margin && margin.includes('l') ? 1 : 0,
    mt: margin && margin.includes('t') ? 2 : 0,
  }

  return (
    <LightTooltip
      title={
        <>
          {title && 
            <Typography 
              sx={{
                fontSize: 14, 
                p: 2
              }}
            >
              {title}
            </Typography>
          }
          {subtitle &&
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
          }
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
      }>
      {
        status === 'error' ?
        <ErrorIcon sx={iconSx} color={status} /> :
        status === 'warning' ?
        <InfoIcon sx={iconSx} color={status}/> :
        <CheckCircleIcon sx={iconSx} color={status}/>
      }
    </LightTooltip>
  )
}