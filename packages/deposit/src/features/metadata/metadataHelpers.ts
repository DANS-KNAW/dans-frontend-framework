import type {
  SectionStatus,
  InitialSectionType,
} from "../../types/Metadata";
import type {
  InputField,
  Field,
  ValidationType,
} from "../../types/MetadataFields";
import moment from "moment";

// import { current } from '@reduxjs/toolkit';

// Helper functions for the Metadata form

// some simple validation, not fully implemented
export const validateData = (type: ValidationType, value: string): boolean => {
  switch (type) {
    case "email":
      return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value.toLowerCase());
    case "uri":
      return /^(https?|ftp):\/\/[^\s/$.?#]*\.[^\s]*$/.test(value.toLowerCase());
    case "github-uri":
      return /^https:\/\/github\.com\/.*$/.test(value.toLowerCase());
    default:
      return true;
  }
};

// helper function to determine if const has any value
export const isEmpty = (value: string | object | any[] | null): boolean => {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "") ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" && Object.keys(value).length === 0)
  );
};

// Get the status of a single field
// Some specific checking for dateranges needed
export const getFieldStatus = (field: InputField, fieldValue): SectionStatus => {
  const isRequired = fieldValue?.required || field?.required;
  const fieldEmpty =
    !fieldValue?.value ||
    (typeof fieldValue.value === "string" && !fieldValue.value.trim()) ||
    (Array.isArray(fieldValue.value) && fieldValue.value.length === 0) ||
    (field.type === "daterange" &&
      Array.isArray(fieldValue.value) &&
      fieldValue.value.every((v) => v === null || v === "")) ||
    (field.type === "drawmap" &&
      Array.isArray(fieldValue.value) &&
      fieldValue.value.some((v) => v.geonames === null || v.geonames === undefined));

  if (field?.noIndicator && !isRequired && fieldEmpty) {
    return "neutral";
  } else if (
    (!isRequired && fieldEmpty) ||
    // daterange should also give a warning state if end date is optional and not filled in
    (field.type === "daterange" &&
      field.optionalEndDate &&
      Array.isArray(fieldValue.value) &&
      !fieldValue.value[1] &&
      fieldValue.valid)
  ) {
    return "warning";
  } else if (
    (isRequired && fieldEmpty) ||
    (!fieldEmpty && field.validation && !fieldValue.valid) ||
    (field.type === "daterange" && !fieldEmpty && !fieldValue.valid)
  ) {
    return "error";
  } else {
    return "success";
  }
};

// Get the status (color of indicator) for a specific section, based on an array of section statusses
export const getSectionStatus = (sections: Section[]): SectionStatus => {
  const priority = ["neutral", "success", "warning", "error"];

  return Object.values(sections)
    .map((section) => section.status)
    .reduce((highest, current) =>
      priority.indexOf(current) > priority.indexOf(highest) ? current : highest
    , "neutral");
};

// Check if a field conforms to validation type specified
export const getValid = (value: any, field: Field): boolean => {
  if (field.validation) {
    return validateData(field.validation, value);
  } else if (
    (value &&
      value.length !== 0 &&
      field.type !== "daterange" &&
      field.type !== "drawmap") ||
    // special check for date range: start date must be before or equal to end date,
    // or if end date not required, end date can be empty
    (field.type === "daterange" &&
      value &&
      (moment(value[0], field.format).isSameOrBefore(
        moment(value[1], field.format),
      ) ||
        (field.optionalEndDate && value[0] && !value[1]))) ||
    (field.type === "drawmap" &&
      value.every(
        (item: any) => item.geonames !== null && item.geonames !== undefined,
      ))
  ) {
    return true;
  }
  return false;
};

// Debounce function for autosaving on form change
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  wait: number,
): ((...args: Parameters<F>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null;

  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    const context = this;

    const later = () => {
      timeoutId = null;
      func.apply(context, args);
    };

    clearTimeout(timeoutId!);
    timeoutId = setTimeout(later, wait);
  };
};

// Helper to get the initial status of every section
// Gets the section with the fields it needs to evaluate, and the values of all fields
export function evaluateSection(section: InitialSectionType, fieldValues): string {
  const statusses = section.fields.flatMap((field) => {
    const fieldValue = fieldValues[field];

    if (fieldValue) {
      if (fieldValue.hasOwnProperty("valid")) {
        // Single field
        return getFieldStatus(fieldValue, fieldValue);
      } else if (fieldValue.hasOwnProperty("value")) {
        // Grouped field: Flatten nested statuses
        return fieldValue.value.flatMap(groupField =>
          Object.keys(groupField).map(key => getFieldStatus(groupField[key], groupField[key]))
        );
      }
    }

    return []; // Default return for missing field
  }).flat(); // Ensures everything is a single array of statuses

  console.log(statusses)

  // Check for "error" first, then "warning", otherwise return "success"
  if (statusses.includes("error")) return "error";
  if (statusses.includes("warning")) return "warning";
  return "success";
}