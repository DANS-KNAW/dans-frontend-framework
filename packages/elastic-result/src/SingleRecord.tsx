import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { useFetchRecordQuery } from "./elasticApi";
import { useTranslation } from "react-i18next";
import Link from "@mui/material/Link"; 
import Button from "@mui/material/Button"; 

type Item = { label: string, value: string }

type Config = {
  title: string;
  linkToSlug?: string;
  linkToId?: string;
  list: Item[];
  chips: Item[];
  externalLink?: string;
}

export default function SingleRecord({ config }: { config: Config }) {
  const { id } = useParams();
  const { data, isLoading } = useFetchRecordQuery(id);
  const { t } = useTranslation('elasticResult');

  return (
    <Container>
      <Grid container>
        <Grid
          size={{ sm: 10, md: 8, lg: 7 }}
          offset={{ sm: 1, md: 2, lg: 2.5 }}
          pt={4}
          pb={10}
        >
          {isLoading ?
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '10rem',
          }}>
            <CircularProgress />
          </Box>
          :
          data !== undefined ? 
          <Box>
            <Typography variant="h1" mb={4}>
              { t("detailedView", { title: data.hasOwnProperty(config.title) ? data[config.title] : '' }) }
            </Typography>
            {config.list.map((item) => (
              <Metadata 
                key={item.value}
                name={item.label}
                value={data[item.value]}
              />
            ))}
            {config.chips.map((item) => (
              <Tag 
                key={item.value}
                name={item.label}
                value={data[item.value]}
              />
            ))}
            {config.externalLink &&
              <Stack mt={2} alignItems="flex-end">
                <Button component={Link} href={data[config.externalLink]} target="_blank" rel="noopener">
                  {t("externalLink")}
                </Button>
              </Stack>
            }
          </Box>
          :
          <Box>
            <Typography variant="h3">
              { t('recordNotFound') }
            </Typography>
            <Typography gutterBottom>
              { t('recordNotFoundDescription') }
            </Typography>
            </Box>
          }
        </Grid>
      </Grid>
    </Container>
  );
}

function Tag({  name, value}: { name: string; value: string[] }) {
  return (
    <Box mt={4}>
      <Typography variant="h5">
        {name}
      </Typography>
      {value.map((v, i) => (
         v && <Chip key={i} label={v} sx={{ mr: 1, mb: 1}} />
      ))}
    </Box>
  );
}

function Metadata({
  name, 
  value, 
  pb = 0, 
  width
}: {
  name: string; 
  value: string | string[]; 
  pb?: number; 
  width?: number;
}) {
  return (
    <Stack direction={{xs: "column", sm: "row"}} spacing={{xs: 0, sm: 2}} pb={{xs: 1, sm: pb}} mb={1}>
      <Typography variant="body2" color="neutral.dark" pr={1} sx={{ width: `${width || 10}rem`}}>
        {name}
      </Typography>
      <Typography variant="body2" sx={{ flex: 1}}>
        {Array.isArray(value) ? value.join(', ') : value || 'N/A'}
      </Typography>
    </Stack>
  );
}