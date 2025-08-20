import type { ResultBodyProps } from "@dans-framework/rdt-search-ui";
import parse from "html-react-parser";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import { getCurrentEndpoint, type EndpointProps } from "@dans-framework/rdt-search-ui";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import { motion } from "framer-motion";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { elasticConfig } from "./Guidance";
import Chip from "@mui/material/Chip";

const truncate = (str: string, max: number) => str.length > max ? `${str.slice(0, max)}...` : str;

export function SingleResult(props: ResultBodyProps) {
  const { result: item } = props;
  const title = item.labelguidanceelement || "<i>Untitled</i>";
  const description = item.descguidanceelement ? truncate(item.descguidanceelement, 200) : "No description found";

  return (
    <Box>
      <Typography variant="h5">{parse(title)}</Typography>
      <Typography>{parse(description)}</Typography>
    </Box>
  );
}

export function DetailedView({ onClose }: { onClose: () => void }) {
  const { id } = useParams();
  const [record, setRecord] = useState<any>(null);
  const endpoint = getCurrentEndpoint();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Normalize URL on load
  useEffect(() => {
    if (id && !id.startsWith("cat_graph:")) {
      const normalized = `cat_graph:${id}`;
      navigate(`/guidance/identifier/${encodeURIComponent(normalized)}`, { replace: true });
    }
  }, [id, navigate]);

  useEffect(() => {
    if (!id?.startsWith("cat_graph:")) return;

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
                  <Typography variant="h3">Detailed guidance view</Typography>

                  <Box mt={2}>
                    <Metadata
                      name="Title"
                      value={record.labelguidanceelement}
                    />
                    <Metadata
                      name="IRI"
                      value={record.lodgde}
                    />
                    <Metadata
                      name="Description"
                      value={record.descguidanceelement}
                    />
                    <Metadata
                      name="User View"
                      value={record.bodyguidanceelement}
                    />
                  </Box>

                  <Box mt={2}>
                    <Typography variant="h5">Classification</Typography>
                    {renderChips(record)}
                  </Box>
                  
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

function Metadata({name, value, pb = 1, width}: {name: string; value: string | string[]; pb?: number; width?: number;}) {
  return (
    <Stack direction={{xs: "column", sm: "row"}} spacing={{xs: 0, sm: 2}} pb={{xs: 1, sm: pb}}>
      <Typography variant="body2" color="neutral.dark" pr={1} sx={{ width: `${width || 10}rem`}}>
        {name}
      </Typography>
      <Typography variant="body2" sx={{ flex: 1}}>
        {Array.isArray(value) ? value.join(', ') : value || 'N/A'}
      </Typography>
    </Stack>
  );
}

function renderChips (obj: Record<string, any>) {
  return Object.entries(obj)
    .filter(([key]) => !key.includes('guidanceelement') && !key.includes('lodgde'))
    .map(([key, value]) => {
      // Handle arrays
      if (Array.isArray(value)) {
        return value.map((item, index) => (
          <Chip 
            key={`${key}-${index}`} 
            label={item} 
            size="small" 
            sx={{ mr: 0.5, mb: 0.5 }}
          />
        ));
      }
      
      // Handle single values
      return (
        <Chip 
          key={key} 
          label={value} 
          size="small" 
          sx={{ mr: 0.5, mb: 0.5 }}
        />
      );
    })
    .flat(); // Flatten array items
};