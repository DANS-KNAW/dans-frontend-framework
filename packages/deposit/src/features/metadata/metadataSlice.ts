import { createSlice, PayloadAction /*current*/ } from "@reduxjs/toolkit";
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
    // initForm: (
    //   state,
    //   action: PayloadAction<InitialFormType | InitialSectionType[]>,
    // ) => {
    //   if (!Array.isArray(action.payload) && action.payload.id) {
    //     // form is loaded from existing data
    //     state.id = action.payload.id;
    //     state.form = action.payload.metadata;
    //     state.panel = action.payload.metadata[0].id;
    //   } else {
    //     // otherwise initialize a brand new form
    //     state.id = uuidv4();
    //     state.form = formatInitialState(action.payload as InitialSectionType[]);
    //     state.touched = false;
    //     // open up the first panel by default
    //     state.panel = (action.payload as InitialSectionType[])[0].id;
    //     // and set initial validation status
    //     metadataSlice.caseReducers.setSectionStatus(state, {
    //       payload: null,
    //       type: "",
    //     });
    //   }
    // },
    // keep track of form state
    setField: (state, action: PayloadAction<SetFieldValuePayload>) => {
      console.log(action.payload);
      state.fields[action.payload.name] = action.payload.value;
      // const section = state.form[action.payload.sectionIndex];
      // const field = findByIdOrName(action.payload.id, section.fields);

      // if (!state.touched && field && !field.autofill) {
      //   state.touched = true;
      // }

      // // field is found, lets set it
      // if (field) {
      //   field.value = action.payload.value;
      //   field.touched = true;

      //   // For setting required state of 'conditional' fields,
      //   // we need to find the parent array and change the fields inside
      //   if (field.toggleRequired) {
      //     changeConditionalState(
      //       action.payload.id,
      //       section.fields,
      //       action.payload.value,
      //       field,
      //       "toggleRequired",
      //       "toggleRequiredIds",
      //       "required",
      //     );
      //   }

      //   // Same for private state of 'conditional' fields
      //   if (field.togglePrivate) {
      //     changeConditionalState(
      //       action.payload.id,
      //       section.fields,
      //       action.payload.value,
      //       field,
      //       "togglePrivate",
      //       "togglePrivateIds",
      //       "private",
      //     );
      //   }

      //   // After every input, we need to update field valid status and section status as well.
      //   field.valid = getValid(action.payload.value, field);
      //   // then set the section/accordion
      //   metadataSlice.caseReducers.setSectionStatus(state, action);
      // }
    },
    setMultiApiField: (
      state,
      action: PayloadAction<SetFieldMultiApiPayload>,
    ) => {
      const section = state.form[action.payload.sectionIndex];
      const field = findByIdOrName(action.payload.id, section.fields);
      if (field) {
        field.multiApiValue = action.payload.value;
      }
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
    // functionality for adding new single (repeatable) fields/field groups
    addField: (state, action: PayloadAction<AddFieldPayload>) => {
      const section = state.form[action.payload.sectionIndex];
      const field = findByIdOrName(
        action.payload.groupedFieldId,
        section.fields,
      );
      if (field) {
        const newField =
          action.payload.type === "single" ?
            // single repeatable field is just a copy with a new id, value, valid, touched state
            {
              ...(field as RepeatTextFieldType).fields[0],
              id: uuidv4(),
              value: "",
              valid: "",
              touched: false,
            }
            // grouped fields a bit more complicated, since grouped fields can also contain single repeatable fields
          : (field as RepeatGroupedFieldType).fields[0].map((f) =>
              f.type === "repeatSingleField" ?
                {
                  ...f,
                  id: uuidv4(),
                  fields: [
                    {
                      ...f.fields[0],
                      id: uuidv4(),
                      value: "",
                      valid: "",
                      touched: false,
                    },
                  ],
                }
              : {
                  // Omit the toggleRequiredIds property
                  ...(({ toggleRequiredIds, ...rest }) => rest)(f),
                  // reset what needs resetting
                  id: uuidv4(),
                  value: "",
                  valid: "",
                  touched: false,
                  required: f.noIndicator ? undefined : f.required,
                },
            );

        field.fields = [
          ...(field as RepeatGroupedFieldType | RepeatTextFieldType).fields,
          newField,
        ] as InputField[][] | TextFieldType[];
      }
    },
    deleteField: (state, action: PayloadAction<DeleteFieldPayload>) => {
      const section = state.form[action.payload.sectionIndex];
      const field = findByIdOrName(
        action.payload.groupedFieldId,
        section.fields,
      );
      if (field) {
        (field as RepeatTextFieldType | RepeatGroupedFieldType).fields.splice(
          action.payload.deleteField,
          1,
        );
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
    setSectionStatus: (
      state,
      action: PayloadAction<SectionStatusPayload | null>,
    ) => {
      if (action.payload) {
        // setting status based on user interaction
        set(action.payload.sectionIndex);
      } else {
        // initial setting of status
        Array.from(Array(state.form.length).keys()).forEach((i) => set(i));
      }

      function set(sectionIndex: number) {
        const status = getSectionStatus(
          state.form[sectionIndex].fields.flatMap((field) => {
            if (field.type !== "group" && field.fields) {
              // this is a single repeatable field
              return field.fields.flatMap((f) => getFieldStatus(f));
            }
            if (field.type === "group" && field.fields) {
              // grouped field, can have either a fields key with a single array as value, or an array of arrays
              // note the check for a single repeatable field inside a grouped or repeatable grouped field
              return field.fields.flatMap((f) =>
                Array.isArray(f) ?
                  f.flatMap((inner) =>
                    inner.fields ?
                      inner.fields.flatMap((f) => getFieldStatus(f))
                    : getFieldStatus(inner),
                  )
                : f.fields ? f.fields.flatMap((f) => getFieldStatus(f))
                : getFieldStatus(f),
              );
            } else {
              return getFieldStatus(field);
            }
          }),
        );
        state.form[sectionIndex].status = status;
      }
    },
    resetMetadata: (state) => {
      // We only need to remove the id. Deposit.tsx will then reinit the form
      state.id = "";
    },
  },
});

export const {
  // initForm,
  setField,
  setFieldValid,
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
  // const statusArray = state.metadata.form.map((section) => section.status);
  return undefined;
};
export const getFieldValue = (name: string) => (state: RootState) => state.metadata.fields[name];
export const getSection = (state: RootState) => state.metadata.sections;
export const getTouchedStatus = (state: RootState) => state.metadata.touched;

export default metadataSlice.reducer;