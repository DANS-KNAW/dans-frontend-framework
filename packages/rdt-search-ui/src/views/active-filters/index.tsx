import React from "react";

import { ActiveFilterValue } from "./value";
import { SearchPropsContext } from "../../context/props";

import {
  SearchStateContext,
  SearchStateDispatchContext,
} from "../../context/state";
import { FacetControllersContext } from "../../context/controllers";
import { SaveSearch } from "./save-search/save-search";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { useTranslation } from "react-i18next";

export function ActiveFilters() {
  const controllers = React.useContext(FacetControllersContext);
  const { url } = React.useContext(SearchPropsContext);
  const state = React.useContext(SearchStateContext);
  const dispatch = React.useContext(SearchStateDispatchContext);

  const reset = React.useCallback(() => {
    dispatch({ type: "RESET" });
  }, [controllers]);

  const removeFilter = React.useCallback((ev: React.MouseEvent) => {
    dispatch({
      type: "REMOVE_FILTER",
      facetID: ev.currentTarget.getAttribute("data-facet-id")!,
      value: ev.currentTarget.getAttribute("data-value")!,
    });
  }, []);

  const { t } = useTranslation("views");

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6">{t("activeFilters")}</Typography>
      <Stack direction="column" spacing={1}>
        {state.query?.length > 0 && (
          <ActiveFilterItem title={t("fullTextQuery")}>
            <ActiveFilterValue
              key="full-text-query"
              removeFilter={() => dispatch({ type: "SET_QUERY", value: "" })}
              title={t("fullTextQuery")}
              value={state.query}
            />
          </ActiveFilterItem>
        )}
        {Array.from(state.facetFilters.entries()).map(([facetID, filter]) => (
          <ActiveFilterItem key={facetID} title={filter.title}>
            {filter.formatted.map((value) => (
              <ActiveFilterValue
                facetID={facetID}
                key={facetID + value}
                removeFilter={removeFilter}
                title={t("facetFilterValue", { value: value })}
                value={value}
              />
            ))}
          </ActiveFilterItem>
        ))}
        <Stack
          direction="row"
          flexWrap="wrap"
          sx={{ pt: 1 }}
          spacing={1}
          useFlexGap
        >
          <Box sx={{ flex: 5, textAlign: "right" }}>
            <Button variant="contained" onClick={reset} size="small">
              {t("clearSearch")}
            </Button>
          </Box>
          <SaveSearch
            url={url}
            activeFilters={{
              query: state.query,
              filters: state.facetFilters,
            }}
          />
        </Stack>
      </Stack>
    </Paper>
  );
}

interface ItemProps {
  children: React.ReactNode;
  title: string;
}
function ActiveFilterItem({ children, title }: ItemProps) {
  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap">
      <Typography variant="body2" mr={0.5}>
        {title}
      </Typography>
      {children}
    </Stack>
  );
}
