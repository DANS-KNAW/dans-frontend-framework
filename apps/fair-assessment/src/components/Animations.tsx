/* eslint-disable react-refresh/only-export-components */
import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import ListItem, { type ListItemProps } from "@mui/material/ListItem";
import List, { type ListProps } from "@mui/material/List";
import Grid, { type GridProps } from "@mui/material/Grid";
import Stack, { type StackProps } from "@mui/material/Stack";
import Paper, { type PaperProps } from "@mui/material/Paper";

const ForwardListItem = forwardRef<HTMLLIElement, ListItemProps & HTMLMotionProps<"li">>((props, ref) => <ListItem ref={ref} {...props} />);
export const MotionListItem = motion(ForwardListItem);

const ForwardList = forwardRef<HTMLUListElement, ListProps & HTMLMotionProps<"ul">>((props, ref) => <List ref={ref} {...props} />);
export const MotionList = motion(ForwardList);

const ForwardGrid = forwardRef<HTMLDivElement, GridProps & HTMLMotionProps<"div">>((props, ref) => <Grid ref={ref} {...props} />);
export const MotionGrid = motion(ForwardGrid) as any;

const ForwardStack = forwardRef<HTMLDivElement, StackProps & HTMLMotionProps<"div">>((props, ref) => <Stack ref={ref} {...props} />);
export const MotionStack: typeof ForwardStack = motion(ForwardStack) as any;

const ForwardPaper = forwardRef<HTMLDivElement, PaperProps & HTMLMotionProps<"div">>((props, ref) => <Paper ref={ref} {...props} />);
export const MotionPaper: typeof ForwardPaper = motion(ForwardPaper) as any;