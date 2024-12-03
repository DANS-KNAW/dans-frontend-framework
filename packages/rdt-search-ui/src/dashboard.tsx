import React from "react";
import { SearchProps } from "./context/props";
import { SearchState } from "./context/state";
import { ActiveFilters } from "./views/active-filters";
import { Facets } from "./facets";
import { FacetControllers } from "./context/controllers";
// import Grid from "@mui/material/Unstable_Grid2";

interface Props {
  children: React.ReactNode;
  controllers: FacetControllers;
  searchProps: SearchProps;
  searchState: SearchState;
}

export function Dashboard({ children, controllers, searchState }: Props) {
  if (searchState.facetStates.size === 0) return null;

  return (
    <>
      {(searchState.query ||
        searchState.facetFilters.entries().next().value) && <ActiveFilters />}
      <Facets controllers={controllers} searchState={searchState} dashboard>
        {children}
      </Facets>
    </>
  );
}
