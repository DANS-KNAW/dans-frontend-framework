import type { MouseEvent } from "react";
import { KeyCount, ListFacetState } from "../state";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import parse from "html-react-parser";
interface Props {
  active: boolean;
  keyFormatter?: (key: string | number, query?: string) => string;
  query: ListFacetState["query"];
  toggleFilter: (ev: MouseEvent) => void;
  value: KeyCount;
}

function ListFacetValueView({
  active,
  keyFormatter = (key: string | number, query?: ListFacetState["query"]) => 
    (typeof key === "number" ? key.toString() : key.trim() || "<i>&lt;empty&gt;</i>")
    .replace(new RegExp(query?.length ? `(${query})` : "", "gi"), query?.length ? "<b>$1</b>" : "$&"),
  query,
  toggleFilter,
  value,
}: Props) {
  const style = {
    cursor: "pointer",
    "&:hover > p": {
      fontWeight: "bold",
    },
    "& > p": {
      fontWeight: active ? "bold" : "normal",
    },
  };
  return (
    <div title={value.key} onClick={toggleFilter}>
      <Stack direction="row" mb={0.5} justifyContent="space-between" sx={style}>
        <Typography variant="body2">
          {parse(keyFormatter(value.key, query))}
        </Typography>
        <Typography variant="body2">{value.count}</Typography>
      </Stack>
    </div>
  );
};

export default ListFacetValueView;
