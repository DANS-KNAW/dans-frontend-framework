import { useEffect, useState, Fragment } from "react";
import { useAuth } from "react-oidc-context";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import RefreshIcon from "@mui/icons-material/Refresh";
import InputAdornment from "@mui/material/InputAdornment";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { StatusIcon } from "../../generic/Icons";
import { AddDeleteControls } from "../MetadataButtons";
import { setField, getMetadata, getField, getFieldValues } from "../metadataSlice";
import { getFieldStatus } from "../metadataHelpers";
import type { TextFieldProps } from "../../../types/MetadataProps";
import { lookupLanguageString } from "@dans-framework/utils";
import { getFormDisabled } from "../../../deposit/depositSlice";
import moment from "moment";

import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const SingleTextField = ({
  field,
  groupName,
  groupIndex,
}: TextFieldProps) => {
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const { t, i18n } = useTranslation("metadata");
  const formDisabled = useAppSelector(getFormDisabled);
  const metadata = useAppSelector(getMetadata);
  const [generatedValue, setGeneratedValue] = useState<string>("");
  const fieldValue = useAppSelector(getField(field.name, groupName, groupIndex));
  const status = getFieldStatus(field, fieldValue);
  const allFieldValues = useAppSelector(getFieldValues);

  // on initial render, check if field has a value set, and if so, set it to state
  useEffect(() => { 
    if (field.value && !fieldValue) {
      dispatch(
        setField({
          field: field,
          value: field.value,
          ...(field.repeatable && { fieldIndex: 0 }),
        }),
      );
    }
  }, []);

  useEffect(() => {
    // if requested, auto fill user data from oidc, if field has no (manually) set value
    if (field.autofill && auth.user && !fieldValue) {
      dispatch(
        setField({
          field: field,
          value: auth.user.profile[field.autofill] as string,
          // support repeatable fields too
          ...(field.repeatable && { fieldIndex: 0 }),
        }),
      );
    }
  }, [dispatch, field.autofill, field.name, auth.user, fieldValue]);

  // function to generate value from form config string and filled in fields
  // set to state, so we only have to call this function once
  const generateValue = () => {
    const generatedString = lookupLanguageString(
      field.autoGenerateValue,
      i18n.language,
    );
    // split string into segments to replace
    const segments = generatedString ? generatedString.split(/({{.*?}})/) : [];
    const value = segments.map((segment) => {
      const match = segment.match(/{{(.*?)}}/);
      if (match) {
        const matchedField = getNestedField(allFieldValues, match[1]);
        return (
          matchedField && matchedField.value && !matchedField.private ?
            matchedField.type === "autocomplete" ?
              Array.isArray(field.value) ?
              matchedField.value.map((v) => v.label).join(" & ")
              : matchedField.value.label
              // if field type is date, just convert it to DD-MM-YYYY for every value
              // TODO: should any other app than ohsmart want to use this, modify this where necessary
            : matchedField.type === "date" ?
              moment(field.value, field.format)
                .startOf("day")
                .format("DD-MM-YYYY")
            : matchedField.type === "daterange" ?
              moment(field.value[0], field.format)
                .startOf("day")
                .format("DD-MM-YYYY")
            : matchedField.value
          : null
        );
      }
      return segment;
    });

    if (!value.includes(null)) {
      setGeneratedValue(value.join(""));
    }
  };

  const setValue = () => {
    dispatch(
      setField({
        field: field,
        value: generatedValue,
      }),
    );
  };

  // generate the value, makes sure this updates when value state has been set
  useEffect(() => {
    if (field.autoGenerateValue) {
      // generate value if it hasn't been do so yet
      !generatedValue && generateValue();
      // if there's no value set yet, set value to generated value
      generatedValue && !fieldValue?.value && setValue();
    }
  }, [generatedValue]);

  return (
    <Stack direction="column" alignItems="center">
      {field.repeatable ? (
        (Array.isArray(fieldValue?.value) ? fieldValue?.value : [{}]).map((repeatableItem, index) => (
          <Stack direction="row" alignItems="flex-start" key={index} sx={{width: '100%'}}>
            <FieldInput
              fieldValue={repeatableItem}
              field={field}
              onChange={(e) =>
                dispatch(
                  setField({
                    field,
                    fieldIndex: index,
                    value: e.target.value,
                    ...(groupName !== undefined && { groupName: groupName }),
                    ...(groupIndex !== undefined && { groupIndex: groupIndex }),
                  })
                )
              }
              index={index}
            />
            <AddDeleteControls
              fieldValue={fieldValue?.value}
              fieldIndex={index}
              field={field}
              groupName={groupName}
              groupIndex={groupIndex}
            />
          </Stack>
        ))
      ) : (
        <FieldInput
          fieldValue={fieldValue}
          field={field}
          onChange={(e) =>
            dispatch(
              setField({
                field,
                value: e.target.value,
                ...(groupName !== undefined && { groupName: groupName }),
                ...(groupIndex !== undefined && { groupIndex: groupIndex }),
              })
            )
          }
        />
      )}
      {field.autoGenerateValue && (
        // auto generation of title field if allowed (all specced fields filled and public)
        <Tooltip title={generatedValue ? t("generate") : t("generateDisabled")}>
          <span>
            <IconButton
              onClick={() => setValue()}
              sx={{
                ml: 0.5,
                // keep icon centered
                mt: status === "error" && field.touched ? -3 : 0,
              }}
              disabled={!generatedValue ? true : false}
            >
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
      )}
    </Stack>
  );
};

const FieldInput = ({ field, fieldValue, onChange, index }) => {
  const { t, i18n } = useTranslation("metadata");
  const status = getFieldStatus(field, fieldValue);
  const formDisabled = useAppSelector(getFormDisabled);

  return (
    <TextField
      fullWidth
      error={status === "error" && fieldValue?.touched}
      helperText={status === "error" && fieldValue?.touched && t("incorrect")}
      variant="outlined"
      type={field.type}
      label={
        index !== undefined
          ? `${lookupLanguageString(field.label, i18n.language)} #${index + 1}`
          : lookupLanguageString(field.label, i18n.language)
      }
      required={field.required}
      multiline={field.multiline}
      rows={field.multiline ? 4 : ""}
      value={fieldValue?.value || ""}
      disabled={
        (field.disabled &&
          !(field.autofill && !auth.user?.profile[field.autofill])) ||
        formDisabled
      }
      onChange={onChange}
      placeholder={field.placeholder}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <StatusIcon
              status={status}
              title={
                field.description &&
                lookupLanguageString(field.description, i18n.language)
              }
            />
          </InputAdornment>
        ),
      }}
      inputProps={{
        "data-testid": `${field.name}-${field.id}${
          index !== undefined ? `-${index}` : ""
        }`,
      }}
      sx={{
        mT: field.repeatable ? 2 : 0
      }}
    />
  )
};

// helper to get nested field values for auto generation
const getNestedField = (obj, path): string => {
  const keys = path.includes('.') ? path.split('.') : [path];

  return keys.reduce((acc, key) => {
    if (acc?.value instanceof Array) {
      return acc.value[0]?.[key]; // Assume first element in array
    }
    return acc?.[key];
  }, obj);
};

export default SingleTextField;
