import React from "react";
import { KeyCount, ListFacetState } from "../state";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import parse from "html-react-parser";
interface Props {
  active: boolean;
  keyFormatter: (key: string | number, query?: string) => string;
  query: ListFacetState["query"];
  toggleFilter: (ev: React.MouseEvent) => void;
  value: KeyCount;
}

function ListFacetValueView(props: Props) {
  const style = {
    cursor: "pointer",
    "&:hover > p": {
      fontWeight: "bold",
    },
    "& > p": {
      fontWeight: props.active ? "bold" : "normal",
    },
  };
  return (
    <div title={props.value.key} onClick={props.toggleFilter}>
      <Stack direction="row" mb={0.5} justifyContent="space-between" sx={style}>
        <Typography variant="body2">
          {parse(props.keyFormatter(props.value.key, props.query))}
        </Typography>
        <Typography variant="body2">{props.value.count}</Typography>
      </Stack>
    </div>
  );
}

ListFacetValueView.defaultProps = {
  // TODO use keyFormatter higher up the tree? now everytime the facet value is rendered,
  // the keyFormatter function is run
  keyFormatter: (value: string, query?: ListFacetState["query"]) => {
    value = value.trim().length > 0 ? value : "<i>&lt;empty&gt;</i>";

    if (query?.length) {
      value = value.replace(new RegExp(`(${query})`, "gi"), "<b>$1</b>");
    }

    return value;
  },
};

export default ListFacetValueView;
