import React from "react";
import { DropDown } from "../../../ui/drop-down";
import OrderOption from "./option";
import { FacetControllersContext } from "../../../../context/controllers";
import { SortOrder } from "../../../../context/state/use-search/types";
import { useTranslation } from "react-i18next";

interface Props {
  sortOrder: SortOrder;
}
export const SortBy = React.memo(function SortBy(props: Props) {
  const controllers = React.useContext(FacetControllersContext);
  const { t } = useTranslation("views");

  return (
    <DropDown label={t("sortBy", { count: props.sortOrder.size })}>
      {Array.from(controllers.values()).map((facet) => (
        <OrderOption facet={facet} key={facet.ID} sortOrder={props.sortOrder} />
      ))}
    </DropDown>
  );
});
