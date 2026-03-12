import type { ReactNode } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { useSearch } from '@elastic/react-search-ui';
import CircularProgress from "@mui/material/CircularProgress";

export default function Results({ children }: { children?: ReactNode }) {
  const { t } = useTranslation('elastic');
  const { isLoading, wasSearched } = useSearch();

  return (
    <>
      { 
        children && Array.isArray(children) && children.length > 0 ? 
        children : 
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 20, color: 'neutral.dark' }}>
          {
            isLoading || !wasSearched ? 
            <CircularProgress /> : 
            <>
              <SearchOffIcon sx={{ fontSize: 100, mb: 2 }} />
              <Typography>
                {t('noResults')}
              </Typography>
            </>
          }
        </Box>
      }
    </>
  );
};
