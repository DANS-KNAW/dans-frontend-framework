import type { SearchProps } from "../context/props";
import { SearchStateDispatchContext, type SearchState } from "../context/state";
import type { FacetControllers } from "../context/controllers";

import React, { Children, isValidElement } from "react";
import Grid from "@mui/material/Unstable_Grid2";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

interface Props {
  facetClassname?: string;
  children: React.ReactNode;
  controllers: FacetControllers;
  searchProps?: SearchProps;
  searchState: SearchState;
  dashboard?: boolean;
}

export const Facets = ({
  children,
  controllers,
  searchState,
  dashboard,
}: Props) => {
  const dispatch = React.useContext(SearchStateDispatchContext);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const isTiny = useMediaQuery(theme.breakpoints.down("sm"));

  if (searchState.facetStates.size === 0) return null;

  const facets =
    Children.map(children, (child, index) => {
      if (!isValidElement(child)) return;
      return Array.from(controllers.values(), (x) => ({
        facet: x,
        type: child.type,
      }))[index];
    }) || [];

  return (
    <Grid container spacing={2}>
      {!dashboard ?
        // search layout: sidebar only
        facets.map((f) => (
          <Grid xs={12} key={f.facet.ID}>
            <f.type
              key={f.facet.ID}
              dispatch={dispatch}
              facet={f.facet}
              facetState={searchState.facetStates.get(f.facet.ID)!}
              filter={searchState.facetFilters.get(f.facet.ID)?.value}
              values={
                searchState.facetValues && searchState.facetValues[f.facet.ID]
              }
            />
          </Grid>
        ))
      : <Grid xs={12}>
          <ImageList
            cols={8}
            variant="quilted"
            gap={16}
            sx={{
              overflow: "visible",
              // width: '100%',
            }}
          >
            {facets.map((f) => (
              <ImageListItem
                key={f.facet.ID}
                cols={
                  isTiny ? 8
                  : isSmall ?
                    4
                  : f.facet.config.cols || 4
                }
                rows={f.facet.config.rows || 1}
              >
                <f.type
                  key={f.facet.ID}
                  dispatch={dispatch}
                  facet={f.facet}
                  facetState={searchState.facetStates.get(f.facet.ID)!}
                  filter={searchState.facetFilters.get(f.facet.ID)?.value}
                  values={
                    searchState.facetValues &&
                    searchState.facetValues[f.facet.ID]
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Grid>
      }
    </Grid>
  );
};
