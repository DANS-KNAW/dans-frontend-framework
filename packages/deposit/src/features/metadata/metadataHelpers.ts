import type {
  SectionStatus,
  MetadataStructure,
  DynamicSection,
  DynamicSections,
  FieldMapStructure,
} from "../../types/Metadata";
import type {
  ValidationType,
  BaseField,
  Field,
} from "../../types/MetadataFields";
import moment from "moment";

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
export const isEmpty = (value: string | object | any[] | null): boolean =>
  value === null ||
  value === undefined ||
  (typeof value === "string" && value.trim() === "") ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === "object" && Object.keys(value).length === 0);

// Get the status of a single field
// Some specific checking for dateranges needed
export const getFieldStatus = (field: BaseField, originalField: Field): SectionStatus => {
  const fieldEmpty =
    !field?.value ||
    (typeof field.value === "string" && !field.value.trim()) ||
    (Array.isArray(field.value) && field.value.length === 0) ||
    (originalField.type === "daterange" &&
      Array.isArray(field.value) &&
      field.value.every((v) => v === null || v === "")) ||
    (originalField.type === "drawmap" &&
      Array.isArray(field.value) &&
      field.value.some((v) => v.geonames === null || v.geonames === undefined));

  if (originalField?.noIndicator && !field?.required && fieldEmpty) {
    return "neutral";
  } else if (
    (!field?.required && fieldEmpty) ||
    // daterange should also give a warning state if end date is optional and not filled in
    (originalField.type === "daterange" &&
      originalField?.optionalEndDate &&
      Array.isArray(field.value) &&
      !field.value[1] &&
      field.valid)
  ) {
    return "warning";
  } else if (
    (field?.required && fieldEmpty) ||
    (!fieldEmpty && originalField.validation && !field.valid) ||
    (originalField.type === "daterange" && !fieldEmpty && !field.valid)
  ) {
    return "error";
  } else {
    return "success";
  }
};

const priority = ["neutral", "success", "warning", "error"];
// Get the status (color of indicator) for a specific section, based on an array of section statusses
export const getSectionStatus = (sections: DynamicSections): SectionStatus => 
  Object.values(sections)
    .map((section) => section.status)
    .reduce((highest, now) =>
      priority.indexOf(now as string) > priority.indexOf(highest as string) ? now : highest
    , "neutral");

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

// Helper to get the initial status of every section
// Gets the section with the fields it needs to evaluate, and the values of all fields
export function evaluateSection(section: DynamicSection, fieldValues: MetadataStructure, fieldMap: FieldMapStructure): SectionStatus {
  const statusses = section.fields.flatMap((field: string) => {
    const fieldValue = fieldValues[field];
    if (fieldValue) {
      if (fieldValue.hasOwnProperty("valid")) {
        // Single field
        return getFieldStatus(fieldValue as BaseField, fieldMap[field]);
      } else if (fieldValue.hasOwnProperty("value")) {
        // Grouped field: Flatten nested statuses
        return fieldValue.value.flatMap((groupField: any) => {
          // repeatable field
          if (groupField.hasOwnProperty("valid")) {
            return getFieldStatus(groupField, fieldMap[field]);
          }
          // group field
          return Object.keys(groupField).flatMap(key => 
            groupField[key].hasOwnProperty('valid') 
            // assume single field in group
            ? getFieldStatus(groupField[key], fieldMap[key])
            // assume repeatable field in group
            : groupField[key].value.flatMap((f: BaseField) => getFieldStatus(f, fieldMap[key]))
          )});
      }
    }
    return []; // Default return for missing field
  }).flat(); // Ensures everything is a single array of statuses
  // Check for "error" first, then "warning", otherwise return "success"
  if (statusses.includes("error")) return "error";
  if (statusses.includes("warning")) return "warning";
  return "success";
};

// helper to initialize field objects, with all keys that can be variable/dynamic
export const fieldFormatter = (field: Field | BaseField, reset?: boolean, valueField?: BaseField) => ({
  value: reset || !field.value ? undefined : field.value,
  valid: reset || !field.value ? false : getValid(valueField ? valueField.value : field.value, field as Field),
  touched: false,
  // extra check here, due to toggleable required state: if noIndicator is set, required should be false on a fresh field
  required: (field as Field).noIndicator ? false : field.required,
  ...(field.private && { private: field.private }),
  ...(field.multiApiValue && { multiApiValue: field.multiApiValue }),
  ...(field.format && { format: field.format }),
});

// helper to duplicate a field object and clear its value 
export const resetObject = (obj: MetadataStructure, fieldMap: FieldMapStructure) => {
  let newObj: { [key: string]: any } = {};
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value.value)) {
      // this is a repeatable field inside a group
      newObj[key] = { value: [fieldFormatter(fieldMap[key], true, value.value[0])] };
    } else {
      // this is a single field inside a group
      newObj[key] = fieldFormatter(fieldMap[key], true, value as BaseField);
    }
  }
  return newObj;
};

// helper to update section status
export const updateSection = (sections: DynamicSections, fields: MetadataStructure, field: Field, fieldMap: FieldMapStructure, groupName?: string) => {
  for (const sectionName in sections) {
    const section = sections[sectionName];
    // Check if the field is part of the section
    if (section.fields.indexOf(field.name) !== -1 || (groupName && section.fields.indexOf(groupName) !== -1)) {
      section.status = evaluateSection(section, fields, fieldMap);
      break;
    }
  }
};

// Helper function to generate a valid field object
export const getValidField = (value: any, field: Field) => ({
  value,
  touched: true,
  valid: getValid(value, field),
});