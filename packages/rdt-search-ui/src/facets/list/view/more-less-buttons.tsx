import type { ListFacetProps } from ".";

import React from "react";
import styled from "styled-components";

import { MoreLessButton } from "../../../views/ui/button";

import { SearchPropsContext } from "../../../context/props";
import { useTranslation } from "react-i18next";

// Add margin to the right of the "View More" button,
// so that it doesn't touch the "View Less" button.
const MoreButton = styled(MoreLessButton)`
  margin-right: 1rem;
`;

export default function (props: ListFacetProps) {
  const { style } = React.useContext(SearchPropsContext);
  const facetConfig = props.facet.config;
  const { t } = useTranslation("facets");

  return (
    <>
      {props.values.total > 0 && props.values.total > props.facetState.size && (
        <MoreButton
          // onClick={() => props.facet.actions.viewMore()}
          spotColor={style.spotColor}
        >
          {t("viewMore", { value: props.values.total - props.facetState.size })}
        </MoreButton>
      )}
      {facetConfig.size! < props.facetState.size && (
        <MoreLessButton
          // onClick={() => props.facet.actions.viewLess()}
          spotColor={style.spotColor}
        >
          {t("viewLess")}
        </MoreLessButton>
      )}
    </>
  );
}
