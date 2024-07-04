import type { ResultBodyProps } from "@dans-framework/rdt-search-ui";
import { useState } from "react";
import { MetadataList } from "../record";
import parse from "html-react-parser";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

/* Custom component for search results */

export function Rda2Result(props: ResultBodyProps) {
  const { result: item } = props;

  const title = item.highlight?.title?.[0] || item.title || "<i>empty</i>";

  return (
    <>
      <Typography variant="h5">{parse(title)}</Typography>
      {item.dc_date && (
        <Typography variant="body2" gutterBottom>
          {new Date(item.dc_date).toDateString()}
        </Typography>
      )}
      <ReadMore item={item} />
      <MetadataList record={item} />
    </>
  );
}

function ReadMore({ item }: { item: ResultBodyProps["result"] }) {
  const [active, setActive] = useState(false);

  const description = item.dc_description || "";

  const [visibleText, hiddenText] = [
    description.substring(0, 180),
    description.substring(180),
  ];

  // There is only one sentence, return it
  if (hiddenText == null || hiddenText.trim().length === 0) {
    return <Typography variant="body1">{visibleText}</Typography>;
  }

  return (
    <>
      <Typography mb={2}>
        {`${visibleText}${
          visibleText.length < description.length && !active ?
            "..."
          : hiddenText
        }`}
        <Button
          size="small"
          onClick={(ev) => {
            ev.stopPropagation();
            setActive(!active);
          }}
          sx={{ fontSize: 10, pt: 0.1, pb: 0.1 }}
          endIcon={active ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        >
          {active ? "Read less" : "Read more"}
        </Button>
      </Typography>
    </>
  );
}
