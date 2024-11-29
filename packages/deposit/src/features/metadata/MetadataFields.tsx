import { lazy, Suspense } from "react";
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
  BiodiversityField,
} from "./fields/AutocompleteAPIField";
import AutocompleteField from "./fields/AutocompleteField";
import TextField from "./fields/TextField";
import { DateTimeField, DateRangeField } from "./fields/DateTimeField";
import { RadioField, CheckField } from "./fields/RadioCheckField";
import { TransitionGroup } from "react-transition-group";
import { lookupLanguageString } from "@dans-framework/utils";
import { useTranslation } from "react-i18next";
import Skeleton from "@mui/material/Skeleton";
// Lazy load the Draw map components, as it's quite large
const DrawMap = lazy(() => import("./fields/Map"));

// Memoized Field function, so only the affected field rerenders when form/metadata props change.
// Loads the field specified in the type key
const SingleField = memo(({ field, sectionIndex }: SingleFieldProps) => {
  // Switch to determine which field type to render
  const getField = () => {
    switch (field.type) {
      case "text":
      case "number":
        return <TextField field={field} sectionIndex={sectionIndex} />;
      case "date":
        return <DateTimeField field={field} sectionIndex={sectionIndex} />;
      case "daterange":
        return <DateRangeField field={field} sectionIndex={sectionIndex} />;
      case "repeatSingleField":
        return (
          <TransitionGroup id={`group-${field.name}-${field.id}`}>
            {field.fields.map((f: TextFieldType | DateFieldType, i: number) => {
              const commonProps = {
                sectionIndex: sectionIndex,
                groupedFieldId: field.id,
                currentField: i,
                totalFields: field.fields.length,
              };
              return (
                <Collapse key={f.id}>
                  {(f.type === "text" || f.type === "number") && (
                    <TextField {...commonProps} field={f} />
                  )}
                  {f.type === "date" && (
                    <DateTimeField {...commonProps} field={f} />
                  )}
                </Collapse>
              );
            })}
          </TransitionGroup>
        );
      case "radio":
        return <RadioField field={field} sectionIndex={sectionIndex} />;
      case "check":
        return <CheckField field={field} sectionIndex={sectionIndex} />;
      case "drawmap":
        return (
          <Suspense
            fallback={
              <Skeleton variant="rectangular" width="100%" height={140} />
            }
          >
            <DrawMap field={field} sectionIndex={sectionIndex} />
          </Suspense>
        );
      case "autocomplete":
        if (field.multiApiValue)
          return <MultiApiField field={field} sectionIndex={sectionIndex} />;
        else {
          switch (field.options) {
            case "orcid":
              return <OrcidField field={field} sectionIndex={sectionIndex} />;
            case "ror":
              return <RorField field={field} sectionIndex={sectionIndex} />;
            case "gorc":
              return <GorcField field={field} sectionIndex={sectionIndex} />;
            case "licenses":
              return (
                <LicensesField field={field} sectionIndex={sectionIndex} />
              );
            case "sshLicences":
              return (
                <SshLicencesField field={field} sectionIndex={sectionIndex} />
              );
            case "geonames":
              return (
                <GeonamesField field={field} sectionIndex={sectionIndex} />
              );
            case "getty":
              return <GettyField field={field} sectionIndex={sectionIndex} />;
            case "sheets":
              return <SheetsField field={field} sectionIndex={sectionIndex} />;
            case "dansFormats":
              return (
                <DansFormatsField field={field} sectionIndex={sectionIndex} />
              );
            case "rdaworkinggroups":
              return (
                <RdaWorkingGroupsField
                  field={field}
                  sectionIndex={sectionIndex}
                />
              );
            case "pathways":
              return (
                <RdaPathwaysField field={field} sectionIndex={sectionIndex} />
              );
            case "domains":
              return (
                <RdaDomainsField field={field} sectionIndex={sectionIndex} />
              );
            case "interest groups":
              return (
                <RdaInterestGroupsField
                  field={field}
                  sectionIndex={sectionIndex}
                />
              );
            case "languageList":
              return (
                <LanguagesField field={field} sectionIndex={sectionIndex} />
              );
            case "elsst":
            case "narcis":
            case "dansCollections":
              return (
                <DatastationsField field={field} sectionIndex={sectionIndex} />
              );
            case "biodiversity_species_vernacular":
              return (
                <BiodiversityField field={field} sectionIndex={sectionIndex} variant="vernacular" />
              );
            case "biodiversity_species_scientific":
              return (
                <BiodiversityField field={field} sectionIndex={sectionIndex} variant="scientific" />
              );
            default:
              return (
                <AutocompleteField field={field} sectionIndex={sectionIndex} />
              );
          }
        }
      default:
        return null;
    }
  };

  return (
    <Grid xs={12} md={field.fullWidth ? 12 : 6}>
      {getField()}
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
        {field.repeatable && (
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
        )}
      </Card>
    </Grid>
  );
};

export { SingleField, GroupedField };
