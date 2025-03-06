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
  ExternalMetadata,
  FieldMapStructure,
} from "../../types/Metadata";
import type { BaseField, Field } from "../../types/MetadataFields";
import {
  evaluateSection,
  isEmpty,
  fieldFormatter,
  updateSection,
  resetObject,
  getValidField,
} from "./metadataHelpers";
import { v4 as uuidv4 } from "uuid";

const initialState: InitialStateType = {
  id: '',
  touched: false,
  form: [],
  sections: {},
  fields: {},
  fieldMap: {},
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

      // Also create a map of all the original fields, so we can easily lookup fixed values like field type, validation type, etc.
      let fieldMap: FieldMapStructure = {};
      
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
            (field.fields as Field[]).forEach(f => {
              fieldMap[f.name] = f;
            });
          } else if (field.repeatable) {
            newFields[field.name] = {
              value: [fieldFormatter(field as Field)] as any,
            };
            fieldMap[field.name] = field;
          } else {
            newFields[field.name] = fieldFormatter(field as Field);
            fieldMap[field.name] = field;
          }
        });
      });

      // Assign fields after processing
      state.fields = newFields;
      state.fieldMap = fieldMap;

      state.sections = action.payload.reduce<DynamicSections>((acc, section) => {
        acc[section.id] = {
          fields: section.fields.map(field => field.name),
          status: evaluateSection({fields: section.fields.map(field => field.name), status: undefined}, newFields, fieldMap),
        };
        return acc;
      }, {});
    },
    setExternalFormData: (state, action: PayloadAction<ExternalMetadata>) => {
      // Set external form data (e.g. from API) to the state
      state.fields = {
        ...state.fields,
        ...action.payload.metadata,
      };
      state.id = action.payload.action === 'view' ? action.payload.id : uuidv4();
    },
    // keep track of form state
    setField: (state, action: PayloadAction<SetFieldValuePayload>) => {
      const { field, fieldIndex, value, groupName, groupIndex } = action.payload;
      // set field touched state to true
      metadataSlice.caseReducers.setTouched(state, { payload: true, type: '' } );

      // helper function to update field value
      const updateField = (target: any, key: string, newValue: any) => {
        target[key] = { ...target[key], ...getValidField(newValue, field) };
      };
    
      if (groupName !== undefined && groupIndex !== undefined) {
        let group = state.fields[groupName].value;
        let groupItem = group[groupIndex];
    
        if (field.repeatable && fieldIndex !== undefined) {
          groupItem[field.name].value[fieldIndex] = {
            ...groupItem[field.name].value[fieldIndex],
            ...getValidField(value, field),
          };
        } else {
          updateField(groupItem, field.name, value);
        }
    
        state.fields[groupName] = { ...state.fields[groupName], value: group };
      } else {
        if (field.repeatable && fieldIndex !== undefined) {
          state.fields[field.name].value[fieldIndex] = {
            ...state.fields[field.name].value[fieldIndex],
            ...getValidField(value, field),
          };
        } else {
          updateField(state.fields, field.name, value);
        }
      }
    
      // Handle toggling required/private state
      if (field.togglePrivate || field.toggleRequired) {
        const toggleType = field.togglePrivate ? "private" : "required";
        (field.togglePrivate || field.toggleRequired)?.forEach((toggleField) => {
          const target = groupName !== undefined && groupIndex !== undefined
            ? state.fields[groupName].value[groupIndex]
            : state.fields;
          target[toggleField][toggleType] = toggleType === "private" ? isEmpty(value) : !isEmpty(value);
        });
      }

      // This logic will populate fields that have the `deriveFrom` property set.
      // Currently it just sets the value of the field to the value of the field it derives from.
      // @TODO: Currently it doesn't check if the field can support the value of the field it derives from.
      Object.entries(state.fieldMap).forEach(([fieldName, fieldDef]) => {
        if (fieldDef.deriveFrom === field.name) {
          const isTouched = "touched" in state.fields[fieldName] ? state.fields[fieldName].touched : false;

          // Only update if the field hasn't been touched by the user.
          if (state.fields[fieldName] && !isTouched) {
            state.fields[fieldName] = {
                ...state.fields[fieldName],
                value,
                valid: true,
                touched: false
              };
            
            // Update section status for the derived field
            updateSection(state.sections, state.fields, fieldDef, state.fieldMap);
          }
        }
      });

      // Now set section status to reflect all field changes
      updateSection(state.sections, state.fields, field, state.fieldMap, groupName);
    },
    addField: (state, action: PayloadAction<AddDeleteFieldPayload>) => {
      // add a repeatable single field or a whole group
      const { field, groupName, groupIndex } = action.payload;
      const appendField = (target: any, key: string, formatter: (val: any) => any) => {
        target[key] = { ...target[key], value: [...target[key].value, formatter(target[key].value[0])] };
      };
      if (field.type === "group") {
        appendField(state.fields, field.name, (val) => resetObject(val, state.fieldMap));
      } else if (groupName !== undefined && groupIndex !== undefined) {
        appendField(state.fields[groupName].value[groupIndex], field.name, (val) => fieldFormatter(val, true));
      } else {
        appendField(state.fields, field.name, (val) => fieldFormatter(val, true));
      }
      updateSection(state.sections, state.fields, field, state.fieldMap, groupName);
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
      updateSection(state.sections, state.fields, field, state.fieldMap, groupName);
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
  setExternalFormData,
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
