import { useEffect, useState } from "react";
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
import { setField, getMetadata } from "../metadataSlice";
import { getFieldStatus, findByIdOrName } from "../metadataHelpers";
import type { TextFieldProps } from "../../../types/MetadataProps";
import { lookupLanguageString } from "@dans-framework/utils";
import { getFormDisabled } from "../../../deposit/depositSlice";
import moment from "moment";

const SingleTextField = ({
  field,
  sectionIndex,
  groupedFieldId,
  currentField = 0,
  totalFields = 1,
}: TextFieldProps) => {
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const status = getFieldStatus(field);
  const { t, i18n } = useTranslation("metadata");
  const formDisabled = useAppSelector(getFormDisabled);
  const metadata = useAppSelector(getMetadata);
  const [generatedValue, setGeneratedValue] = useState<string>("");

  useEffect(() => {
    // if requested, auto fill user data from oidc, if field has no (manually) set value
    if (field.autofill && auth.user && !field.value) {
      dispatch(
        setField({
          sectionIndex: sectionIndex,
          id: field.id,
          value: auth.user.profile[field.autofill] as string,
        }),
      );
    }
  }, [dispatch, field.autofill, field.id, sectionIndex, auth.user]);

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
        const field = metadata
          .map((section) => findByIdOrName(match[1], section.fields, "name"))
          .filter(Boolean)[0];

        return (
          field && field.value && !field.private ?
            field.type === "autocomplete" ?
              Array.isArray(field.value) ?
                field.value.map((v) => v.label).join(" & ")
              : field.value.label
              // if field type is date, just convert it to DD-MM-YYYY for every value
              // TODO: should any other app than ohsmart want to use this, modify this where necessary
            : field.type === "date" ?
              moment(field.value, field.format).startOf("day").format("DD-MM-YYYY")
            : field.type === "daterange" ?
              moment(field.value[0], field.format).startOf("day").format("DD-MM-YYYY")
            : field.value
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
        sectionIndex: sectionIndex,
        id: field.id,
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
      !field.value && setValue();
    }
  }, [generatedValue]);


  return (
    <Stack direction="row" alignItems="center">
      <TextField
        fullWidth
        error={status === "error" && field.touched}
        helperText={status === "error" && field.touched && t("incorrect")}
        variant="outlined"
        type={field.type}
        label={lookupLanguageString(field.label, i18n.language)}
        required={field.required}
        multiline={field.multiline}
        rows={field.multiline ? 4 : ""}
        value={field.value || ""}
        disabled={
          (field.disabled &&
            !(field.autofill && !auth.user?.profile[field.autofill])) ||
          formDisabled
        }
        onChange={(e) =>
          dispatch(
            setField({
              sectionIndex: sectionIndex,
              id: field.id,
              value: e.target.value,
            }),
          )
        }
        sx={{
          mt: groupedFieldId && currentField !== 0 ? 1 : 0,
        }}
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
        inputProps={{ "data-testid": `${field.name}-${field.id}` }}
      />
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
      <AddDeleteControls 
        groupedFieldId={groupedFieldId}
        totalFields={totalFields}
        sectionIndex={sectionIndex}
        currentField={currentField}
        field={field}
      />
    </Stack>
  );
};

export default SingleTextField;
