import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { RootState } from "../../redux/store";
import type {
  SetFieldValuePayload,
  SetFieldMultiApiPayload,
  SetFieldFormatPayload,
  SetFieldValidPayload,
  AddFieldPayload,
  DeleteFieldPayload,
  SectionStatusPayload,
} from "../../types/MetadataPayloads";
import type {
  RepeatTextFieldType,
  RepeatGroupedFieldType,
  TextFieldType,
  InputField,
} from "../../types/MetadataFields";
import type {
  InitialStateType,
  InitialSectionType,
  InitialFormType,
} from "../../types/Metadata";
import {
  getValid,
  getFieldStatus,
  getSectionStatus,
  formatInitialState,
  findByIdOrName,
  changeConditionalState,
  // findFieldInGroup,
  evaluateSection,
} from "./metadataHelpers";
import { v4 as uuidv4 } from "uuid";
import { FileDownload } from "@mui/icons-material";

// load the imported form and close all accordion panels by default
const initialState: InitialStateType = {
  panel: "",
  tab: 0,
  touched: false, 
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
      state.sections = action.payload.reduce((acc, section) => {
        acc[section.id] = {
          fields: section.fields.map(field => field.name),
          status: evaluateSection(section),
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
        const group = state.fields[groupName]?.value || [];

        // Checking if the field is repeatable inside the group
        if (field.repeatable) {
          // Ensure the field inside the group exists and is repeatable
          const repeatableValues = group[groupIndex]?.[field.name]?.value || [];
          if (fieldIndex !== undefined) {
            // Update the specific index if fieldIndex is provided
            repeatableValues[fieldIndex] = getValidField(value);
          } else {
            // Push new item if no fieldIndex is provided
            repeatableValues.push(getValidField(value));
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
            [field.name]: getValidField(value),
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
          const repeatableValues = state.fields[field.name]?.value || [];
          if (fieldIndex !== undefined) {
            // Update existing repeatable field
            repeatableValues[fieldIndex] = getValidField(value);
          } else {
            // Push new value to repeatable field
            repeatableValues.push(getValidField(value));
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

      // Now set section status
      // Todo: need to call this on field adding/deleting as well
      // need to fix this to work with groups and repeatable fields properly!!
      for (const sectionName in state.sections) {
        const section = state.sections[sectionName];
        // Check if the field is part of the section
        if (section.fields.indexOf(field.name) !== -1 || section.fields.indexOf(groupName) !== -1) {
          const sectionStatus = section.fields.reduce((overallStatus, fieldName) => {
            const fieldToCheck = groupName !== undefined && groupIndex !== undefined 
              ? state.fields[groupName].value[groupIndex][fieldName] 
              : state.fields[fieldName];
            const status = getFieldStatus(field, fieldToCheck);
            // Priority order: 'error' > 'warning' > 'success' > 'neutral'
            if (status === "error") return "error";
            if (status === "warning" && overallStatus !== "error") return "warning";
            if (status === "success" && overallStatus === "neutral") return "success";
            return overallStatus; // Default to the current overallStatus
          }, "neutral");
          state.sections[sectionName].status = sectionStatus;
        }
      }
    },
    addField: (state, action: PayloadAction<AddFieldPayload>) => {
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
    deleteField: (state, action: PayloadAction<AddFieldPayload>) => {
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
    setMultiApiField: (
      state,
      action: PayloadAction<SetFieldMultiApiPayload>,
    ) => {
      // Sets the multiApiValue (selectable api by user) of a field
      const { field, value, groupName, groupIndex } = action.payload;
      state.fields[field.name] = {
        ...state.fields[field.name], 
        multiApiValue: value,
        value: undefined,
      };
    },
    setDateTypeField: (state, action: PayloadAction<SetFieldFormatPayload>) => {
      const section = state.form[action.payload.sectionIndex];
      const field = findByIdOrName(action.payload.id, section.fields);
      if (field) {
        field.format = action.payload.value;
      }
    },
    setFieldValid: (state, action: PayloadAction<SetFieldValidPayload>) => {
      const section = state.form[action.payload.sectionIndex];
      const field = findByIdOrName(action.payload.id, section.fields);
      if (field) {
        field.valid = action.payload.value as boolean;
      }
    },
    // keep track of the accordion state
    setOpenPanel: (state, action: PayloadAction<string>) => {
      state.panel = action.payload;
    },
    // keep track of open tab (metadata/files)
    setOpenTab: (state, action: PayloadAction<number>) => {
      state.tab = action.payload;
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
  setFieldValid,
  setMultiApiField,
  setOpenPanel,
  setOpenTab,
  addField,
  deleteField,
  resetMetadata,
  setDateTypeField,
} = metadataSlice.actions;

// Select values from state
export const getSessionId = (state: RootState) => state.metadata.id;
export const getMetadata = (state: RootState) => state.metadata.form;
export const getOpenPanel = (state: RootState) => state.metadata.panel;
export const getOpenTab = (state: RootState) => state.metadata.tab;
export const getMetadataStatus = (state: RootState) => {
  // const statusArray = state.metadata.form.map((section) => section.status);
  return undefined;
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

export default metadataSlice.reducer;