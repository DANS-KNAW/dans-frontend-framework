import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import { memo } from "react";
import type {
  TextFieldType,
  DateFieldType,
  InputField,
} from "../../types/MetadataFields";
import type {
  SingleFieldProps,
  GroupedFieldProps,
} from "../../types/MetadataProps";
import { DeleteButton, AddButtonText } from "./MetadataButtons";
import {
  OrcidField,
  RorField,
  MultiApiField,
  GeonamesField,
  GettyField,
  SheetsField,
  DatastationsField,
  DansFormatsField,
  GorcField,
  LicensesField,
  RdaWorkingGroupsField,
  RdaPathwaysField,
  RdaDomainsField,
  RdaInterestGroupsField,
  SshLicencesField,
  LanguagesField,
} from "./fields/AutocompleteAPIField";
import AutocompleteField from "./fields/AutocompleteField";
import TextField from "./fields/TextField";
import { DateTimeField, DateRangeField } from "./fields/DateTimeField";
import { RadioField, CheckField } from "./fields/RadioCheckField";
import { TransitionGroup } from "react-transition-group";
import { lookupLanguageString } from "@dans-framework/utils";
import { useTranslation } from "react-i18next";

// Memoized Field function, so only the affected field rerenders when form/metadata props change.
// Loads the field specified in the type key
const SingleField = memo(({ field, sectionIndex }: SingleFieldProps) => {
  return (
    <Grid xs={12} md={field.fullWidth ? 12 : 6}>
      {(field.type === "text" || field.type === "number") && (
        <TextField field={field} sectionIndex={sectionIndex} />
      )}
      {field.type === "date" && (
        <DateTimeField field={field} sectionIndex={sectionIndex} />
      )}
      {field.type === "daterange" && (
        <DateRangeField field={field} sectionIndex={sectionIndex} />
      )}
      {field.type === "repeatSingleField" && (
        <TransitionGroup id={`group-${field.name}-${field.id}`}>
          {field.fields.map((f: TextFieldType | DateFieldType, i: number) => (
            <Collapse key={f.id}>
              {(f.type === "text" || f.type === "number") && (
                <TextField
                  field={f}
                  sectionIndex={sectionIndex}
                  groupedFieldId={field.id}
                  currentField={i}
                  totalFields={field.fields.length}
                />
              )}
              {f.type === "date" && (
                <DateTimeField
                  field={f}
                  sectionIndex={sectionIndex}
                  groupedFieldId={field.id}
                  currentField={i}
                  totalFields={field.fields.length}
                />
              )}
            </Collapse>
          ))}
        </TransitionGroup>
      )}
      {field.type === "autocomplete" &&
        Array.isArray(field.options) &&
        !field.multiApiValue && (
          <AutocompleteField field={field} sectionIndex={sectionIndex} />
        )}
      {field.type === "autocomplete" &&
        (field.options === "orcid" ?
          <OrcidField field={field} sectionIndex={sectionIndex} />
        : field.options === "ror" ?
          <RorField field={field} sectionIndex={sectionIndex} />
        : field.options === "gorc" ?
          <GorcField field={field} sectionIndex={sectionIndex} />
        : field.options === "licenses" ?
          <LicensesField field={field} sectionIndex={sectionIndex} />
        : field.options === "sshLicences" ?
          <SshLicencesField field={field} sectionIndex={sectionIndex} />
        : field.options === "geonames" ?
          <GeonamesField field={field} sectionIndex={sectionIndex} />
        : field.options === "getty" ?
          <GettyField field={field} sectionIndex={sectionIndex} />
        : field.options === "sheets" ?
          <SheetsField field={field} sectionIndex={sectionIndex} />
        : (
          field.options === "elsst" ||
          field.options === "narcis" ||
          field.options === "dansCollections"
        ) ?
          <DatastationsField field={field} sectionIndex={sectionIndex} />
        : field.options === "dansFormats" ?
          <DansFormatsField field={field} sectionIndex={sectionIndex} />
        : field.options === "rdaworkinggroups" ?
          <RdaWorkingGroupsField field={field} sectionIndex={sectionIndex} />
        : field.options === "pathways" ?
          <RdaPathwaysField field={field} sectionIndex={sectionIndex} />
        : field.options === "domains" ?
          <RdaDomainsField field={field} sectionIndex={sectionIndex} />
        : field.options === "interest groups" ?
          <RdaInterestGroupsField field={field} sectionIndex={sectionIndex} />
        : field.options === "languageList" ?
          <LanguagesField field={field} sectionIndex={sectionIndex} />
        : field.multiApiValue ?
          <MultiApiField field={field} sectionIndex={sectionIndex} />
        : null)}
      {field.type === "radio" && (
        <RadioField field={field} sectionIndex={sectionIndex} />
      )}
      {field.type === "check" && (
        <CheckField field={field} sectionIndex={sectionIndex} />
      )}
    </Grid>
  );
});

const GroupedField = ({ field, sectionIndex }: GroupedFieldProps) => {
  const { i18n } = useTranslation();
  // Check if group is repeatable. If not, lets wrap that single fieldgroup in an array, so we can use the same map function over it.
  // We use the id of the first field of the group as key for transitions
  const fieldArray =
    field.repeatable ?
      (field.fields as InputField[][])
    : [field.fields as InputField[]];

  return (
    <Grid xs={12}>
      <Card>
        <CardHeader
          title={lookupLanguageString(field.label, i18n.language)}
          subheader={
            field.description &&
            lookupLanguageString(field.description, i18n.language)
          }
          titleTypographyProps={{ fontSize: 16 }}
          subheaderTypographyProps={{ fontSize: 12 }}
          sx={{ pb: 0, pl: 2.25, pr: 2.25 }}
        />
        {fieldArray && (
          <CardContent data-testid={`group-${field.name}-${field.id}`}>
            <TransitionGroup>
              {fieldArray.map((groupedField, i) => (
                <Collapse key={`group-${groupedField[0].id}`}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    key={i}
                    sx={{
                      borderTop: i > 0 ? "1px solid" : "none",
                      borderColor: "neutral.main",
                      pt: i > 0 ? 2 : 0,
                      mt: i > 0 ? 2 : 0,
                    }}
                    data-testid={`single-${field.name}-group-${i}`}
                  >
                    <Grid container sx={{ flex: 1 }} spacing={2}>
                      {groupedField.map((f) => (
                        <SingleField
                          key={f.id}
                          field={f}
                          sectionIndex={sectionIndex}
                        />
                      ))}
                    </Grid>
                    {field.repeatable && fieldArray.length > 1 && (
                      <DeleteButton
                        sectionIndex={sectionIndex}
                        groupedFieldId={field.id}
                        deleteFieldIndex={i}
                        size="medium"
                        deleteGroupId={`group-${i}`}
                        groupedFieldName={field.name}
                      />
                    )}
                  </Stack>
                </Collapse>
              ))}
            </TransitionGroup>
          </CardContent>
        )}
        {field.repeatable && 
          <CardActions sx={{ pl: 3, pr: 3, justifyContent: "right" }}>
            <Stack direction="row" alignItems="center" justifyContent="end">
              <AddButtonText
                sectionIndex={sectionIndex}
                groupedFieldId={field.id}
                groupedFieldName={field.name}
                type="group"
              />
            </Stack>
          </CardActions>
        }
      </Card>
    </Grid>
  );
};

export { SingleField, GroupedField };
