import { useState, useMemo, useEffect } from "react";
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
import { setField, setDateTypeField, getField } from "../metadataSlice";
import { getFieldStatus } from "../metadataHelpers";
import type {
  DateFieldProps,
  DateRangeFieldProps,
} from "../../../types/MetadataProps";
import { lookupLanguageString } from "@dans-framework/utils";
import { getFormDisabled } from "../../../deposit/depositSlice";
import type {
  DateValidationError,
  TimeValidationError,
} from "@mui/x-date-pickers/models";
import type {
  DateFieldType,
  DateRangeFieldType,
  DateTimeFormat,
} from "../../../types/MetadataFields";

// Date and time selection component
// Allows a user to select input type (date and time, date, month and year, year) if specified in config

export const DateTimeField = ({
  field,
  groupName,
  groupIndex,
}: DateFieldProps) => {
  const { t, i18n } = useTranslation("metadata");
  const [error, setError] = useState<
    DateValidationError | TimeValidationError | null
  >(null);
  const formDisabled = useAppSelector(getFormDisabled);
  const dispatch = useAppDispatch();
  const fieldValue = useAppSelector(getField(field.name, groupName, groupIndex));
  const status = getFieldStatus(fieldValue, field);

  const errorMessage = useMemo(() => {
    switch (error) {
      case "maxDate":
      case "maxTime": {
        return t("dateMax");
      }
      case "minTime":
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

  const fieldFormat = fieldValue?.format || field.format;

  return (
    <Stack direction="row" alignItems="start">
      <DateTypeWrapper
        field={field}
        groupIndex={groupIndex}
        groupName={groupName}
      />

      <MUIDateTimeField
        fullWidth
        format={fieldFormat}
        helperText={status === "error" && fieldValue?.touched && t("incorrect")}
        label={lookupLanguageString(field.label, i18n.language)}
        required={field.required}
        value={(fieldValue?.value && moment(fieldValue.value, fieldFormat)) || null}
        disabled={field.disabled || formDisabled}
        minDate={
          field.minDate ?
            moment(field.minDate, fieldFormat)
          : moment().subtract(273790, "year")
        }
        maxDate={
          field.maxDate ?
            moment(field.maxDate, fieldFormat)
          : moment().add(100, "year")
        }
        onChange={(value: Moment | null, context) => {
          // Serialize the date value we get from the component so we can store it using Redux
          const dateValue =
            !context.validationError && value ? value.format(fieldFormat) : "";
          dispatch(
            setField({
              field: field,
              value: dateValue,
              ...(groupName !== undefined && { groupName: groupName }),
              ...(groupIndex !== undefined && { groupIndex: groupIndex }),
            }),
          );
        }}
        onError={(newError) =>
          setError(newError as DateValidationError | TimeValidationError)
        }
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
              (status === "error" && fieldValue?.touched) || error ? true : false,
            helperText: errorMessage,
          },
        }}
      />
    </Stack>
  );
};

// Date range field, allows user to select start and end date
// Always checks if end date is later than start date
// End date can be optional

export const DateRangeField = ({
  field,
  groupName,
  groupIndex,
}: DateRangeFieldProps) => {
  const fieldValue = useAppSelector(getField(field.name, groupName, groupIndex));
  const fieldFormat = fieldValue?.format || field.format;
  const [range, setRange] = useState<(string | null)[]>(
    fieldValue?.value || field.value || [null, null],
  );
  const [format, setFormat] = useState<string>(fieldFormat);
  const dispatch = useAppDispatch();

  const setStart = (dateString: string) => {
    setRange([dateString, range[1]]);
  };

  const setEnd = (dateString: string) => {
    setRange([range[0], dateString]);
  };

  // Dispatch form action when range is changed
  // Don't dispatch when range is still null, to keep initial
  // 'touched' status of field
  useEffect(() => {
    !range.every((el) => el === null) &&
      dispatch(
        setField({
          field: field,
          value: range as string[],
          ...(groupName !== undefined && { groupName: groupName }),
          ...(groupIndex !== undefined && { groupIndex: groupIndex }),
        }),
      );
  }, [range]);

  // and reset when format is changed
  useEffect(() => {
    if (format !== fieldFormat) {
      setRange(["", ""]);
      setFormat(fieldFormat);
    }
  }, [fieldFormat]);

  return (
    <Stack direction="row" alignItems="start">
      <DateTypeWrapper
        field={field}
        groupName={groupName}
        groupIndex={groupIndex}
      />

      <RangeFieldWrapper
        field={field}
        range={range}
        index={0}
        setRange={setStart}
        maxDate={range[1] || undefined}
        groupName={groupName}
        groupIndex={groupIndex}
      />

      <RangeFieldWrapper
        field={field}
        range={range}
        index={1}
        setRange={setEnd}
        minDate={range[0] || undefined}
        groupName={groupName}
        groupIndex={groupIndex}
      />
    </Stack>
  );
};

