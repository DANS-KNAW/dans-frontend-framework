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
// Some specific checking for dateranges needed
export const getFieldStatus = (field: InputField): SectionStatus => {
  const fieldEmpty =
    !field.value ||
    (typeof field.value === "string" && !field.value.trim()) ||
    (Array.isArray(field.value) && field.value.length === 0) ||
    (field.type === "daterange" &&
      Array.isArray(field.value) &&
      field.value.every((v) => v === null || v === "")) ||
    (field.type === "drawmap" &&
      Array.isArray(field.value) &&
      field.value.some((v) => v.geonames === null || v.geonames === undefined));

  if (field.noIndicator && !field.required && fieldEmpty) {
    return "neutral";
  } else if (
    (!field.required && fieldEmpty) ||
    // daterange should also give a warning state if end date is optional and not filled in
    (field.type === "daterange" &&
      field.optionalEndDate &&
      Array.isArray(field.value) &&
      !field.value[1] &&
      field.valid)
  ) {
    return "warning";
  } else if (
    (field.required && fieldEmpty) ||
    (!fieldEmpty && field.validation && !field.valid) ||
    (field.type === "daterange" && !fieldEmpty && !field.valid)
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

/*
Format the initial state loaded from the ./config files
We separate this state into different objects that can change independently:
sections, values, validity, touched, required, private status
{
  config: [ the original form config ],
  sections: {
    section_name: {
      field: ['field1', 'field2'],
      valid: false,
    },
    ...etc
  },
  values: {
    field1: '',
    field2: '',
    ...etc
  },
  valid: {
    field1: false,
    field2: false,
    ...etc
  },
  touched: {
    field1: false,
    field2: false,
    ...etc
  },
  required, private, ...
}
*/
export const formatInitialState = (form: InitialSectionType[]) => {
  const initialState = form.reduce((state, section) => {
    // Add the section to the `sections` state immutably
    const sectionState = {
      ...state.sections,
      [section.id]: {
        fields: section.fields.map((field) => field.name),
        valid: false,  // Section validity starts as false
      },
    };
  
    // Create a new values, valid, and touched state based on the fields
    const valuesState = section.fields.reduce((values, field) => {
      return {
        ...values,
        [field.name]: field.value || null,  // Default value can be set here (null, "" etc.)
      };
    }, state.values);
  
    const validState = section.fields.reduce((valid, field) => {
      return {
        ...valid,
        [field.name]: field.hasOwnProperty('value') || false,  // Initial validity as false if not specified yet in config (then we assume valid)
      };
    }, state.valid);
  
    const touchedState = section.fields.reduce((touched, field) => {
      return {
        ...touched,
        [field.name]: false,  // Touched status as false
      };
    }, state.touched);
  
    const requiredState = section.fields.reduce((required, field) => {
      return {
        ...required,
        [field.name]: field.required || false,  // Default to field's 'required' property
      };
    }, state.required);

    const privateState = section.fields.reduce((privateFields, field) => {
      return {
        ...privateFields,
        [field.name]: field.private || false,  // Default to 'private' if available
      };
    }, state.private);

    return {
      config: form,
      sections: sectionState,
      values: valuesState,
      valid: validState,
      touched: touchedState,
      required: requiredState,
      private: privateState,
    };
  }, {
    config: [],
    sections: {},
    values: {},
    valid: {},
    touched: {},
    required: {},
    private: {},
  });

  console.log(initialState)
  return initialState;
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
