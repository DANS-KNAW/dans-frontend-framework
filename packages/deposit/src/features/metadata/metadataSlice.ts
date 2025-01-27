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
        };
        return acc;
      }, {});
    },
    // keep track of form state
    // TODO: maybe combine some reducers?
    setField: (state, action: PayloadAction<SetFieldValuePayload>) => {
      console.log(action.payload);

      const { field, fieldIndex, value, groupName, groupIndex } = action.payload;
      console.log(field)

      if (groupName !== undefined && groupIndex !== undefined) {
        const group = state.fields[groupName]?.value || [];
        if (fieldIndex !== undefined) {
          group[groupIndex] = {
            ...group[groupIndex],
            [field.name]: {
              ...group[groupIndex][field.name],
              value,
              touched: true,
              valid: getValid(value, field),
            },
          };
        } else {
          group[groupIndex] = {
            ...group[groupIndex],
            [field.name]: {
              ...group[groupIndex]?.[field.name],
              value,
              touched: true,
              valid: getValid(value, field),
            },
          };
        }
        state.fields[groupName] = {
          ...state.fields[groupName],
          value: group,
        };
      }

      if (field.repeatable) {
        const repeatableValues = state.fields[field.name]?.value || [];
        if (fieldIndex !== undefined) {
          repeatableValues[fieldIndex] = {
            ...repeatableValues[fieldIndex],
            value,
            touched: true,
            valid: getValid(value, field),
          };
        }
        state.fields[field.name] = {
          ...state.fields[field.name], 
          value: repeatableValues,
        };
      } else {
        state.fields[field.name] = {
          ...state.fields[field.name], 
          value,
          touched: true,
          valid: getValid(value, field),
        };
      }

      // now set section status
      // Determine which section(s) this field belongs to
      for (const sectionName in state.sections) {
        const section = state.sections[sectionName];
        
        // Determine the section status
        const sectionStatus = section.fields.reduce((overallStatus, fieldName) => {
          const fieldData = state.fields[fieldName];
          const status = getFieldStatus(field, fieldData?.value);
          console.log(status);
      
          // Priority order: 'error' > 'warning' > 'success' > 'neutral'
          if (status === "error") return "error";
          if (status === "warning" && overallStatus !== "error") return "warning";
          if (status === "success" && overallStatus === "neutral") return "success";
          return overallStatus; // Default to the current overallStatus
        }, "neutral");
      
        // Update the section's status and validity in the state
        state.sections[sectionName].status = sectionStatus;
      }
    },
    addField: (state, action: PayloadAction<AddFieldPayload>) => {
      const { field } = action.payload;
    
      // Ensure there's always a valid `value` array to work with
      const existingField = state.fields[field.name] || { value: [{}] };
    
      if (field.type === 'group') {
        const newGroup = {}; // Add an empty group object
        state.fields[field.name] = {
          ...existingField,
          value: [...existingField.value, newGroup], // Append the new object immutably
        };
      } else {
        // Handle non-group repeatable fields
        const newItem = { value: "", valid: false, touched: false };
        state.fields[field.name] = {
          ...existingField,
          value: [...existingField.value, newItem], // Append the new item immutably
        };
      }
    },
    deleteField: (state, action: PayloadAction<AddFieldPayload>) => {
      const { field, fieldIndex } = action.payload;
      const repeatableValues = state.fields[field.name]?.value || [];
      repeatableValues.splice(fieldIndex, 1);
    },
    setMultiApiField: (
      state,
      action: PayloadAction<SetFieldMultiApiPayload>,
    ) => {
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
export const getField = (name: string, groupName?: string, groupIndex?: number) => (state: RootState) => {
  if (groupName !== undefined && groupIndex !== undefined) {
    return state.metadata.fields[groupName]?.value[groupIndex][name];
  }
  return state.metadata.fields[name];
}
export const getSections = (state: RootState) => state.metadata.sections;
export const getTouchedStatus = (state: RootState) => state.metadata.touched;

export default metadataSlice.reducer;