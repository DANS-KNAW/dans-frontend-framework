import React from "react";

import { SearchPropsContext } from "../../context/props";
import { FacetsDataReducerAction } from "../../context/state/actions";

import MuiPagination from "@mui/material/Pagination";

export interface PaginationProps {
  currentPage: number;
  dispatch: React.Dispatch<FacetsDataReducerAction>;
  resultsPerPage?: number;
  total: number;
  setCurrentPage?: (page: number) => void;
  siblingCount?: number;
}

export function Pagination(props: PaginationProps) {
  const context = React.useContext(SearchPropsContext);

  let setCurrentPage = React.useCallback((page: number) => {
    props.dispatch({ type: "SET_PAGE", page });
  }, []);

  // Override the setCurrentPage function if it was passed in as a prop
  // For example, the list facet overrides this function
  setCurrentPage = props.setCurrentPage || setCurrentPage;

  const pageCount = Math.ceil(
    props.total / (props.resultsPerPage || context.resultsPerPage),
  );

  if (isNaN(pageCount) || pageCount === 1) return null;

  return (
    <MuiPagination
      shape="rounded"
      count={pageCount}
      page={props.currentPage}
      onChange={(_e, v) => setCurrentPage(v)}
      siblingCount={
        typeof props.siblingCount === "number" ? props.siblingCount : 1
      }
      size={props.siblingCount === 0 ? "small" : "medium"}
    />
  );
}
