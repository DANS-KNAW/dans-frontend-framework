import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useDebounce } from "use-debounce";
import { useTranslation } from "react-i18next";
import { useFetchOrcidQuery } from "../api/orcid";
import { useFetchRorByNameQuery } from "../api/ror";
import { useFetchGeonamesFreeTextQuery } from "../api/geonames";
import { useFetchGettyAATTermsQuery } from "../api/getty";
import { useFetchSheetsQuery } from "../api/sheets";
import { useFetchDatastationsTermQuery } from "../api/datastations";
import { useFetchDansFormatsQuery } from "../../files/api/dansFormats";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getFieldStatus } from "../metadataHelpers";
import { StatusIcon } from "../../generic/Icons";
import { setField, setMultiApiField, getField } from "../metadataSlice";
import type {
  AutocompleteFieldProps,
  AutocompleteAPIFieldProps,
} from "../../../types/MetadataProps";
import type { TypeaheadAPI, OptionsType } from "../../../types/MetadataFields";
import type { QueryReturnType } from "../../../types/Api";
import { lookupLanguageString } from "@dans-framework/utils";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import AutocompleteField, { InfoLink, InfoChip } from "./AutocompleteField";
import { getFormDisabled } from "../../../deposit/depositSlice";
import { useFetchLicencesQuery } from "../api/licences";
import { useFetchSshLicencesQuery } from "../api/sshLicences";
import { useFetchLanguagesQuery } from "../api/languages";
import { useFetchSpeciesQuery } from "../api/biodiversity";
import {
  useFetchGorcQuery,
  useFetchRdaWorkingGroupQuery,
  useFetchRdaPathwayQuery,
  useFetchRdaDomainQuery,
  useFetchRdaInterestGroupQuery,
} from "../api/rdaApi";
import { group } from "console";

/*
 *  Type ahead fields for different API endpoints
 *  Create a Component for every endpoint, as we cannot call a hook conditionally
 *  Debounce needed to give the API time to respond and not hammer it with requests
 *  Queries get cached by RTK Query
 */

