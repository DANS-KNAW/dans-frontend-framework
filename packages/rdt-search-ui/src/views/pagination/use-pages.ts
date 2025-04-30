import React from "react";

function getRange(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_value, key) => key + start);
}

// Hook to calculate the page numbers to display
// The page numbers are split into three groups:
// - first: the first 3 page numbers, e.g. [1, 2, 3]
// - current: the current (page 5, the prev and next) page numbers, e.g. [4, 5, 6]
// - last: the last 3 page numbers, e.g. [7, 8, 9]
export function usePages(currentPage: number, pageCount: number) {
  const [first, setFirst] = React.useState<number[]>([]);
  const [current, setCurrent] = React.useState<number[]>([]);
  const [last, setLast] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (isNaN(pageCount) || pageCount === 1) return;

    let first: number[] = [];
    let current: number[] = [];
    let last: number[] = [];

    // If there are less than 7 pages, all page numbers are displayed
    if (pageCount < 7) {
      current = getRange(1, pageCount);
    } else {
      first = [1];
      last = [pageCount];

      if (currentPage < 4) {
        first = getRange(1, 4);
      } else if (currentPage > pageCount - 3) {
        last = getRange(pageCount - 3, pageCount);
      } else {
        // The current group is filled with the current page number and the two adjacent page numbers
        current = getRange(currentPage - 1, currentPage + 1);
      }
    }

    setFirst(first);
    setCurrent(current);
    setLast(last);
  }, [currentPage, pageCount]);

  return { first, current, last };
}
