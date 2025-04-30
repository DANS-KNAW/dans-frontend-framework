import React from "react";
import styled from "styled-components";

import { SearchProps, SearchPropsContext } from "../../context/props";
import { PaginationProps } from ".";

export const PaginationButton = styled.button`
  background: none;
  border: none;
  color: ${(props: {
    disabled?: boolean;
    color?: string;
    _style?: SearchProps["style"];
  }) => props.color || props._style?.spotColor};
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  outline: none;
  padding: 0;
`;

interface PnProps {
  active: boolean;
  _style: SearchProps["style"];
}
const PageNumberWrapper = styled(PaginationButton)`
  background-color: ${(props: PnProps) =>
    props.active ? props._style.buttonBackground : "none"};
  border-radius: 0.25em;
  color: ${(props: PnProps) => (props.active ? "#444" : "inherit")};
  font-weight: ${(props: PnProps) => (props.active ? "bold" : "normal")};
  padding: 0.35em;
  text-align: center;
`;

interface Props extends Pick<PaginationProps, "currentPage"> {
  pageNumber: number;
  setCurrentPage: (page: number) => void;
}
export function PageNumber(props: Props) {
  const { style } = React.useContext(SearchPropsContext);
  const active = props.pageNumber === props.currentPage;

  return (
    <PageNumberWrapper
      active={active}
      className={active ? "active" : undefined}
      key={props.pageNumber}
      onClick={() => props.setCurrentPage(props.pageNumber)}
      _style={style}
    >
      {props.pageNumber}
    </PageNumberWrapper>
  );
}
