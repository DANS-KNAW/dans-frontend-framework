import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import type {
  SetFieldValuePayload,
  SetFieldMultiApiPayload,
  SetFieldFormatPayload,
  AddDeleteFieldPayload,
} from "../../types/MetadataPayloads";
import type {
  InitialStateType,
  InitialSectionType,
  MetadataStructure,
  DynamicSections,
} from "../../types/Metadata";
import type { BaseField, Field } from "../../types/MetadataFields";
import {
  getValid,
  evaluateSection,
  isEmpty,
} from "./metadataHelpers";
import { v4 as uuidv4 } from "uuid";

// load the imported form and close all accordion panels by default
const initialState: InitialStateType = {
  id: '',
  touched: false,
  form: [],
  sections: {},
  fields: {},
};

// helper to initialize field objects
const fieldFormatter = (field: BaseField | Field, reset?: boolean) => ({
  value: reset || !field.value ? undefined : field.value,
  valid: reset || !field.value ? undefined : getValid(field.value, field),
  touched: false,
  // extra check here, due to toggleable required state: if noIndicator is set, required should be false on a fresh field
  required: field.noIndicator ? false : field.required,
  private: field.private,
  type: field.type,
  ...(field.noIndicator && { noIndicator: true }),
  ...(field.validation && { validation: field.validation }),
});

// helper to duplicate a field object and clear its value 
const resetObject = (obj: MetadataStructure) => {
  let newObj: { [key: string]: any } = {};
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value.value)) {
      // this is a repeatable field inside a group
      newObj[key] = { value: [fieldFormatter(value.value[0], true)] };
    } else {
      // this is a single field inside a group
      newObj[key] = fieldFormatter(value as BaseField, true);
    }
  }
  return newObj;
};

// helper to update section status
const updateSection = (sections: DynamicSections, fields: MetadataStructure, field: Field, groupName?: string) => {
  for (const sectionName in sections) {
    const section = sections[sectionName];
    // Check if the field is part of the section
    if (section.fields.indexOf(field.name) !== -1 || (groupName && section.fields.indexOf(groupName) !== -1)) {
      section.status = evaluateSection(section, fields);
      break;
    }
  }
};

