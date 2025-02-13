import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
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
  InitialFormType,
} from "../../types/Metadata";
import {
  getValid,
  evaluateSection,
  isEmpty,
} from "./metadataHelpers";

// load the imported form and close all accordion panels by default
const initialState: InitialStateType = {
  form: [],
  sections: {},
  fields: {},
};

export const metadataSlice = createSlice({
  name: "metadata",
  initialState,
  reducers: {
    initForm: (
      state,
      action: PayloadAction<InitialFormType | InitialSectionType[]>,
    ) => {
      state.form = action.payload;
      // helper to initialize field objects
      const fieldFormatter = (field) => ({
        value: field.value || undefined,
        valid: field.value ? getValid(field.value, field) : undefined,
        touched: false,
        required: field.required,
        private: field.private,
        type: field.type,
        ...(field.noIndicator && { noIndicator: true }),
        ...(field.validation && { validation: field.validation }),
      });

      // Temporary fields object to ensure correct section evaluation
      let newFields = {};

      // Populate fields object
      state.form.forEach((section) => {
        section.fields.forEach((field) => {
          if (field.type === 'group') {
            newFields[field.name] = {
              value: [
                field.fields.reduce((acc, f) => {
                  acc[f.name] = fieldFormatter(f);
                  return acc;
                }, {}),
              ],
            };
          } else if (field.repeatable) {
            newFields[field.name] = {
              value: [fieldFormatter(field)],
            };
          } else {
            newFields[field.name] = fieldFormatter(field);
          }
        });
      });

      // Assign newFields to state.fields after processing
      state.fields = newFields;

      state.sections = action.payload.reduce((acc, section) => {
        acc[section.id] = {
          fields: section.fields.map(field => field.name),
          status: evaluateSection({fields: section.fields.map(field => field.name)}, newFields),
        };
        return acc;
      }, {});

    },
    // keep track of form state
    setField: (state, action: PayloadAction<SetFieldValuePayload>) => {
      const { field, fieldIndex, value, groupName, groupIndex } = action.payload;
      // Helper function to generate a valid field object
      const getValidField = (value) => ({
        value,
        touched: true,
        valid: getValid(value, field),
      });

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
        toToggle.forEach((toggleField) => {
          if (groupName !== undefined && groupIndex !== undefined) {
            const item = state.fields[groupName].value[groupIndex];
            item[toggleField][toggleType] = toggleType === "private" ? isEmpty(value) : !isEmpty(value);
          } else {
            state.fields[toggleField][toggleType] = toggleType === "private" ? isEmpty(value) : !isEmpty(value);
          }
        });
      }

      // Now set section status
      // Todo: need to call this on field adding/deleting as well
      // need to fix this to work with groups and repeatable fields properly!!
      for (const sectionName in state.sections) {
        const section = state.sections[sectionName];
        // Check if the field is part of the section
        if (section.fields.indexOf(field.name) !== -1 || section.fields.indexOf(groupName) !== -1) {
          section.status = evaluateSection(section, state.fields);
          break;
        }
      }
      //       const status = getFieldStatus(field, fieldToCheck);
      //       // Priority order: 'error' > 'warning' > 'success' > 'neutral'
      //       if (status === "error") return "error";
      //       if (status === "warning" && overallStatus !== "error") return "warning";
      //       if (status === "success" && overallStatus === "neutral") return "success";
      //       return overallStatus; // Default to the current overallStatus
      //     }, "neutral");
      //     state.sections[sectionName].status = sectionStatus;
      //   }
      // }
    },
    addField: (state, action: PayloadAction<AddDeleteFieldPayload>) => {
      const { field, groupName, groupIndex } = action.payload;
    
      // Ensure there's always a valid `value` array to work with
      const existingField = state.fields[field.name] || { value: [{}] };
    
      // for adding a whole group of fields
      if (field.type === 'group') {
        const newGroup = {}; // Add an empty group object
        state.fields[field.name] = {
          ...existingField,
          value: [...existingField.value, newGroup], // Append the new object immutably
        };
      } else {
        // Handle non-group repeatable fields
        const newItem = { value: "", valid: false, touched: false };
        // Adding a field inside a grouped field
        if (groupName !== undefined && groupIndex !== undefined) {
          state.fields[groupName].value[groupIndex][field.name] = {
            ...state.fields[groupName].value[groupIndex][field.name],
            value: [...state.fields[groupName].value[groupIndex][field.name].value, newItem], // Append the new item immutably
          };
        }
        else {
          state.fields[field.name] = {
            ...existingField,
            value: [...existingField.value, newItem], // Append the new item immutably
          };
        }
      }
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
    },
    setMultiApiField: (state, action: PayloadAction<SetFieldMultiApiPayload>) => {
      // Sets the multiApiValue (selectable api by user) of a field
      const { field, value, groupName, groupIndex } = action.payload;
      state.fields[field.name] = {
        ...state.fields[field.name], 
        multiApiValue: value,
        value: undefined,
      };
    },
    setDateTypeField: (state, action: PayloadAction<SetFieldFormatPayload>) => {
      // Sets the format of a date field
      const { field, value, groupName, groupIndex } = action.payload;
      if (groupName !== undefined && groupIndex !== undefined) {
        const group = (state.fields[groupName] ??= { value: [] });
        const item = (group.value[groupIndex] ??= {});
        (item[field.name] ??= {}).format = value;
      } else {
        (state.fields[field.name] ??= {}).format = value;
      }
    },
    resetMetadata: (state) => {
      // We only need to remove the id. Deposit.tsx will then reinit the form
      state.id = "";
    },
  },
});

export const {
  initForm,
  setField,
  setMultiApiField,
  addField,
  deleteField,
  resetMetadata,
  setDateTypeField,
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

export default metadataSlice.reducer;