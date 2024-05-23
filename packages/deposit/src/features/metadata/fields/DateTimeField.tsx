import { useState, useMemo } from "react";
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
import { AddDeleteControls } from "../MetadataButtons";
import { setField, setDateTypeField } from "../metadataSlice";
import { getFieldStatus } from "../metadataHelpers";
import type { DateFieldProps } from "../../../types/MetadataProps";
import { lookupLanguageString } from "@dans-framework/utils";
import { getFormDisabled } from "../../../deposit/depositSlice";
import type { DateValidationError } from "@mui/x-date-pickers/models";
import type { DateFieldType } from "../../../types/MetadataFields";

// Date and time selection component
// Allows a user to select input type (date and time, date, month and year, year) if specified in config

export const DateTimeField = ({
  field,
  sectionIndex,
  groupedFieldId,
  currentField = 0,
  totalFields = 1,
}: DateFieldProps) => {
  return (
    <Stack direction="row" alignItems="start">
      <DateTypeWrapper 
        field={field}
        sectionIndex={sectionIndex}
        currentField={currentField}
      />

      <DateFieldWrapper
        field={field}
        sectionIndex={sectionIndex}
        groupedFieldId={groupedFieldId}
        currentField={currentField}
      />

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


export const DateRangeField = ({
  field,
  sectionIndex,
  groupedFieldId,
  currentField = 0,
  totalFields = 1,
}: DateFieldProps) => {
  return (
    <Stack direction="row" alignItems="start">
      <DateTypeWrapper 
        field={field}
        sectionIndex={sectionIndex}
        currentField={currentField}
      />

      <DateFieldWrapper
        field={field}
        sectionIndex={sectionIndex}
        groupedFieldId={groupedFieldId}
        currentField={currentField}
        mr={1}
        range={0}
      />

      <DateFieldWrapper
        field={field}
        sectionIndex={sectionIndex}
        groupedFieldId={groupedFieldId}
        currentField={currentField}
        range={1}
      />

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

const DateFieldWrapper = ({ field, sectionIndex, groupedFieldId, currentField, mr, range }: {
  field: DateFieldType; 
  sectionIndex: number;
  groupedFieldId?: string;
  currentField?: number;
  mr?: number;
  range?: number;
}) => {
  const { t, i18n } = useTranslation("metadata");
  const [error, setError] = useState<DateValidationError | null>(null);
  const formDisabled = useAppSelector(getFormDisabled);
  const dispatch = useAppDispatch();
  const status = getFieldStatus(field);

  const errorMessage = useMemo(() => {
    switch (error) {
      case "maxDate": {
        return t("dateMax");
      }
      case "minDate": {
        return t("dateMin");
      }
      case "invalidDate": {
        return t("dateInvalid");
      }

      default: {
        return "";
      }
    }
  }, [error]);

  return (
    <MUIDateTimeField
      fullWidth
      format={field.format}
      helperText={status === "error" && field.touched && t("incorrect")}
      label={`
        ${lookupLanguageString(field.label, i18n.language)} 
        ${typeof range === 'number' && range === 0 ? `: ${t('dateStart')}` : `: ${t('dateEnd')}`}
      `}
      required={field.required}
      value={(field.value && moment(field.value, field.format)) || null}
      disabled={field.disabled || formDisabled}
      minDate={
        field.minDate ?
          moment(field.minDate, field.format)
        : moment().subtract(273790, "year")
      }
      maxDate={
        field.maxDate ?
          moment(field.maxDate, field.format)
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
      onError={(newError) => setError(newError as DateValidationError)}
      sx={{
        mt: groupedFieldId && currentField !== 0 ? 1 : 0,
        mr: mr,
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
      inputProps={{ "data-testid": `${field.name}-${field.id}` }}
      slotProps={{
        textField: {
          error:
            (status === "error" && field.touched) || error ? true : false,
          helperText: errorMessage,
        },
      }}
    />
  )
}

const DateTypeWrapper = ({field, sectionIndex, currentField}: {
  field: DateFieldType;
  sectionIndex: number;
  currentField: number;
}) => {
  const formDisabled = useAppSelector(getFormDisabled);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("metadata");

  return (
    field.formatOptions ?
      <FormControl
        sx={{ minWidth: 110, mr: 1, mt: currentField > 0 ? 1 : 0 }}
      >
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
          inputProps={{ "data-testid": `datetype-${field.name}-${field.id}` }}
        >
          {field.formatOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {t(option)}
            </MenuItem>
          ))}
        </Select>
      </FormControl> 
      : null
  )
}