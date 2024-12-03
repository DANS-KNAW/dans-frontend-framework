import type { SearchState } from "../../../context/state";
import type { FSResponse } from "../../../context/state/use-search/types";

import React from "react";

import { SearchPropsContext } from "../../../context/props";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

interface Props {
  currentPage: SearchState["currentPage"];
  searchResult: FSResponse;
}
export function ResultCount(props: Props) {
  const { resultsPerPage } = React.useContext(SearchPropsContext);
  const [fromTo, setFromTo] = React.useState<[number, number]>();
  const { t } = useTranslation("views");

  React.useEffect(() => {
    let nextFrom = (props.currentPage - 1) * resultsPerPage + 1;
    if (nextFrom > props.searchResult.total)
      nextFrom = props.searchResult.total;

    let nextTo = nextFrom + resultsPerPage - 1;
    if (nextTo > props.searchResult.total) nextTo = props.searchResult.total;

    setFromTo([nextFrom, nextTo]);
  }, [props.currentPage, resultsPerPage, props.searchResult.total]);

  if (fromTo == null) return null;

  return (
    <Typography>
      {t("resultCount", {
        from: fromTo[0],
        to: fromTo[1],
        count: props.searchResult.total,
      })}
    </Typography>
  );
}
