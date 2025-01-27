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
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getField } from "./metadataSlice";
import { Box } from "@mui/material";

// Lazy load the Draw map components, as it's quite large
const DrawMap = lazy(() => import("./fields/Map"));

// Memoized Field function, so only the affected field rerenders when form/metadata props change.
// Loads the field specified in the type key
const SingleField = memo(({ field, groupName, groupIndex }: SingleFieldProps) => {
  // Switch to determine which field type to render
  const getField = () => {
    const commonProps = {
      field,
      groupName,
      groupIndex,
    };

    switch (field.type) {
      case "text":
      case "number":
        return <TextField {...commonProps} />;
      case "date":
        return <DateTimeField {...commonProps} />;
      case "daterange":
        return <DateRangeField {...commonProps} />;
      case "radio":
        return <RadioField {...commonProps} />;
      case "check":
        return <CheckField {...commonProps} />;
      case "drawmap":
        return (
          <Suspense
            fallback={
              <Skeleton variant="rectangular" width="100%" height={140} />
            }
          >
            <DrawMap {...commonProps} />
          </Suspense>
        );
      case "autocomplete":
        if (field.multiApiValue)
          return <MultiApiField {...commonProps} />;
        else {
          switch (field.options) {
            case "orcid":
              return <OrcidField {...commonProps} />;
            case "ror":
              return <RorField {...commonProps} />;
            case "gorc":
              return <GorcField {...commonProps} />;
            case "licenses":
              return <LicensesField {...commonProps} />;
            case "sshLicences":
              return <SshLicencesField {...commonProps} />;
            case "geonames":
              return <GeonamesField {...commonProps} />;
            case "getty":
              return <GettyField {...commonProps} />;
            case "sheets":
              return <SheetsField {...commonProps} />;
            case "dansFormats":
              return <DansFormatsField {...commonProps} />;
            case "rdaworkinggroups":
              return <RdaWorkingGroupsField {...commonProps} />;
            case "pathways":
              return <RdaPathwaysField {...commonProps} />;
            case "domains":
              return <RdaDomainsField {...commonProps} />;
            case "interest groups":
              return <RdaInterestGroupsField {...commonProps} />;
            case "languageList":
              return <LanguagesField {...commonProps} />;
            case "elsst":
            case "narcis":
            case "dansCollections":
              return <DatastationsField {...commonProps} />;
            case "biodiversity_species_vernacular":
              return <BiodiversityField {...commonProps} variant="vernacular" />;
            case "biodiversity_species_scientific":
              return <BiodiversityField {...commonProps} variant="scientific" />;
            default:
              return <AutocompleteField {...commonProps} />;
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

const GroupedField = ({ field }: GroupedFieldProps) => {
  const { i18n } = useTranslation();
  const fieldValue = useAppSelector(getField(field.name));

  console.log(fieldValue)

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
        <CardContent data-testid={`group-${field.name}-${field.id}`}>
          {field.repeatable ? (
            (Array.isArray(fieldValue?.value) ? fieldValue?.value : [{}]).map((_repeatableItem, index) => (
              <Stack 
                key={index}
                direction="row"
                alignItems="center"
                sx={{ 
                  borderTop: index > 0 ? "1px solid" : "none",
                  borderColor: "neutral.main",
                  mt: index > 0 ? 1 : 0,
                  pt: index > 0 ? 2 : 0,
                  width: "100%",
                }}
              >
                <Box>
                  {field.fields.map((f) => (
                    <SingleField
                      key={f.id}
                      field={f}
                      groupName={field.name}
                      groupIndex={index}
                    />
                  ))}
                </Box>
                {fieldValue?.value.length > 1 && (
                  <DeleteButton
                    size="medium"
                    field={field}
                    fieldIndex={index}
                  />
                )}
              </Stack>
            ))
          ) : (
            field.fields.map((f) => (
              <SingleField
                key={f.id}
                field={f}
                groupName={field.name}
                groupIndex={0}
              />
            ))
          )}
          {/* <TransitionGroup>
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
                      />
                    ))}
                  </Grid>
                  {field.repeatable && fieldArray.length > 1 && (
                    <DeleteButton
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
          </TransitionGroup> */}
        </CardContent>
        {field.repeatable && (
          <CardActions sx={{ pl: 3, pr: 3, justifyContent: "right" }}>
            <Stack direction="row" alignItems="center" justifyContent="end">
              <AddButtonText
                field={field}
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