export const OrcidField = ({ field, groupName, groupIndex }: AutocompleteFieldProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedInputValue = useDebounce(inputValue, 500)[0];
  // Fetch data on input change
  const { data, isFetching, isLoading } = useFetchOrcidQuery<QueryReturnType>(
    debouncedInputValue,
    { skip: debouncedInputValue === "" },
  );

  return (
    <AutocompleteAPIField
      field={field}
      groupName={groupName}
      groupIndex={groupIndex}
      inputValue={inputValue}
      setInputValue={setInputValue}
      debouncedInputValue={debouncedInputValue}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
};

export const RorField = ({ field, groupName, groupIndex }: AutocompleteFieldProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedInputValue = useDebounce(inputValue, 500)[0];
  // Fetch data on input change
  const { data, isFetching, isLoading } =
    useFetchRorByNameQuery<QueryReturnType>(debouncedInputValue, {
      skip: debouncedInputValue === "",
    });

  return (
    <AutocompleteAPIField
      field={field}
      groupName={groupName}
      groupIndex={groupIndex}
      inputValue={inputValue}
      setInputValue={setInputValue}
      debouncedInputValue={debouncedInputValue}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
};

export const GeonamesField = ({ field, groupName, groupIndex }: AutocompleteFieldProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedInputValue = useDebounce(inputValue, 500)[0];
  // Fetch data on input change
  const { data, isFetching, isLoading } =
    useFetchGeonamesFreeTextQuery<QueryReturnType>(debouncedInputValue, {
      skip: debouncedInputValue === "",
    });

  return (
    <AutocompleteAPIField
      field={field}
      groupName={groupName}
      groupIndex={groupIndex}
      inputValue={inputValue}
      setInputValue={setInputValue}
      debouncedInputValue={debouncedInputValue}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
};

export const GettyField = ({ field, groupName, groupIndex }: AutocompleteFieldProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedInputValue = useDebounce(inputValue, 500)[0];
  // Fetch data on input change
  const { data, isFetching, isLoading } =
    useFetchGettyAATTermsQuery<QueryReturnType>(debouncedInputValue, {
      skip: debouncedInputValue === "",
    });

  return (
    <AutocompleteAPIField
      field={field}
      groupName={groupName}
      groupIndex={groupIndex}
      inputValue={inputValue}
      setInputValue={setInputValue}
      debouncedInputValue={debouncedInputValue}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
};

export const DatastationsField = ({ field, groupName, groupIndex }: AutocompleteFieldProps) => {
  const { i18n } = useTranslation();
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedInputValue = useDebounce(inputValue, 500)[0];
  // Fetch data on input change
  const { data, isFetching, isLoading } =
    useFetchDatastationsTermQuery<QueryReturnType>(
      {
        vocabulary: field.options,
        lang: i18n.language,
        query: debouncedInputValue,
      },
      { skip: debouncedInputValue === "" },
    );

  return (
    <AutocompleteAPIField
      field={field}
      groupName={groupName}
      groupIndex={groupIndex}
      inputValue={inputValue}
      setInputValue={setInputValue}
      debouncedInputValue={debouncedInputValue}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
};

export const BiodiversityField = ({ field, variant, groupName, groupIndex }: AutocompleteFieldProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedInputValue = useDebounce(inputValue, 500)[0];
  // Fetch data on input change
  const { data, isFetching, isLoading } = useFetchSpeciesQuery<QueryReturnType>(
    { value: debouncedInputValue, variant: variant },
    { skip: debouncedInputValue === "" },
  );

  console.log(data)

  return (
    <AutocompleteAPIField
      field={field}
      groupName={groupName}
      groupIndex={groupIndex}
      inputValue={inputValue}
      setInputValue={setInputValue}
      debouncedInputValue={debouncedInputValue}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  );
};

// Google Sheets and DANS file formats fields, get all values at once
// So just use a simple AutocompleteField with options fetched from the API
export const DansFormatsField = ({ field, groupName, groupIndex }: AutocompleteFieldProps) => {
  // Fetch data right away
  const { data, isFetching, isLoading } =
    useFetchDansFormatsQuery<QueryReturnType>(null);
  const newField = {
    ...field,
    options: data && data.response ? data.response : [],
  };

  return (
    <AutocompleteField
      field={newField}
      groupName={groupName}
      groupIndex={groupIndex}
      isLoading={isLoading || isFetching}
    />
  );
};

export const SshLicencesField = ({ field, groupName, groupIndex }: AutocompleteFieldProps) => {
  // Fetch data right away
  const { data, isFetching, isLoading } =
    useFetchSshLicencesQuery<QueryReturnType>(null);
  const newField = {
    ...field,
    options: data && data.response ? data.response : [],
  };

  return (
    <AutocompleteField
      field={newField}
      groupName={groupName}
      groupIndex={groupIndex}
      isLoading={isLoading || isFetching}
    />
  );
};

export const LicensesField = ({ field, groupName, groupIndex }: AutocompleteFieldProps) => {
  // Fetch data right away
  const { data, isFetching, isLoading } =
    useFetchLicencesQuery<QueryReturnType>(null);
  const newField = {
    ...field,
    options: data && data.response ? data.response : [],
  };

  return (
    <AutocompleteField
      field={newField}
      groupName={groupName}
      groupIndex={groupIndex}
      isLoading={isLoading || isFetching}
    />
  );
};

export const LanguagesField = ({ field, groupName, groupIndex }: AutocompleteFieldProps) => {
  // Fetch data right away
  const { data, isFetching, isLoading } =
    useFetchLanguagesQuery<QueryReturnType>(null);
  const newField = {
    ...field,
    options: data && data.response ? data.response : [],
  };

  return (
    <AutocompleteField
      field={newField}
      groupName={groupName}
      groupIndex={groupIndex}
      isLoading={isLoading || isFetching}
    />
  );
};

export const GorcField = ({ field, groupName, groupIndex }: AutocompleteFieldProps) => {
  // Fetch data if field is opened
  const [touched, setTouched] = useState(false);
  const { data, isFetching, isLoading } = useFetchGorcQuery<QueryReturnType>(
    null,
    { skip: !touched },
  );
  const newField = {
    ...field,
    options: data && data.response ? data.response : [],
  };

  return (
    <AutocompleteField
      field={newField}
      groupName={groupName}
      groupIndex={groupIndex}
      isLoading={isLoading || isFetching}
      onOpen={() => setTouched(true)}
    />
  );
};

export const RdaPathwaysField = ({ field, groupName, groupIndex }: AutocompleteFieldProps) => {
  // Fetch data if field is opened
  const [touched, setTouched] = useState(false);
  const { data, isFetching, isLoading } =
    useFetchRdaPathwayQuery<QueryReturnType>(null, { skip: !touched });
  const newField = {
    ...field,
    options: data && data.response ? data.response : [],
  };

  return (
    <AutocompleteField
      field={newField}
      groupName={groupName}
      groupIndex={groupIndex}
      isLoading={isLoading || isFetching}
      onOpen={() => setTouched(true)}
    />
  );
};

export const RdaDomainsField = ({ field, groupName, groupIndex }: AutocompleteFieldProps) => {
  // Fetch data if field is opened
  const [touched, setTouched] = useState(false);
  const { data, isFetching, isLoading } =
    useFetchRdaDomainQuery<QueryReturnType>(null, { skip: !touched });
  const newField = {
    ...field,
    options: data && data.response ? data.response : [],
  };

  return (
    <AutocompleteField
      field={newField}
      groupName={groupName}
      groupIndex={groupIndex}
      isLoading={isLoading || isFetching}
      onOpen={() => setTouched(true)}
    />
  );
};

export const RdaInterestGroupsField = ({ field, groupName, groupIndex }: AutocompleteFieldProps) => {
  /// Fetch data if field is opened
  const [touched, setTouched] = useState(false);
  const { data, isFetching, isLoading } =
    useFetchRdaInterestGroupQuery<QueryReturnType>(null, { skip: !touched });
  const newField = {
    ...field,
    options: data && data.response ? data.response : [],
  };

  return (
    <AutocompleteField
      field={newField}
      groupName={groupName}
      groupIndex={groupIndex}
      isLoading={isLoading || isFetching}
      onOpen={() => setTouched(true)}
    />
  );
};

export const RdaWorkingGroupsField = ({ field, groupName, groupIndex }: AutocompleteFieldProps) => {
  // Fetch data if field is opened
  const [touched, setTouched] = useState(false);
  const { data, isFetching, isLoading } =
    useFetchRdaWorkingGroupQuery<QueryReturnType>(null, { skip: !touched });
  const newField = {
    ...field,
    options: data && data.response ? data.response : [],
  };

  return (
    <AutocompleteField
      field={newField}
      groupName={groupName}
      groupIndex={groupIndex}
      isLoading={isLoading || isFetching}
      onOpen={() => setTouched(true)}
    />
  );
};

export const SheetsField = ({ field, groupName, groupIndex }: AutocompleteFieldProps) => {
  // Fetch data if field is opened
  const [touched, setTouched] = useState(false);
  const { data, isFetching, isLoading } = useFetchSheetsQuery<QueryReturnType>(
    field.sheetOptions,
    { skip: !touched },
  );
  const newField = {
    ...field,
    options: data && data.response ? data.response : [],
  };

  return (
    <AutocompleteField
      field={newField}
      groupName={groupName}
      groupIndex={groupIndex}
      isLoading={isLoading || isFetching}
      onOpen={() => setTouched(true)}
    />
  );
};

export const MultiApiField = ({ field, groupName, groupIndex }: AutocompleteFieldProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("metadata");
  const formDisabled = useAppSelector(getFormDisabled);
  const fieldValue = useAppSelector(getField(field.name, groupName, groupIndex));

  const multiApiValue = (fieldValue?.multiApiValue || field.multiApiValue) as TypeaheadAPI;

  console.log(field)
  console.log(fieldValue)

  return (
    <Stack direction="row" alignItems="start">
      <FormControl sx={{ minWidth: 110, mr: 1 }}>
        <InputLabel id="select-api">{t("multiApiSelectLabel")}</InputLabel>
        <Select
          labelId="select-api"
          label={t("multiApiSelectLabel")}
          onChange={(e) => {
            // set the type of API used
            dispatch(
              setMultiApiField({
                field: field,
                value: e.target.value as TypeaheadAPI,
                ...(groupName !== undefined && { groupName: groupName }),
                ...(groupIndex !== undefined && { groupIndex: groupIndex }),
              }),
            );
          }}
          value={multiApiValue}
          disabled={formDisabled}
        >
          {Array.isArray(field.options) &&
            (field.options as TypeaheadAPI[]).map((option) => (
              <MenuItem key={option} value={option}>
                {t(`multi-${option}`)}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      {multiApiValue === "ror" && (
        <RorField field={field} groupName={groupName}
          groupIndex={groupIndex} />
      )}
      {multiApiValue === "orcid" && (
        <OrcidField field={field} groupName={groupName}
          groupIndex={groupIndex} />
      )}
      {multiApiValue === "gorc" && (
        <GorcField field={field} groupName={groupName}
          groupIndex={groupIndex} />
      )}
      {multiApiValue  === "geonames" && (
        <GeonamesField field={field} groupName={groupName}
          groupIndex={groupIndex} />
      )}
      {multiApiValue  === "getty" && (
        <GettyField field={field} groupName={groupName}
          groupIndex={groupIndex} />
      )}
      {multiApiValue  === "sheets" && (
        <SheetsField field={field} groupName={groupName}
          groupIndex={groupIndex} />
      )}
      {multiApiValue  === "dansFormats" && (
        <DansFormatsField field={field} groupName={groupName}
          groupIndex={groupIndex} />
      )}
      {(multiApiValue  === "elsst" ||
        multiApiValue  === "dansCollections" ||
        multiApiValue  === "narcis") && (
          <DatastationsField field={field} groupName={groupName}
            groupIndex={groupIndex} />
        )}
      {multiApiValue  === "rdaworkinggroups" && (
        <RdaWorkingGroupsField field={field} groupName={groupName}
          groupIndex={groupIndex} />
      )}
      {multiApiValue  === "pathways" && (
        <RdaPathwaysField field={field} groupName={groupName}
          groupIndex={groupIndex} />
      )}
      {multiApiValue  === "domains" && (
        <RdaDomainsField field={field} groupName={groupName}
          groupIndex={groupIndex} />
      )}
      {multiApiValue  === "interest groups" && (
        <RdaInterestGroupsField field={field} groupName={groupName}
          groupIndex={groupIndex} />
      )}
      {multiApiValue  === "biodiversity_species_vernacular" && (
        <BiodiversityField field={field} groupName={groupName}
          groupIndex={groupIndex} variant="vernacular" />
      )}
      {multiApiValue  === "biodiversity_species_scientific" && (
        <BiodiversityField field={field} groupName={groupName}
          groupIndex={groupIndex} variant="scientific" />
      )}
    </Stack>
  );
};

const AutocompleteAPIField = ({
  field,
  groupName,
  groupIndex,
  inputValue,
  setInputValue,
  debouncedInputValue,
  data,
  isLoading,
  isFetching,
}: AutocompleteAPIFieldProps) => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation("metadata");
  const formDisabled = useAppSelector(getFormDisabled);
  const fieldValue = useAppSelector(getField(field.name, groupName, groupIndex));
  const status = getFieldStatus(field, fieldValue);
  const apiValue = (
    Array.isArray(field.options) ?
    fieldValue?.multiApiValue
      : field.options) as TypeaheadAPI;

  // on initial render, check if field has a default value, and if so, add it to the value state
  useEffect(() => {
    if (field.value && !fieldValue) {
      dispatch(
        setField({
          field: field,
          value: field.value,
          ...(groupName !== undefined && { groupName: groupName }),
          ...(groupIndex !== undefined && { groupIndex: groupIndex }),
        }),
      );
    }
  }, []);

  return (
    <Stack direction="row" alignItems="start" sx={{ flex: 1 }}>
      <Autocomplete
        multiple={field.multiselect}
        fullWidth
        includeInputInList
        id={field.name}
        options={
          (
            inputValue &&
            debouncedInputValue === inputValue &&
            data &&
            data.arg === debouncedInputValue
          ) ?
            data.response
            : []
        }
        value={fieldValue?.value || (field.multiselect ? [] : null)}
        inputValue={
          inputValue ||
          (!inputValue &&
            fieldValue?.value &&
            !Array.isArray(fieldValue?.value) &&
            lookupLanguageString(fieldValue?.value.label, i18n.language)) ||
          ""
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={`${lookupLanguageString(field.label, i18n.language)}${field.required ? " *" : ""
              }`}
            error={status === "error" && field.touched}
            helperText={status === "error" && field.touched && t("incorrect")}
            placeholder={lookupLanguageString(field.placeholder, i18n.language)}
            InputProps={{
              ...params.InputProps,
              startAdornment:
                (
                  !field.multiselect &&
                  fieldValue?.value &&
                  !Array.isArray(fieldValue?.value) &&
                  fieldValue?.value.value &&
                  fieldValue?.value.value.startsWith("http")
                ) ?
                  <InfoLink link={fieldValue?.value.value} apiValue={apiValue} />
                  : params.InputProps.startAdornment,
            }}
            inputProps={{
              ...params.inputProps,
              "data-testid": `${field.name}-${field.id}`,
            }}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <InfoChip
              key={index}
              option={option}
              apiValue={apiValue}
              getTagProps={getTagProps}
              index={index}
            />
          ))
        }
        onChange={(_e, newValue, reason) => {
          // Gets set when user selects a value from the list
          // Make sure a mandatory value cannot get erased from a multiselect
          const saveValues = (reason === "clear" ||
            reason === "removeOption") &&
            Array.isArray(fieldValue.value) &&
            Array.isArray(newValue) && [
              ...fieldValue.value.filter((v) => v.mandatory),
              ...newValue.filter((v) => !v.hasOwnProperty("mandatory")),
            ];

          // In case freesolo is enabled and value selected using 'Enter', it's a string.
          // So we need to convert that string to an OptionsType
          const setValue =
            // check if it's a multiselect field with a freetext input and value is selected using enter
            (
              Array.isArray(newValue) &&
              field.allowFreeText &&
              typeof newValue[newValue.length - 1] === "string"
            ) ?
              [
                ...newValue.slice(0, -1),
                {
                  value: newValue[newValue.length - 1],
                  freetext: true,
                  label: newValue[newValue.length - 1],
                },
              ]
              // the same for non-multiselect
              : typeof newValue === "string" ?
                { label: newValue, value: newValue, freetext: true }
                // otherwise just return the new value
                : newValue;

          // Set the field
          dispatch(
            setField({
              field: field,
              value: (saveValues || setValue) as OptionsType | OptionsType[],
              ...(groupName !== undefined && { groupName: groupName }),
              ...(groupIndex !== undefined && { groupIndex: groupIndex }),
            }),
          );

          // For freesolo, we reset the input value here
          field.allowFreeText &&
            (reason === "createOption" || reason === "selectOption") &&
            setInputValue("");
        }}
        onInputChange={(e, newValue) => {
          // Gets set when user starts typing
          e && e.type === "change" && setInputValue(newValue);
          // Clears input when user selects a value (inputValue becomes value, which gets displayed in the field)
          // or when a user clicks outside of the box without selecting a value
          e && (e.type === "click" || e.type === "blur") && setInputValue("");
        }}
        noOptionsText={
          !inputValue ? t("startTyping", { api: t(apiValue), freeText: field.allowFreeText ? t('freeText') : '' }) : t("noResults")
        }
        loading={
          isFetching ||
          isLoading ||
          debouncedInputValue !== inputValue ||
          // this final check is somewhat hacky: we want freesolo to always display a dropdown box
          field.allowFreeText
        }
        loadingText={
          (
            field.allowFreeText &&
            !isLoading &&
            !isFetching &&
            debouncedInputValue === inputValue
          ) ?
            // for freesolo, display the dropdown message when not searching
            t("startTyping", { api: t(apiValue), freeText: field.allowFreeText ? t('freeText') : '' })
            // otherwise the loading indicator
            : <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="end"
            >
              {t("loading")} <CircularProgress size={18} />
            </Stack>
        }
        renderOption={(props, option) => (
          <li {...props} key={option.value} style={{ flexWrap: "wrap" }}>
            {option.categoryLabel && option.categoryContent && (
              <Typography
                component="div"
                sx={{ width: "100%", fontSize: "0.8rem" }}
                color="neutral.contrastText"
              >
                <Typography
                  component="span"
                  sx={{ fontWeight: "600", fontSize: "inherit" }}
                >
                  {t(option.categoryLabel)}
                </Typography>
                : {option.categoryContent}
              </Typography>
            )}
            {lookupLanguageString(option.label, i18n.language)}
            {option.extraContent && option.extraLabel && (
              <Typography
                component="div"
                sx={{ width: "100%", fontSize: "0.8rem" }}
                color="neutral.contrastText"
              >
                <Typography
                  component="span"
                  sx={{ fontWeight: "600", fontSize: "inherit" }}
                >
                  {t(option.extraLabel)}
                </Typography>
                : {option.extraContent}
              </Typography>
            )}
            {option.id && option.idLabel && (
              <Typography
                component="div"
                sx={{ width: "100%", fontSize: "0.8rem" }}
                color="neutral.contrastText"
              >
                <Typography
                  component="span"
                  sx={{ fontWeight: "600", fontSize: "inherit" }}
                >
                  {t(option.idLabel)}
                </Typography>
                : {option.id}
              </Typography>
            )}
          </li>
        )}
        freeSolo={field.allowFreeText}
        forcePopupIcon
        filterOptions={(options, params) => {
          // only for freesolo, add input directly as option
          if (
            field.allowFreeText &&
            !isLoading &&
            !isFetching &&
            debouncedInputValue === inputValue
          ) {
            const filter = createFilterOptions<OptionsType>();
            const filtered = filter(options, params);
            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some(
              (option) => inputValue === option.label,
            );
            if (inputValue !== "" && !isExisting) {
              filtered.push({
                value: inputValue,
                label: inputValue,
                freetext: true,
                extraLabel: t("freetextLabel", { api: t(apiValue) }) as string,
                extraContent: t("freetextContent", {
                  name: inputValue,
                }) as string,
              });
            }

            return filtered;
          } else {
            return options;
          }
        }}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        /*
         * For freesolo, we can either choose autoSelect or clearOnBlur, depends on the behaviour we want.
         * AutoSelect just uses the value as typed, clearOnBlur forces the user to make a conscious selection
         * For autoSelect, we could remove most of the filterOptions logic and the extra check in onChange.
         */
        clearOnBlur
        disabled={formDisabled}
      />
      <StatusIcon
        margin="lt"
        status={status}
        title={lookupLanguageString(field.description, i18n.language)}
        subtitle={t("apiValue", { api: t(apiValue) }) as string}
      />
    </Stack>
  );
};
