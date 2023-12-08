import type { ResultBodyProps } from "@dans-framework/rdt-search-ui";
import { useState } from "react";
import { MetadataList } from "../record";
import parse from "html-react-parser";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export function Rda2Result(props: ResultBodyProps) {
  const { result: item } = props;

  const title = item.highlight?.title?.[0] || item.title || "<i>empty</i>";

  return (
    <>
      <Typography variant="h5">
        {parse(title)}
      </Typography>
      {item.dc_date && 
        <Typography variant="body2" gutterBottom>
          {new Date(item.dc_date).toDateString()}
        </Typography>
      }
      <ReadMore item={item} />
      <MetadataList record={item} />
    </>
  );
}

function ReadMore({ item }: { item: ResultBodyProps["result"] }) {
  const [active, setActive] = useState(false);

  const hasHighlight = item.highlight?.dc_description?.[0] != null;

  // No description, return nothing
  if (item.dc_description == null) return null;

  // Highlighted description, return it
  if (hasHighlight) {
    return (
      <Typography variant="body2">
        {parse(item.highlight?.dc_description?.[0] as string)}
      </Typography>
    );
  }

  const [visibleText, hiddenText] = [item.dc_description.substring(0, 180), item.dc_description.substring(180)]

  //item.dc_description.split(/\. (.*)/);

  // There is only one sentence, return it
  if (hiddenText == null || hiddenText.trim().length === 0) {
    return <Typography variant="body1">{visibleText}</Typography>;
  }

  return (
    <>
      <Typography gutterBottom>
        {`${visibleText}${visibleText.length < item.dc_description.length && !active ? "..." : hiddenText}`}
      </Typography>
      <Button
        size="small"
        onClick={(ev) => {
          ev.stopPropagation();
          setActive(!active);
        }}
        sx={{marginBottom: 2}}
        endIcon={active ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      >
        {active ? "Read less" : "Read more"}
      </Button>
    </>
  );
}
