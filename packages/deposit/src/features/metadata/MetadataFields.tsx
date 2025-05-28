import { lazy, Suspense } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { memo } from "react";
import type {
  SingleFieldProps,
  GroupedFieldProps,
  CommonProps,
} from "../../types/MetadataProps";
import { DeleteButton, AddButtonText } from "./MetadataButtons";
import {
  OrcidField,
  RorField,
  MultiApiField,
  GeonamesField,
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
  UnSustainableDevelopmentGoalsField,
  WikidataField
} from "./fields/AutocompleteAPIField";
import AutocompleteField from "./fields/AutocompleteField";
import TextField from "./fields/TextField";
import { DateTimeField, DateRangeField } from "./fields/DateTimeField";
import { RadioField, CheckField } from "./fields/RadioCheckField";
import { lookupLanguageString } from "@dans-framework/utils";
import { useTranslation } from "react-i18next";
import Skeleton from "@mui/material/Skeleton";
import { useAppSelector } from "../../redux/hooks";
import { getField } from "./metadataSlice";
import type { TextFieldType, DateFieldType, DateRangeFieldType, RadioFieldType, CheckFieldType, DrawMapFieldType, AutocompleteFieldType, InputField } from "../../types/MetadataFields";

// Lazy load the Draw map components, as it's quite large
const DrawMap = lazy(() => import("./fields/Map"));

// Memoized Field function, so only the affected field rerenders when form/metadata props change.
// Loads the field specified in the type key
const SingleField = memo(({ field, groupName, groupIndex, sx }: SingleFieldProps) => {
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
        return <TextField {...(commonProps as CommonProps<TextFieldType>)} />;
      case "date":
        return <DateTimeField {...(commonProps as CommonProps<DateFieldType>)} />;
      case "daterange":
        return <DateRangeField {...(commonProps as CommonProps<DateRangeFieldType>)} />;
      case "radio":
        return <RadioField {...(commonProps as CommonProps<RadioFieldType>)} />;
      case "check":
        return <CheckField {...(commonProps as CommonProps<CheckFieldType>)} />;
      case "drawmap":
        return (
          <Suspense
            fallback={
              <Skeleton variant="rectangular" width="100%" height={140} />
            }
          >
            <DrawMap {...(commonProps as CommonProps<DrawMapFieldType>)} />
          </Suspense>
        );
      case "autocomplete":
        if (field.multiApiValue)
          return <MultiApiField {...(commonProps as CommonProps<AutocompleteFieldType>)} />;
        else {
          switch (field.options) {
            case "orcid":
              return <OrcidField {...(commonProps as CommonProps<AutocompleteFieldType>)} />;
            case "ror":
              return <RorField {...(commonProps as CommonProps<AutocompleteFieldType>)} />;
            case "gorc":
              return <GorcField {...(commonProps as CommonProps<AutocompleteFieldType>)} />;
            case "licenses":
              return <LicensesField {...(commonProps as CommonProps<AutocompleteFieldType>)} />;
            case "sshLicences":
              return <SshLicencesField {...(commonProps as CommonProps<AutocompleteFieldType>)} />;
            case "geonames":
              return <GeonamesField {...(commonProps as CommonProps<AutocompleteFieldType>)} />;
            case "sheets":
              return <SheetsField {...(commonProps as CommonProps<AutocompleteFieldType>)} />;
            case "dansFormats":
              return <DansFormatsField {...(commonProps as CommonProps<AutocompleteFieldType>)} />;
            case "rdaworkinggroups":
              return <RdaWorkingGroupsField {...(commonProps as CommonProps<AutocompleteFieldType>)} />;
            case "pathways":
              return <RdaPathwaysField {...(commonProps as CommonProps<AutocompleteFieldType>)} />;
            case "domains":
              return <RdaDomainsField {...(commonProps as CommonProps<AutocompleteFieldType>)} />;
            case "interest groups":
              return <RdaInterestGroupsField {...(commonProps as CommonProps<AutocompleteFieldType>)} />;
            case "languageList":
              return <LanguagesField {...(commonProps as CommonProps<AutocompleteFieldType>)} />;
            case "elsst":
            case "narcis":
            case "dansCollections":
            case "gettyAat":
              return <DatastationsField {...(commonProps as CommonProps<AutocompleteFieldType>)} />;
            case "biodiversity_species_vernacular":
              return <BiodiversityField {...(commonProps as CommonProps<AutocompleteFieldType>)} variant="vernacular" />;
            case "biodiversity_species_scientific":
              return <BiodiversityField {...(commonProps as CommonProps<AutocompleteFieldType>)} variant="scientific" />;
            case "un_sustainable_development_goals":
              return <UnSustainableDevelopmentGoalsField {...(commonProps as CommonProps<AutocompleteFieldType>)} />;
            case "wikidata":
              return <WikidataField {...(commonProps as CommonProps<AutocompleteFieldType>)} />;
            default:
              return <AutocompleteField {...(commonProps as CommonProps<AutocompleteFieldType>)} />;
          }
        }
      default:
        return null;
    }
  };

  return (
    <Grid xs={12} md={field.fullWidth ? 12 : 6} sx={sx || undefined}>
      {getField()}
    </Grid>
  );
});

const GroupedField = ({ field }: GroupedFieldProps) => {
  const { i18n } = useTranslation();
  const fieldValue = useAppSelector(getField(field.name));

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
        <CardContent data-testid={`group-${field.name}`}>
        <Stack direction="row" flexWrap="wrap">
          {field.repeatable ? (
            (fieldValue?.value as []).map((_repeatableItem, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                sx={{
                  width: '100%', 
                  borderTop: index > 0 ? "1px solid" : "none",
                  borderColor: "neutral.main",
                  mt: index > 0 ? 1 : 0,
                  pt: index > 0 ? 1 : 0,
                }}
              >
                <Stack 
                  direction="row"
                  alignItems="center"
                  flexWrap="wrap"
                  sx={{ flex: 1 }}
                >
                  {(field.fields as InputField[]).map((f) => (
                    <SingleField
                      key={f.name}
                      field={f}
                      groupName={field.name}
                      groupIndex={index}
                    />
                  ))}
                </Stack>
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
            (field.fields as InputField[]).map((f) => (
              <SingleField
                key={f.name}
                field={f}
                groupName={field.name}
                groupIndex={0}
              />
            ))
          )}
          </Stack>
        </CardContent>
        {field.repeatable && (
          <CardActions sx={{ pl: 3, pr: 3, justifyContent: "right" }}>
            <Stack direction="row" alignItems="center" justifyContent="end">
              <AddButtonText field={field} />
            </Stack>
          </CardActions>
        )}
      </Card>
    </Grid>
  );
};

export { SingleField, GroupedField };
