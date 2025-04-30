import { useEffect, type SyntheticEvent } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SingleField, GroupedField } from "./MetadataFields";
import { StatusIcon } from "../generic/Icons";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getSections, getForm } from "./metadataSlice";
import { getOpenPanel, setOpenPanel } from "../../deposit/depositSlice";
import { lookupLanguageString } from "@dans-framework/utils";
import { useTranslation } from "react-i18next";
import type { Field } from "../../types/MetadataFields";

const Form = () => {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(getForm);
  const openPanel = useAppSelector(getOpenPanel);
  const { i18n } = useTranslation();
  const sections = useAppSelector(getSections);

  // handles accordion open/close actions, sends to redux store
  const handleChange =
    (panel: string) => (_e: SyntheticEvent, isExpanded: boolean) => {
      dispatch(setOpenPanel(isExpanded ? panel : ""));
    };

  // if no panel is open, and form panels have had no interaction, open the first one
  useEffect(() => {
    if (openPanel === undefined && formData.length > 0) {
      const firstPanel = formData[0].id;
      if (firstPanel) {
        dispatch(setOpenPanel(firstPanel));
      }
    }
  }, [openPanel, formData]);

  return (
    <>
      {formData.map((section) => (
        <Accordion
          key={`section-${section.id}`}
          expanded={openPanel === section.id}
          onChange={handleChange(section.id)}
          slotProps={{ 
            transition: { 
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
            }
          }}
          data-testid={`section-${section.id}`}
          id={`section-${section.id}`}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${section.id}-content`}
          >
            <StatusIcon status={sections?.[section.id]?.status} margin="r" />
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
                <FieldSelector fields={section.fields} />
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

const FieldSelector = ({ fields }: { fields: Field[] }) => {
  return (
    <>
      {fields.map((field, i) => {
        if (field.type === "group") {
          return <GroupedField key={i} field={field} />;
        }
        return <SingleField key={i} field={field} />;
      })}
    </>
  );
}

export default Form;
