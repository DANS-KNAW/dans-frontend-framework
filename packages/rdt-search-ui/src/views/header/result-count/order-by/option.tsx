import React from "react";
import { SearchStateDispatchContext } from "../../../../context/state";
import { FacetController } from "../../../../facets/controller";
import { SortDirection } from "../../../../enum";
import { SortOrder } from "../../../../context/state/use-search/types";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import SortIcon from "@mui/icons-material/Sort";
import { lookupLanguageString } from "@dans-framework/utils";
import { useTranslation } from "react-i18next";

function updateSortOrder(
  sortOrder: SortOrder,
  field: string,
  direction: SortDirection = SortDirection.Desc,
) {
  if (sortOrder.has(field) && sortOrder.get(field) === direction)
    sortOrder.delete(field);
  else sortOrder.set(field, direction);

  return new Map(sortOrder);
}

interface Props {
  facet: FacetController<any, any, any>;
  sortOrder: SortOrder;
}
function OrderOption(props: Props) {
  const dispatch = React.useContext(SearchStateDispatchContext);
  const { i18n } = useTranslation();

  const setDirection = React.useCallback(
    (ev: React.MouseEvent) => {
      ev.stopPropagation();

      const nextDirection =
        props.sortOrder.get(props.facet.config.field) === SortDirection.Desc ?
          SortDirection.Asc
        : SortDirection.Desc;

      const sortOrder = updateSortOrder(
        props.sortOrder,
        props.facet.config.field,
        nextDirection,
      );
      dispatch({ type: "SET_SORT_ORDER", sortOrder });
    },
    [props.sortOrder],
  );

  const setFacetId = React.useCallback(
    (ev: React.MouseEvent) => {
      ev.stopPropagation();
      const direction = props.sortOrder.get(props.facet.config.field);
      const sortOrder = updateSortOrder(
        props.sortOrder,
        props.facet.config.field,
        direction,
      );

      dispatch({ type: "SET_SORT_ORDER", sortOrder });
    },
    [props.sortOrder],
  );

  const direction = props.sortOrder.get(props.facet.config.field);

  return (
    <MenuItem key={props.facet.ID} onClick={setFacetId}>
      {direction != null && (
        <ListItemIcon onClick={setDirection}>
          <SortIcon
            sx={{
              transform:
                direction === "asc" ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </ListItemIcon>
      )}
      <ListItemText>
        {lookupLanguageString(props.facet.config.title, i18n.language)}
      </ListItemText>
    </MenuItem>
  );
}

export default React.memo(OrderOption);

export function Asc({
  title = "Ascending",
  color = "#444",
}: {
  title?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 400 400">
      <title>{title}</title>
      <line
        x1="260"
        y1="30"
        x2="370"
        y2="30"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="60"
      />
      <line
        x1="110"
        y1="256"
        x2="370"
        y2="256"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="60"
      />
      <line
        x1="180"
        y1="143"
        x2="370"
        y2="143"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="60"
      />
      <line
        x1="30"
        y1="370"
        x2="370"
        y2="370"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="60"
      />
    </svg>
  );
}

export function Desc({
  title = "Descending",
  color = "#444",
}: {
  title?: string;
  color?: string;
}) {
  return (
    <svg viewBox="0 0 400 400">
      <title>{title}</title>
      <line
        x1="30"
        y1="30"
        x2="370"
        y2="30"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="60"
      />
      <line
        x1="110"
        y1="143"
        x2="370"
        y2="143"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="60"
      />
      <line
        x1="180"
        y1="256"
        x2="370"
        y2="256"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="60"
      />
      <line
        x1="260"
        y1="370"
        x2="370"
        y2="370"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="60"
      />
    </svg>
  );
}