export const metadataSlice = createSlice({
  name: "metadata",
  initialState,
  reducers: {
    initForm: (
      state,
      action: PayloadAction<InitialSectionType[]>,
    ) => {
      state.id = uuidv4();
      state.form = action.payload;
      state.touched = false;

      // Temporary fields object to ensure correct section evaluation
      let newFields: MetadataStructure = {};

      // Populate fields object
      action.payload.forEach((section) => {
        section.fields.forEach((field) => {
          if (field.type === 'group') {
            newFields[field.name] = {
              value: [
                field.fields.reduce((acc, f) => {
                  (acc as Record<string, any>)[(f as Field).name] = (f as Field).repeatable ? { value: [fieldFormatter(f as Field)] } : fieldFormatter(f as Field);
                  return acc;
                }, {}),
              ],
            };
          } else if (field.repeatable) {
            newFields[field.name] = {
              value: [fieldFormatter(field as Field)] as any,
            };
          } else {
            newFields[field.name] = fieldFormatter(field as Field);
          }
        });
      });

      // Assign newFields to state.fields after processing
      state.fields = newFields;

      state.sections = action.payload.reduce<DynamicSections>((acc, section) => {
        acc[section.id] = {
          fields: section.fields.map(field => field.name),
          status: evaluateSection({fields: section.fields.map(field => field.name), status: undefined}, newFields),
        };
        return acc;
      }, {});

    },
    // keep track of form state
    setField: (state, action: PayloadAction<SetFieldValuePayload>) => {
      const { field, fieldIndex, value, groupName, groupIndex } = action.payload;
      // Helper function to generate a valid field object
      const getValidField = (value: any) => ({
        value,
        touched: true,
        valid: getValid(value, field),
      });

      metadataSlice.caseReducers.setTouched(state, { payload: true, type: '' } );

      if (groupName !== undefined && groupIndex !== undefined) {
        // Accessing the group from state
        let group = state.fields[groupName].value;

        // Checking if the field is repeatable inside the group
        if (field.repeatable) {
          // Ensure the field inside the group exists and is repeatable
          let repeatableValues = group[groupIndex][field.name]?.value;
          if (fieldIndex !== undefined) {
            // Update the specific index if fieldIndex is provided
            repeatableValues[fieldIndex] = {
              ...repeatableValues[fieldIndex],
              ...getValidField(value),
            };
          }
          // Update the group with the modified repeatable values
          group[groupIndex] = {
            ...group[groupIndex],
            [field.name]: { value: repeatableValues },
          };
        } else {
          // Handle non-repeatable field inside the group
          group[groupIndex] = {
            ...group[groupIndex],
            [field.name]: {
              ...group[groupIndex][field.name],
              ...getValidField(value),
            }
          };
        }
        // Update the state for the group field
        state.fields[groupName] = {
          ...state.fields[groupName],
          value: group,
        };
      } else {
        // Handle fields outside of a group (single fields)
        if (field.repeatable) {
          // Handle repeatable fields outside of groups
          let repeatableValues = state.fields[field.name].value;
          if (fieldIndex !== undefined) {
            // Update existing repeatable field
            repeatableValues[fieldIndex] = {
              ...repeatableValues[fieldIndex],
              ...getValidField(value),
            }
          }
          // Update the state for the single field
          state.fields[field.name] = {
            ...state.fields[field.name],
            value: repeatableValues,
          };
        } else {
          // Handle non-repeatable field outside of groups
          state.fields[field.name] = {
            ...state.fields[field.name],
            ...getValidField(value),
          };
        }
      }

      // Toggle other fields required/private state based on the value of this field
      if (field.togglePrivate || field.toggleRequired) {
        const toggleType = field.togglePrivate ? "private" : "required";
        const toToggle = field.togglePrivate || field.toggleRequired;
        toToggle?.forEach((toggleField) => {
          if (groupName !== undefined && groupIndex !== undefined) {
            const item = state.fields[groupName].value[groupIndex];
            item[toggleField][toggleType] = toggleType === "private" ? isEmpty(value) : !isEmpty(value);
          } else {
            (state.fields[toggleField] as BaseField & { [key: string]: any })[toggleType] = toggleType === "private" ? isEmpty(value) : !isEmpty(value);
          }
        });
      }

      // Now set section status
      updateSection(state.sections, state.fields, field, groupName);
    },
    addField: (state, action: PayloadAction<AddDeleteFieldPayload>) => {
      const { field, groupName, groupIndex } = action.payload;
    
      // Get field that needs to be duplicated
      const existingField = state.fields[field.name];
    
      // for adding a whole group of fields
      if (field.type === 'group') {
        console.log(existingField)
        state.fields[field.name] = {
          ...existingField,
          value: [...existingField.value, resetObject(existingField.value[0])], // Append the new object immutably
        };
      } else {
        // Adding a field inside a grouped field
        if (groupName !== undefined && groupIndex !== undefined) {
          state.fields[groupName].value[groupIndex][field.name] = {
            ...state.fields[groupName].value[groupIndex][field.name],
            value: [...state.fields[groupName].value[groupIndex][field.name].value, fieldFormatter(state.fields[groupName].value[groupIndex][field.name].value[0], true)], 
          };
        }
        // Adding a single field
        else {
          state.fields[field.name] = {
            ...existingField,
            value: [...existingField.value, fieldFormatter(existingField.value[0], true)],
          };
        }
      }

      // update section status
      updateSection(state.sections, state.fields, field, groupName);
    },
    deleteField: (state, action: PayloadAction<AddDeleteFieldPayload>) => {
      const { field, fieldIndex, groupName, groupIndex } = action.payload;
      // Fields inside a grouped field
      if (groupName !== undefined && groupIndex !== undefined) {
        const group = state.fields[groupName]?.value || [];
        group[groupIndex][field.name].value.splice(fieldIndex, 1);
        state.fields[groupName].value[groupIndex] = group[groupIndex];
      }
      // For single fields and whole groups
      else {
        const repeatableValues = state.fields[field.name]?.value || [];
        repeatableValues.splice(fieldIndex, 1);
      }
      // update section status
      updateSection(state.sections, state.fields, field, groupName);
    },
    setMultiApiField: (state, action: PayloadAction<SetFieldMultiApiPayload>) => {
      // Sets the multiApiValue (selectable api by user) of a field
      const { field, value, groupName, groupIndex } = action.payload;
      if (groupName !== undefined && groupIndex !== undefined) {
        const group = state.fields[groupName];
        const item = group.value[groupIndex];
        item[field.name].multiApiValue = value;
        item[field.name].value = undefined;
      } else {
        (state.fields[field.name] as BaseField).multiApiValue = value;
        (state.fields[field.name] as BaseField).value = undefined;
      }
    },
    setDateTypeField: (state, action: PayloadAction<SetFieldFormatPayload>) => {
      // Sets the format of a date field
      const { field, value, groupName, groupIndex } = action.payload;
      if (groupName !== undefined && groupIndex !== undefined) {
        const group = state.fields[groupName];
        const item = group.value[groupIndex];
        item[field.name].format = value;
      } else {
        (state.fields[field.name] as BaseField).format = value;
      }
    },
    setTouched: (state, action: PayloadAction<boolean>) => {
      state.touched = action.payload
    },
  },
});

export const {
  initForm,
  setField,
  setMultiApiField,
  addField,
  deleteField,
  setDateTypeField,
  setTouched,
} = metadataSlice.actions;

// Select values from state
export const getSessionId = (state: RootState) => state.metadata.id;
export const getForm = (state: RootState) => state.metadata.form;
export const getMetadataStatus = (state: RootState) => {
  const overallStatus = Object.values(state.metadata.sections).some(s => s.status === "error") 
    ? "error" 
    : Object.values(state.metadata.sections).some(s => s.status === "warning") 
      ? "warning" 
      : "success";
  return overallStatus;
};
export const getFieldValues = (state: RootState) => state.metadata.fields;
export const getField = (name: string, groupName?: string, groupIndex?: number) => (state: RootState) => {
  if (groupName !== undefined && groupIndex !== undefined) {
    return state.metadata.fields[groupName]?.value[groupIndex][name];
  }
  return state.metadata.fields[name];
}
export const getSections = (state: RootState) => state.metadata.sections;
export const getTouchedStatus = (state: RootState) => state.metadata.touched;

export const getAll = (state: RootState) => state.metadata;

export default metadataSlice.reducer;