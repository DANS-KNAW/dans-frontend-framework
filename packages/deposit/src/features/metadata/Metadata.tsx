import { type SyntheticEvent } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { SectionType } from "../../types/Metadata";
import { SingleField, GroupedField } from "./MetadataFields";
import { StatusIcon } from "../generic/Icons";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getMetadata, getOpenPanel, setOpenPanel } from "./metadataSlice";
import { lookupLanguageString } from "@dans-framework/utils";
import { useTranslation } from "react-i18next";

const Form = () => {
  const dispatch = useAppDispatch();
  const metadata = useAppSelector(getMetadata);
  const openPanel = useAppSelector(getOpenPanel);
  const { i18n } = useTranslation();

  // handles accordion open/close actions, sends to redux store
  const handleChange =
    (panel: string) => (_e: SyntheticEvent, isExpanded: boolean) => {
      dispatch(setOpenPanel(isExpanded ? panel : ""));
    };

  return (
    <>
      {(metadata as SectionType[]).map((section, sectionIndex) => (
        <Accordion
          key={`section-${section.id}`}
          expanded={openPanel === section.id}
          onChange={handleChange(section.id)}
          TransitionProps={{
            unmountOnExit: true,
            timeout: 200,
            onEntered: (el) => {
              // make sure accordion scrolls into view after expanding,
              // if not in view yet, including header
              const rect = el.getBoundingClientRect();
              if (rect.top < 0) {
                window.scrollBy({
                  top: rect.bottom - rect.height - 80,
                  behavior: "smooth",
                });
              }
            },
          }}
          // todo: update mui, change TransitionProps to the following:
          // slotProps={{ transition: { unmountOnExit: true, etc... } }}
          data-testid={`section-${section.id}`}
          id={`section-${section.id}`}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${section.id}-content`}
          >
            <StatusIcon status={section.status} margin="r" />
            <Typography>
              {lookupLanguageString(section.title, i18n.language)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {section.description && (
                <Grid xs={12} md={9} lg={8} xl={7}>
                  <Typography
                    variant="body2"
                    mt={-1}
                    gutterBottom
                    sx={{ color: "rgba(0, 0, 0, 0.6)" }}
                  >
                    {lookupLanguageString(section.description, i18n.language)}
                  </Typography>
                </Grid>
              )}
              {section.fields.map((field, i) =>
                field.type === "group" ?
                  <GroupedField
                    key={i}
                    field={field}
                    sectionIndex={sectionIndex}
                  />
                : <SingleField
                    key={i}
                    field={field}
                    sectionIndex={sectionIndex}
                  />,
              )}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default Form;
