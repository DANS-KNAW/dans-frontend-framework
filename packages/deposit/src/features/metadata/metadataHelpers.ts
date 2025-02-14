import type {
  SectionStatus,
  MetadataStructure,
  DynamicSection,
  DynamicSections,
} from "../../types/Metadata";
import type {
  ValidationType,
  BaseField,
  Field,
} from "../../types/MetadataFields";
import moment from "moment";

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
export const getFieldStatus = (field: BaseField): SectionStatus => {
  const fieldEmpty =
    !field?.value ||
    (typeof field.value === "string" && !field.value.trim()) ||
    (Array.isArray(field.value) && field.value.length === 0) ||
    (field.type === "daterange" &&
      Array.isArray(field.value) &&
      field.value.every((v) => v === null || v === "")) ||
    (field.type === "drawmap" &&
      Array.isArray(field.value) &&
      field.value.some((v) => v.geonames === null || v.geonames === undefined));

  if (field?.noIndicator && !field?.required && fieldEmpty) {
    return "neutral";
  } else if (
    (!field?.required && fieldEmpty) ||
    // daterange should also give a warning state if end date is optional and not filled in
    (field.type === "daterange" &&
      field?.optionalEndDate &&
      Array.isArray(field.value) &&
      !field.value[1] &&
      field.valid)
  ) {
    return "warning";
  } else if (
    (field?.required && fieldEmpty) ||
    (!fieldEmpty && field.validation && !field.valid) ||
    (field.type === "daterange" && !fieldEmpty && !field.valid)
  ) {
    return "error";
  } else {
    return "success";
  }
};

// Get the status (color of indicator) for a specific section, based on an array of section statusses
export const getSectionStatus = (sections: DynamicSections): SectionStatus => {
  const priority = ["neutral", "success", "warning", "error"];

  return Object.values(sections)
    .map((section) => section.status)
    .reduce((highest, current) =>
      priority.indexOf(current as string) > priority.indexOf(highest as string) ? current : highest
    , "neutral");
};

// Check if a field conforms to validation type specified
export const getValid = (value: any, field: BaseField | Field): boolean => {
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
export function evaluateSection(section: DynamicSection, fieldValues: MetadataStructure): SectionStatus {
  const statusses = section.fields.flatMap((field: string) => {
    const fieldValue = fieldValues[field];
    if (fieldValue) {
      if (fieldValue.hasOwnProperty("valid")) {
        // Single field
        return getFieldStatus(fieldValue as BaseField);
      } else if (fieldValue.hasOwnProperty("value")) {
        // Grouped field: Flatten nested statuses
        return fieldValue.value.flatMap((groupField: any) => {
          // repeatable field
          if (groupField.hasOwnProperty("valid")) {
            return getFieldStatus(groupField);
          }
          // repeatable field inside group
          else if (Array.isArray(groupField)) {
            return groupField.map(field => getFieldStatus(field));
          }
          // group field
          return Object.keys(groupField).map(key => getFieldStatus(groupField[key]))
        });
      }
    }
    return []; // Default return for missing field
  }).flat(); // Ensures everything is a single array of statuses
  // Check for "error" first, then "warning", otherwise return "success"
  if (statusses.includes("error")) return "error";
  if (statusses.includes("warning")) return "warning";
  return "success";
}