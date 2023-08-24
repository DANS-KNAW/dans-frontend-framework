import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import type { 
  SetFieldPayload, 
  AddFieldPayload,
  DeleteFieldPayload,
  SectionStatusPayload,
  InitialStateType, 
  RepeatTextFieldType,
  RepeatGroupedFieldType,
  InputField,
  TextFieldType,
  InitialSectionType,
  TypeaheadAPI,
  ValidationType,
  DateTimeFormat,
  InitialFormType,
} from '../../types/Metadata';
import { getValid, getFieldStatus, getSectionStatus, formatInitialState, findById } from './metadataHelpers';
import { v4 as uuidv4 } from 'uuid';

// load the imported form and close all accordion panels by default
const initialState: InitialStateType = {
  id: '',
  form: [],
  panel: '',
  tab: 0,
}

export const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    initForm: (state, action: PayloadAction<InitialFormType | InitialSectionType[]>) => {
      if (!Array.isArray(action.payload) && action.payload.id) {
        // form is loaded from existing data
        state.id = action.payload.id;
        state.form = action.payload.metadata;
        state.panel = action.payload.metadata[0].id;
      }
      else {
        // otherwise initialize a brand new form
        state.id = uuidv4();
        state.form = formatInitialState(action.payload as InitialSectionType[]);
        state.panel = '';
      }
      // and set initial validation status
      metadataSlice.caseReducers.setSectionStatus(state, {payload: null, type: ''});
    },
    // keep track of form state
    setField: (state, action: PayloadAction<SetFieldPayload>) => {
      const section = state.form[action.payload.sectionIndex];
      const field = findById(action.payload.id, section.fields);

      // field is found, lets set it
      if (field) {
        field.value = action.payload.value;
        field.touched = true;
        
        // After every input, we need to update field valid status and section status as well.
        // Only needed when the new status differs from the old one.
        if (getValid(action.payload.value as string, field.validation as ValidationType) !== field.valid) {
          // set the field
          field.valid = getValid(action.payload.value as string, field.validation as ValidationType);
          // then set the section/accordion
          metadataSlice.caseReducers.setSectionStatus(state, action);
        }
      }
    },
    setMultiApiField: (state, action: PayloadAction<SetFieldPayload>) => {
      const section = state.form[action.payload.sectionIndex];
      const field = findById(action.payload.id, section.fields);
      if (field) {
        field.multiApiValue = action.payload.value as TypeaheadAPI;
      }
    },
    setDateTypeField: (state, action: PayloadAction<SetFieldPayload>) => {
      const section = state.form[action.payload.sectionIndex];
      const field = findById(action.payload.id, section.fields);
      if (field) {
        field.format = action.payload.value as DateTimeFormat;
      }
    },
    // functionality for adding new single (repeatable) fields/field groups
    addField: (state, action: PayloadAction<AddFieldPayload>) => {
      const section = state.form[action.payload.sectionIndex];
      const field = findById(action.payload.groupedFieldId, section.fields);
      if (field) { 
        const newField = action.payload.type === 'single' ?
          // single repeatable field is just a copy with a new id, value, valid, touched state
          {...(field as RepeatTextFieldType).fields[0], id: uuidv4(), value: '', valid: '', touched: false} :
          // grouped fields a bit more complicated, since grouped fields can also contain single repeatable fields
          (field as RepeatGroupedFieldType).fields[0].map( f => (
            f.type === 'repeatSingleField' ?
            {...f, id: uuidv4(), fields: [{...f.fields[0], id: uuidv4(), value: '', valid: '', touched: false}]} :
            {...f, id: uuidv4(), value: '', valid: '', touched: false}
          ));

        field.fields = [
          ...(field as RepeatGroupedFieldType | RepeatTextFieldType).fields, newField
        ] as InputField[][] | TextFieldType[];
      }
    },
    deleteField: (state, action: PayloadAction<DeleteFieldPayload>) => {
      const section = state.form[action.payload.sectionIndex];
      const field = findById(action.payload.groupedFieldId, section.fields);
      if (field) { 
        (field as RepeatTextFieldType | RepeatGroupedFieldType).fields.splice(action.payload.deleteField, 1);
        // need to also update the section/accordion status
        metadataSlice.caseReducers.setSectionStatus(state, action);
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
    setSectionStatus: (state, action: PayloadAction<SectionStatusPayload | null>) => {
      if (action.payload) {
        // setting status based on user interaction
        set(action.payload.sectionIndex)
      }
      else {
        // initial setting of status
        Array.from(Array(state.form.length).keys()).forEach( i => set(i) );
      }

      function set(sectionIndex: number) {
        const status = getSectionStatus(state.form[sectionIndex].fields.flatMap(field => {
            if (field.type !== 'group' && field.fields) {
              // this is a single repeatable field
              return field.fields.flatMap( f => getFieldStatus(f));
            }
            if (field.type === 'group' && field.fields) {
              // grouped field, can have either a fields key with a single array as value, or an array of arrays
              // note the check for a single repeatable field inside a grouped or repeatable grouped field
              return field.fields.flatMap( f => 
                Array.isArray(f) ? 
                f.flatMap( inner => 
                  inner.fields ? inner.fields.flatMap( f => getFieldStatus(f) ) : getFieldStatus(inner)
                ) :
                f.fields ?
                f.fields.flatMap( f => getFieldStatus(f) ) :
                getFieldStatus(f)
              );
            }
            else {
              return getFieldStatus(field);
            }
          })
        );
        state.form[sectionIndex].status = status;
      }
    },
    resetMetadata: (state) => {
      // We only need to remove the id. Deposit.tsx will then reinit the form
      state.id = '';
    }
  }
});

export const { 
  initForm,
  setField, 
  setMultiApiField, 
  setOpenPanel, 
  setOpenTab,
  setSectionStatus, 
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
  const statusArray = state.metadata.form.map(section => section.status);
  return getSectionStatus(statusArray);
}

export default metadataSlice.reducer;
