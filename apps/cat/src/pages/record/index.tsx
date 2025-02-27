import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import { getCurrentEndpoint, type EndpointProps } from "@dans-framework/rdt-search-ui";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { motion } from "framer-motion";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { elasticConfig } from "../../config/elasticSearch";
import { gupriMap } from "../search/result";

interface SingleRecord {
  label: string;
  description: string;
  start_date: string;
  entity: string;
  coverage: string;
  unique: string;
  resolvable: string;
  persistent: string;
} 

export function SingleRecord({ onClose }: { onClose: () => void }) {
  const { id } = useParams();
  const [record, setRecord] = useState<SingleRecord | null>(null);
  const endpoint = getCurrentEndpoint();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentEndpointConfig: EndpointProps | undefined = elasticConfig.find((config) => config.url === endpoint);
    if (id) {
      fetch(
        `${endpoint}/_source/${encodeURIComponent(id)}`, {
          headers: {
            "Content-Type": "application/json",
            // if user and pass are provided, add basic auth header
            ...(currentEndpointConfig?.user && currentEndpointConfig?.pass && {
              Authorization: `Basic ${btoa(`${currentEndpointConfig.user}:${currentEndpointConfig.pass}`)}`,
            }),
          },
        }
      )
        .then((res) => {
          setLoading(false);
          if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`);
          }
          return res.json();
        })
        .then(setRecord)
        .catch((error) => {
          console.error("Failed to fetch record:", error);
          // You can also set an error state here to display an error message in the UI
          setRecord(null);  // Example: resetting the state in case of an error
        });
    }
  }, [id]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <Box 
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }} 
        onClick={onClose}
      /> 
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.3 }}
        style={{width: '100%',}}
      >
        <Box sx={{
          maxHeight: '90vh',
          pb: 4,
          pt: 4,
          backgroundColor: 'neutral.light',
          overflow: 'auto',
          position: 'relative',
        }}>
          <IconButton aria-label="close" size="large"  sx={{ position: 'absolute', right: '1rem', top: '1rem' }} onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <Container>
            <Grid container>
              <Grid
                sm={10}
                md={8}
                lg={7}
                smOffset={1}
                mdOffset={2}
                lgOffset={2.5}
                pt={4}
              >
                {loading ?
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '10rem',
                }}>
                  <CircularProgress />
                </Box>
                :
                record !== null ? 
                <Box>
                  <Typography variant="h3">Detailed view</Typography>

                  <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="flex-start">
                    <Box mt={2}>
                      <Metadata
                        name="Identifier name"
                        value={record.label}
                      />
                      <Metadata
                        name="Identifier Description"
                        value={record.description}
                        pb={2}
                      />
                      <Metadata
                        name="Year of First Operation"
                        value={record.start_date}
                      />
                      <Metadata
                        name="Used for Entities"
                        value={record.entity}
                      />
                    </Box>
                    {gupriMap(record.unique, record.resolvable, record.persistent)}
                  </Stack>
                </Box>
                :
                <Box>
                  <Typography variant="h3">
                    Record not found
                  </Typography>
                  <Typography gutterBottom>Please go back and try again</Typography>
                </Box>
                }
              </Grid>
            </Grid>
          </Container>
        </Box>
      </motion.div>
    </motion.div>
  );
}

function Metadata({name, value, pb}: {name: string; value: string | string[]; pb?: number}) {
  return (
    <Stack direction="row" spacing={2} pb={pb}>
      <Typography variant="body2" color="neutral.dark" pr={1} sx={{ width: '10rem'}}>
        {name}
      </Typography>
      <Typography variant="body2" sx={{ flex: 1}}>
        {Array.isArray(value) ? value.join(', ') : value || 'N/A'}
      </Typography>
    </Stack>
  );
}