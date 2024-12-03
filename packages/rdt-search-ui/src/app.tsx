import React from "react";
import { ResultHeader } from "./views/header";
import { SearchResult } from "./views/search-result";
import { FullTextSearch } from "./views/full-text-search";
import { ActiveFilters } from "./views/active-filters";

import { SearchProps } from "./context/props";
import { SearchState } from "./context/state";
import { Facets } from "./facets";
import { FacetControllers } from "./context/controllers";

import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

/* This is the wrapper for the search interface */

const drawerBleeding = 56;

interface Props {
  children: React.ReactNode;
  controllers: FacetControllers;
  searchProps: SearchProps;
  searchState: SearchState;
}

export default function FacetedSearch({
  children,
  controllers,
  searchProps,
  searchState,
}: Props) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const { t } = useTranslation("app");

  return (
    <Grid container spacing={2}>
      {matches ?
        <Grid sm={6} md={4}>
          <FullTextSearch />
          {(searchState.query ||
            searchState.facetFilters.entries().next().value) && (
            <ActiveFilters />
          )}
          <Facets
            controllers={controllers}
            searchProps={searchProps}
            searchState={searchState}
          >
            {children}
          </Facets>
        </Grid>
      : <SwipeableDrawer
          anchor="bottom"
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            ".MuiDrawer-paper ": {
              height: `calc(100% - ${drawerBleeding * 2}px)`,
              top: drawerBleeding * 2,
              visibility: "visible",
              overflow: "visible",
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -drawerBleeding,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              visibility: "visible",
              right: 0,
              left: 0,
              backgroundColor: "neutral.light",
              textAlign: "center",
              boxShadow: 10,
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 6,
                backgroundColor: "neutral.dark",
                borderRadius: 3,
                position: "absolute",
                top: 10,
                left: "calc(50% - 15px)",
              }}
            />
            <Typography sx={{ pt: 3, pb: 1, color: "text.secondary" }}>
              {t(open ? "swipeDown" : "swipeUp")}
            </Typography>
          </Box>
          <Box
            sx={{
              px: 2,
              pb: 2,
              height: "100%",
              overflow: "auto",
              backgroundColor: "neutral.light",
            }}
          >
            <Facets
              controllers={controllers}
              searchProps={searchProps}
              searchState={searchState}
            >
              {children}
            </Facets>
          </Box>
        </SwipeableDrawer>
      }
      <Grid xs={12} sm={6} md={8}>
        {!matches && <FullTextSearch />}
        {!matches &&
          (searchState.query ||
            searchState.facetFilters.entries().next().value) && (
            <ActiveFilters />
          )}
        <ResultHeader
          currentPage={searchState.currentPage}
          searchResult={searchState.searchResult}
          sortOrder={searchState.sortOrder}
        />
        <SearchResult
          currentPage={searchState.currentPage}
          ResultBodyComponent={searchProps.ResultBodyComponent}
          onClickResult={searchProps.onClickResult}
          resultBodyProps={searchProps.resultBodyProps}
          searchResult={searchState.searchResult}
        />
      </Grid>
    </Grid>
  );
}
