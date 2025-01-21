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
import { AddDeleteControls } from "../MetadataButtons";
import { setField, setDateTypeField, setFieldValid, getFieldValue } from "../metadataSlice";
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
  sectionIndex,
  groupedFieldId,
  currentField = 0,
  totalFields = 1,
}: DateFieldProps) => {
  const { t, i18n } = useTranslation("metadata");
  const [error, setError] = useState<
    DateValidationError | TimeValidationError | null
  >(null);
  const formDisabled = useAppSelector(getFormDisabled);
  const status = getFieldStatus(field);
  const dispatch = useAppDispatch();
  const fieldValue = useAppSelector(getFieldValue(field.name));

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

  return (
    <Stack direction="row" alignItems="start">
      <DateTypeWrapper
        field={field}
        sectionIndex={sectionIndex}
        currentField={currentField}
      />

      <MUIDateTimeField
        fullWidth
        format={field.format}
        helperText={status === "error" && field.touched && t("incorrect")}
        label={lookupLanguageString(field.label, i18n.language)}
        required={field.required}
        value={(fieldValue && moment(fieldValue, field.format)) || null}
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
              name: field.name,
              value: dateValue,
            }),
          );
        }}
        onError={(newError) =>
          setError(newError as DateValidationError | TimeValidationError)
        }
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
        inputProps={{ "data-testid": `${field.name}-${field.id}` }}
        slotProps={{
          textField: {
            error:
              (status === "error" && field.touched) || error ? true : false,
            helperText: errorMessage,
          },
        }}
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

// Date range field, allows user to select start and end date
// Always checks if end date is later than start date
// End date can be optional

export const DateRangeField = ({
  field,
  sectionIndex,
  groupedFieldId,
  currentField = 0,
  totalFields = 1,
}: DateRangeFieldProps) => {
  const [range, setRange] = useState<(string | null)[]>(
    field.value || [null, null],
  );
  const [format, setFormat] = useState<string>(field.format);
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
          sectionIndex: sectionIndex,
          id: field.id,
          value: range as string[],
        }),
      );
  }, [range]);

  // and reset when format is changed
  useEffect(() => {
    if (format !== field.format) {
      setRange(["", ""]);
      setFormat(field.format);
    }
  }, [field.format]);

  return (
    <Stack direction="row" alignItems="start">
      <DateTypeWrapper
        field={field}
        sectionIndex={sectionIndex}
        currentField={currentField}
      />

      <RangeFieldWrapper
        field={field}
        groupedFieldId={groupedFieldId}
        currentField={currentField}
        range={range}
        index={0}
        setRange={setStart}
        maxDate={range[1] || undefined}
        sectionIndex={sectionIndex}
      />

      <RangeFieldWrapper
        field={field}
        groupedFieldId={groupedFieldId}
        currentField={currentField}
        range={range}
        index={1}
        setRange={setEnd}
        minDate={range[0] || undefined}
        sectionIndex={sectionIndex}
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

const RangeFieldWrapper = ({
  field,
  range,
  setRange,
  index,
  sectionIndex,
  groupedFieldId,
  currentField,
  minDate,
  maxDate,
}: {
  field: DateRangeFieldType;
  range: (string | null)[];
  setRange: (v: string) => void;
  index: number;
  sectionIndex: number;
  groupedFieldId?: string;
  currentField?: number;
  minDate?: string;
  maxDate?: string;
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

  // Set global field valid status based on user interaction, valid if warning/success
  useEffect(() => {
    setFieldValid({
      sectionIndex: sectionIndex,
      id: field.id,
      value: status !== "error",
    });
  }, [status]);

  return (
    <MUIDateTimeField
      fullWidth
      format={field.format}
      helperText={status === "error" && field.touched && t("incorrect")}
      label={t("dateRange", {
        label: lookupLanguageString(field.label, i18n.language),
        startEnd: t(index === 0 ? "dateStart" : "dateEnd"),
      })}
      required={
        (field.required && index === 0) ||
        (!field.optionalEndDate && index === 1)
      }
      value={(range[index] && moment(range[index], field.format)) || null}
      disabled={field.disabled || formDisabled}
      minDateTime={
        minDate ? moment(minDate, field.format)
        : field.minDate ?
          moment(field.minDate, field.format)
        : moment().subtract(273790, "year")
      }
      maxDateTime={
        maxDate ? moment(maxDate, field.format)
        : field.maxDate ?
          moment(field.maxDate, field.format)
        : moment().add(100, "year")
      }
      onChange={(value: Moment | null) => {
        const formattedValue =
          value && value.isValid() ? value.format(field.format) : "";
        setRange(formattedValue);
      }}
      onError={(newError) => {
        setError(newError);
      }}
      sx={{
        mt: groupedFieldId && currentField !== 0 ? 1 : 0,
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
          error: (status === "error" && field.touched) || error ? true : false,
          helperText: errorMessage,
        },
      }}
    />
  );
};

const DateTypeWrapper = ({
  field,
  sectionIndex,
  currentField,
}: {
  field: DateFieldType | DateRangeFieldType;
  sectionIndex: number;
  currentField: number;
}) => {
  const formDisabled = useAppSelector(getFormDisabled);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("metadata");

  return field.formatOptions ?
      <FormControl sx={{ minWidth: 110, mr: 1, mt: currentField > 0 ? 1 : 0 }}>
        <InputLabel>{t("selectDateType")}</InputLabel>
        <Select
          label={t("selectDateType")}
          onChange={(e) => {
            // set the type of date
            dispatch(
              setDateTypeField({
                sectionIndex: sectionIndex,
                id: field.id,
                value: e.target.value as DateTimeFormat,
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
    : null;
};
