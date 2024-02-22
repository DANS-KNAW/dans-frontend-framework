import Stack from "@mui/material/Stack";
import { DateTimeField as MUIDateTimeField } from "@mui/x-date-pickers/DateTimeField";
import moment, { Moment } from "moment";
import InputAdornment from "@mui/material/InputAdornment";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { StatusIcon } from "../../generic/Icons";
import { AddButton, DeleteButton } from "../MetadataButtons";
import { setField, setDateTypeField } from "../metadataSlice";
import { getFieldStatus } from "../metadataHelpers";
import type { DateFieldProps } from "../../../types/MetadataProps";
import { lookupLanguageString } from "@dans-framework/utils";
import { getFormDisabled } from "../../../deposit/depositSlice";

// Date and time selection component
// Allows a user to select input type (date and time, date, month and year, year) if specified in config

const DateTimeField = ({
  field,
  sectionIndex,
  groupedFieldId,
  currentField = 0,
  totalFields = 1,
}: DateFieldProps) => {
  const dispatch = useAppDispatch();
  const status = getFieldStatus(field);
  const { t, i18n } = useTranslation("metadata");
  const formDisabled = useAppSelector(getFormDisabled);

  return (
    <Stack direction="row" alignItems="start">
      {field.formatOptions && (
        <FormControl sx={{ minWidth: 110, mr: 1 }}>
          <InputLabel>{t("selectDateType")}</InputLabel>
          <Select
            label={t("selectDateType")}
            onChange={(e) => {
              // set the type of date
              dispatch(
                setDateTypeField({
                  sectionIndex: sectionIndex,
                  id: field.id,
                  value: e.target.value,
                }),
              );
              // and reset the currently selected value if there is one
              field.value &&
                dispatch(
                  setField({
                    sectionIndex: sectionIndex,
                    id: field.id,
                    value: "",
                  }),
                );
            }}
            value={field.format}
            disabled={formDisabled}
            inputProps={{'data-testid': `datetype-${field.name}-${field.id}`}}
          >
            {field.formatOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {t(option)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <MUIDateTimeField
        fullWidth
        format={field.format}
        helperText={status === "error" && field.touched && t("incorrect")}
        label={lookupLanguageString(field.label, i18n.language)}
        required={field.required}
        value={(field.value && moment(field.value, field.format)) || null}
        disabled={field.disabled || formDisabled}
        minDate={
          field.minDate
            ? moment(field.minDate, field.format)
            : moment().subtract(273790, "year")
        }
        maxDate={
          field.maxDate
            ? moment(field.maxDate, field.format)
            : moment().add(100, "year")
        }
        onChange={(value: Moment | null, context) => {
          // Serialize the date value we get from the component so we can store it using Redux
          const dateValue =
            !context.validationError && value ? value.format(field.format) : "";
          dispatch(
            setField({
              sectionIndex: sectionIndex,
              id: field.id,
              value: dateValue,
            }),
          );
        }}
        sx={{
          mt: groupedFieldId && currentField !== 0 ? 1 : 0,
        }}
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
        inputProps={{'data-testid': `${field.name}-${field.id}`}}
        slotProps={{
          textField: { error: status === "error" && field.touched },
        }}
      />
      {groupedFieldId &&
        !formDisabled && [
          totalFields > 1 && (
            <DeleteButton
              key="delete"
              sectionIndex={sectionIndex}
              groupedFieldId={groupedFieldId}
              deleteFieldIndex={currentField}
              mt={currentField === 0 ? 1.75 : 2.75}
              deleteGroupId={field.id}
              groupedFieldName={field.name}
            />
          ),
          currentField + 1 === totalFields && (
            <AddButton
              key="add"
              sectionIndex={sectionIndex}
              groupedFieldId={groupedFieldId}
              type="single"
              mt={currentField === 0 ? 1.75 : 2.75}
              groupedFieldName={field.name}
            />
          ),
        ]}
    </Stack>
  );
};

export default DateTimeField;
