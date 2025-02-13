import { useEffect } from "react";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setField, getField } from "../metadataSlice";
import { getFieldStatus } from "../metadataHelpers";
import { StatusIcon } from "../../generic/Icons";
import { lookupLanguageString } from "@dans-framework/utils";
import type {
  RadioFieldProps,
  CheckFieldProps,
} from "../../../types/MetadataProps";
import { useTranslation } from "react-i18next";
import { getFormDisabled } from "../../../deposit/depositSlice";

// List of radio button options. First value of the options is selected by default, so no need for status checking.
export const RadioField = ({ field, groupName, groupIndex }: RadioFieldProps) => {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const formDisabled = useAppSelector(getFormDisabled);
  const fieldValue = useAppSelector(getField(field.name, groupName, groupIndex));
  const status = getFieldStatus(fieldValue);

  // on initial render, check if field has a value set, and if so, set it to state
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
    <FormControl>
      {field.label && (
        <FormLabel sx={{ display: "flex", mb: 1 }}>
          <StatusIcon
            status={status}
            margin="r"
            title={lookupLanguageString(field.description, i18n.language)}
          />
          {lookupLanguageString(field.label, i18n.language)}
        </FormLabel>
      )}
      <RadioGroup
        row={field.layout === "row"}
        aria-labelledby={field.id}
        data-testid={`${field.name}-${field.id}`}
        name={field.name}
        value={fieldValue?.value || ""}
        onChange={(e) =>
          dispatch(
            setField({
              field: field,
              value: e.target.value,
              ...(groupName !== undefined && { groupName: groupName }),
              ...(groupIndex !== undefined && { groupIndex: groupIndex }),
            }),
          )
        }
      >
        {field.options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio sx={{ mr: 0.15 }} />}
            label={lookupLanguageString(option.label, i18n.language)}
            disabled={formDisabled}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

// For a list of checkboxes, we keep the selected values in an array.
export const CheckField = ({ field, groupName, groupIndex }: CheckFieldProps) => {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const formDisabled = useAppSelector(getFormDisabled);
  const fieldValue = useAppSelector(getField(field.name, groupName, groupIndex));
  const status = getFieldStatus(fieldValue);

  return (
    <FormControl
      required={field.required}
      error={field.required && fieldValue?.value?.length === 0}
      component="fieldset"
    >
      {field.label && (
        <FormLabel sx={{ display: "flex", mb: 1 }}>
          <StatusIcon
            status={status}
            margin="r"
            title={lookupLanguageString(field.description, i18n.language)}
          />
          {lookupLanguageString(field.label, i18n.language)}
        </FormLabel>
      )}
      <FormGroup data-testid={`${field.name}-${field.id}`}>
        {field.options.map((option) => (
          <Stack direction="row" alignItems="center" key={option.value}>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{ mr: 0.15 }}
                  checked={Boolean(
                    fieldValue?.value && fieldValue.value.indexOf(option.value) !== -1,
                  )}
                  onChange={(e) => {
                    // set the field value
                    dispatch(
                      setField({
                        field: field,
                        value:
                          e.target.checked ?
                            [...(fieldValue?.value || ""), e.target.name]
                          : fieldValue?.value!.filter(
                              (item) => item !== e.target.name,
                            ),
                        ...(groupName !== undefined && { groupName: groupName }),
                        ...(groupIndex !== undefined && { groupIndex: groupIndex }),
                      }),
                    );
                  }}
                  name={option.value}
                  disabled={formDisabled}
                />
              }
              label={lookupLanguageString(option.label, i18n.language)}
            />
            {!field.label && (
              // todo: maybe we should make individual checkboxes required/not required
              <StatusIcon
                status={status}
                title={lookupLanguageString(field.description, i18n.language)}
              />
            )}
          </Stack>
        ))}
      </FormGroup>
    </FormControl>
  );
};
