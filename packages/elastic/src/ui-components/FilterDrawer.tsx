import { useState } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { SearchBox } from "@elastic/react-search-ui";
import FacetContainer from "./FacetContainer";
import SearchBoxView from "../results/SearchBox";
import { ESUIFacet } from "../utils/configConverter";

const drawerBleeding = 56; // height of the "Show Filters" handle

export default function FilterDrawer({ facets }: { facets: [string, ESUIFacet][] }) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);

  const toggle = (val: boolean) => () => setOpen(val);

  if (!isMobile) {
    // Render original sidebar on desktop
    return (
      <Grid size={{ xs: 12, md: 5, lg: 4, xl: 3 }}>
        <SearchBox searchAsYouType={true} debounceLength={300} view={SearchBoxView} />
        {facets.map(([field, config]) =>
          config.display !== "hidden" && (
            <FacetContainer key={field} field={field} config={config} fullWidth />
          )
        )}
      </Grid>
    );
  }

  return (
    <>
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onOpen={toggle(true)}
        onClose={toggle(false)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        keepMounted
        sx={{
          ".MuiPaper-root": {
            height: `calc(95% - ${drawerBleeding}px)`,
            overflow: 'visible',
          }
        }}
      >
        {/* Swipeable handle — visible even when drawer is closed */}
        <Box
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            bgcolor: 'background.paper',
            flexDirection: 'column',
            py: 2,
            zIndex: 1,
            boxShadow: 3,
          }}
          onClick={toggle(!open)}
        >
          <Box 
            sx={{ 
              width: 30, 
              height: 4, 
              bgcolor: "grey.400", 
              borderRadius: 3, 
            }} 
          />
          <Button>
            {open ? "Hide Filters" : "Show Filters"}
          </Button>
        </Box>

        {/* Drawer content */}
        <Box sx={{ px: 2, py: 2, overflowY: "auto", height: "100%", zIndex: 2, bgcolor: 'background.paper' }}>
          <SearchBox searchAsYouType={true} debounceLength={300} view={SearchBoxView} />
          {facets.map(([field, config]) =>
            config.display !== "hidden" && (
              <FacetContainer key={field} field={field} config={config} fullWidth />
            )
          )}
        </Box>
      </SwipeableDrawer>
    </>
  );
}