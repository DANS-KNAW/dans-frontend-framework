import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// some fake placeholder saves. todo.
export const saves = [
  {
    name: "Fake save #1",
    date: "8-8-2024",
    id: "someUniqueId1",
  },
  {
    name: "Fake save #2",
    date: "7-8-2024",
    id: "someUniqueId2",
  },
];

// define max number of rows a file selected for processing can contain
export const maxRows = 10;

// define steps
export const steps = ["selectFile", "createMapping", "finish"];

// wrapper for individual steps
export const StepWrap = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <Box sx={{ pt: 2, pb: 1 }}>
    <Typography variant="h2">{title}</Typography>
    {children}
  </Box>
);