const RangeFieldWrapper = ({
  field,
  range,
  setRange,
  index,
  minDate,
  maxDate,
  groupName,
  groupIndex,
}: {
  field: DateRangeFieldType;
  range: (string | null)[];
  setRange: (v: string) => void;
  index: number;
  minDate?: string;
  maxDate?: string;
  groupName?: string;
  groupIndex?: number;
}) => {
  const { t, i18n } = useTranslation("metadata");
  const [error, setError] = useState<
    DateValidationError | TimeValidationError | null
  >(null);
  const formDisabled = useAppSelector(getFormDisabled);
  // Need to set this separately, as the field has a global status for the entire range,
  // but also needs a split status for user interaction, per start/end of range
  const status =
    (
      ((!field.required && !range[0]) ||
        (field.optionalEndDate && index === 1 && !range[1])) &&
      !error
    ) ?
      "warning"
    : (
      (field.required && !range[0]) ||
      (!field.optionalEndDate && !range[1]) ||
      error
    ) ?
      "error"
    : "success";

  const errorMessage = useMemo(() => {
    switch (error) {
      case "maxDate":
      case "maxTime": {
        return t("dateMaxRange");
      }
      case "minDate":
      case "minTime": {
        return t("dateMinRange");
      }
      case "invalidDate": {
        return t("dateInvalid");
      }
      default: {
        return "";
      }
    }
  }, [error]);

  const fieldValue = useAppSelector(getField(field.name, groupName, groupIndex));
  const fieldFormat = fieldValue?.format || field.format;

  return (
    <MUIDateTimeField
      fullWidth
      format={fieldFormat}
      helperText={status === "error" && fieldValue?.touched && t("incorrect")}
      label={t("dateRange", {
        label: lookupLanguageString(field.label, i18n.language),
        startEnd: t(index === 0 ? "dateStart" : "dateEnd"),
      })}
      required={
        (field.required && index === 0) ||
        (!field.optionalEndDate && index === 1)
      }
      value={(range[index] && moment(range[index], fieldFormat)) || null}
      disabled={field.disabled || formDisabled}
      minDateTime={
        minDate ? moment(minDate, fieldFormat)
        : field.minDate ?
          moment(field.minDate, fieldFormat)
        : moment().subtract(273790, "year")
      }
      maxDateTime={
        maxDate ? moment(maxDate, fieldFormat)
        : field.maxDate ?
          moment(field.maxDate, fieldFormat)
        : moment().add(100, "year")
      }
      onChange={(value: Moment | null) => {
        const formattedValue =
          value && value.isValid() ? value.format(fieldFormat) : "";
        setRange(formattedValue);
      }}
      onError={(newError) => {
        setError(newError);
      }}
      sx={{
        mr: index === 0 ? 1 : 0,
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
          error: (status === "error" && fieldValue?.touched) || error ? true : false,
          helperText: errorMessage,
        },
      }}
    />
  );
};

const DateTypeWrapper = ({
  field,
  groupName,
  groupIndex,
}: {
  field: DateFieldType | DateRangeFieldType;
  groupName?: string;
  groupIndex?: number;
}) => {
  const formDisabled = useAppSelector(getFormDisabled);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("metadata");
  const fieldValue = useAppSelector(getField(field.name, groupName, groupIndex));

  return field.formatOptions ?
      <FormControl sx={{ minWidth: 110, mr: 1, }}>
        <InputLabel>{t("selectDateType")}</InputLabel>
        <Select
          label={t("selectDateType")}
          onChange={(e) => {
            // set the type of date
            dispatch(
              setDateTypeField({
                field: field,
                value: e.target.value as DateTimeFormat,
                ...(groupName !== undefined && { groupName: groupName }),
                ...(groupIndex !== undefined && { groupIndex: groupIndex }),
              }),
            );
          }}
          value={fieldValue?.format || field.format}
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
    : null;
};
