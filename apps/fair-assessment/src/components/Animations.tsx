import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import ListItem, { type ListItemProps } from "@mui/material/ListItem";
import List, { type ListProps } from "@mui/material/List";

const ForwardListItem = forwardRef<HTMLLIElement, ListItemProps & HTMLMotionProps<"li">>((props, ref) => <ListItem ref={ref} {...props} />);
export const MotionListItem = motion(ForwardListItem);

const ForwardList = forwardRef<HTMLUListElement, ListProps & HTMLMotionProps<"ul">>((props, ref) => <List ref={ref} {...props} />);
export const MotionList = motion(ForwardList);