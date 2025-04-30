import type { FSResponse } from "../../context/state/use-search/types";

import React from "react";

import { Pagination } from "../pagination";
import { ResultCount } from "./result-count";

import { SearchState, SearchStateDispatchContext } from "../../context/state";
import { SortBy } from "./result-count/order-by";
import { LoadSearch } from "../active-filters/save-search/load-search";
import { SearchPropsContext } from "../../context/props";

import Stack from "@mui/material/Stack";

interface Props {
  currentPage: SearchState["currentPage"];
  searchResult: FSResponse | undefined;
  sortOrder: SearchState["sortOrder"];
}
export const ResultHeader = function Header(props: Props) {
  const { url } = React.useContext(SearchPropsContext);
  const dispatch = React.useContext(SearchStateDispatchContext);
  if (props.searchResult == null) return null;

  return (
    <>
      <Stack
        direction="row"
        justifyContent="flex-end"
        mb={props.searchResult.total > 0 ? 2 : 8}
      >
        <SortBy sortOrder={props.sortOrder} />
        <LoadSearch url={url} />
      </Stack>
      {props.searchResult.total > 0 && (
        <Stack
          direction="row"
          justifyContent="space-between"
          flexWrap="wrap"
          alignItems="center"
          mb={2}
        >
          <ResultCount
            currentPage={props.currentPage}
            searchResult={props.searchResult}
          />
          <Pagination
            currentPage={props.currentPage}
            dispatch={dispatch}
            total={props.searchResult.total}
          />
        </Stack>
      )}
    </>
  );
};
