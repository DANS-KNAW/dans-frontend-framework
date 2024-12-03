import React from "react";
import { DropDown } from "../../ui/drop-down";
import { SearchProps } from "../../../context/props";
import { SearchStateDispatchContext } from "../../../context/state";
import { SavedSearch, useSavedSearches } from "./use-saved-searches";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";

export function LoadSearch(props: { url: SearchProps["url"] }) {
  const [savedSearches] = useSavedSearches(props.url);
  const { t } = useTranslation("views");

  if (savedSearches.length === 0) return null;

  return (
    <DropDown label={t("loadSearch")}>
      <LoadSearches savedSearches={savedSearches} />
    </DropDown>
  );
}

const LoadSearches = (props: { savedSearches: SavedSearch[] }) => {
  const dispatch = React.useContext(SearchStateDispatchContext);

  const loadSearch = (savedSearch: SavedSearch) => {
    console.log(savedSearch);
    dispatch({
      type: "LOAD_SEARCH",
      filters: savedSearch.filters,
      query: savedSearch.query,
    });
  };

  return props.savedSearches.map((savedSearch, i) => (
    <MenuItem key={i} onClick={() => loadSearch(savedSearch)}>
      <ListItemText
        primary={savedSearch.name || savedSearch.hash}
        secondary={dateString(savedSearch.date)}
      />
    </MenuItem>
  ));
};

// Show date without time
function dateString(date: string) {
  return date.slice(0, (/\d\d\d\d/.exec(date)?.index || 0) + 4);
}
