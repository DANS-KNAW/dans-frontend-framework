import { v4 as uuidv4 } from "uuid";
import type {
  SectionStatus,
  InitialSectionType,
  SectionType,
} from "../../types/Metadata";
import type {
  InputField,
  Field,
  ValidationType,
} from "../../types/MetadataFields";

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

// Recursive function that finds and returns a single field or nothing if not found
// id: field's ID
// fields: an array of fields
export const findByIdOrName = (
  id: string,
  fields: Field[],
  type: "id" | "name" = "id",
): Field | undefined => {
  for (let item of fields) {
    if (item[type] === id) {
      return item;
    }
    if (item.fields) {
      let result = findByIdOrName(id, item.fields.flat(), type);
      if (result) {
        return result;
      }
    }
  }
  return;
};

// Find array of dependant id's based on a specific id, for conditional fields
// ugly, todo clean up
export const findConditionalChanges = (
  id: string,
  fields: Field[],
  searchKey: "toggleRequired" | "minDateField" | "togglePrivate",
): string[] | undefined => {
  for (let item of fields) {
    if (item.id === id && item[searchKey]) {
      const toFind = (
        Array.isArray(item[searchKey]) ?
          item[searchKey]
        : [item[searchKey]]) as string[];
      return toFind
        .map((name: string) => fields.map((f) => f.name === name && f.id))
        .flat()
        .filter(Boolean) as string[];
    }
    if (item.fields && item.type === "group") {
      let result = item.fields
        .map((field) => {
          if (Array.isArray(field)) {
            // for a repeatable field, this needs to be recursive
            return findConditionalChanges(id, field, searchKey);
          } else {
            // otherwise find the field ids directly
            if (field.id === id && field[searchKey]) {
              const toFind = (
                Array.isArray(field[searchKey]) ?
                  field[searchKey]
                : [field[searchKey]]) as string[];
              return toFind
                .map(
                  (name: string) =>
                    item.fields &&
                    (item.fields as Field[]).map(
                      (f) => f.name === name && f.id,
                    ),
                )
                .flat()
                .filter(Boolean) as string[];
            }
          }
          return false;
        })
        .flat()
        .filter(Boolean) as string[];
      if (result.length > 0) {
        return result;
      }
    }
  }
  return;
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

// Function to toggle conditional state of fields,
// like required or private
export const changeConditionalState = (
  fieldId: string,
  sectionFields: Field[],
  value: any,
  field: Field,
  key: "toggleRequired" | "togglePrivate",
  idKey: "toggleRequiredIds" | "togglePrivateIds",
  togglekey: "required" | "private",
) => {
  const idsToChange =
    field[idKey] || findConditionalChanges(fieldId, sectionFields, key);

  if (!field[idKey]) {
    field[idKey] = idsToChange;
  }

  // change the conditional fields required state
  idsToChange &&
    idsToChange.map((id) => {
      const changeField = findByIdOrName(id, sectionFields);
      if (changeField && togglekey === "required") {
        changeField[togglekey] = !isEmpty(value) ? true : undefined;
      }
      if (changeField && togglekey === "private") {
        changeField[togglekey] = isEmpty(value) ? true : false;
      }
    });
};

// Get the status of a single field
export const getFieldStatus = (field: InputField): SectionStatus => {
  const fieldEmpty =
    !field.value ||
    (typeof field.value === "string" && !field.value.trim()) ||
    (Array.isArray(field.value) && field.value.length === 0);
  if (field.noIndicator && !field.required && fieldEmpty) {
    return "neutral";
  } else if (!field.required && fieldEmpty) {
    return "warning";
  } else if (
    (field.required && fieldEmpty) ||
    (!fieldEmpty && field.validation && !field.valid)
  ) {
    return "error";
  } else {
    return "success";
  }
};

// Get the status (color of indicator) for a specific section, based on an array of section statusses
export const getSectionStatus = (section: SectionStatus[]): SectionStatus => {
  return (
    section.indexOf("error") !== -1 ? "error"
    : section.indexOf("warning") !== -1 ? "warning"
    : "success"
  );
};

// Check if a field conforms to validation type specified
export const getValid = (
  value: string,
  validation?: ValidationType,
): boolean => {
  if (validation) {
    return validateData(validation, value);
  } else if (value && value.length !== 0) {
    return true;
  }
  return false;
};

/*
Format the initial state loaded from the ./config files
for repeatable fields/fieldgroups functionality.
We also add a unique ID so we can keep track of everything.
Structure we want:
[
  {singlefield},
  {groupfield: fields: [
    {field}, 
    {field},
  ]},
  {repeatSingleField: fields:[
    {repeatablefield}, 
    {repeatablefield},
  ]}, 
  {repeatGroupField: fields: [
    [{field}, {field}],
    [{field}, {field}],
  ]},
]
*/
export const formatInitialState = (form: InitialSectionType[]) => {
  const newForm = form.map((section) => ({
    ...section,
    fields: section.fields.map((field) => {
      if (field.type === "group" && field.fields) {
        const newFieldGroup = field.fields.map((f) =>
          (
            !Array.isArray(f) &&
            (f.type === "text" || f.type === "number" || f.type === "date") &&
            f.repeatable
          ) ?
            {
              id: uuidv4(),
              type: "repeatSingleField",
              name: f.name,
              private: f.private,
              fields: [{ ...f, id: uuidv4(), touched: false }],
            }
          : { ...f, id: uuidv4() },
        );
        return {
          ...field,
          id: uuidv4(),
          fields: !field.repeatable ? newFieldGroup : [newFieldGroup],
        };
      }
      if (field.repeatable) {
        return {
          id: uuidv4(),
          type: "repeatSingleField",
          name: field.name,
          private: field.private,
          fields: [{ ...field, id: uuidv4(), touched: false }],
        };
      } else {
        return { ...field, id: uuidv4(), touched: false };
      }
    }),
  }));
  return newForm as SectionType[];
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
