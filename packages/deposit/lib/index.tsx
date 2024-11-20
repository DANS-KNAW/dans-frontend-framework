export { default as Deposit } from "../src";
export { default as i18n } from "../src/languages/i18n";
export type { FormConfig, InitialSectionType } from "../src/types/Metadata";
export type {
  AutocompleteAPIFieldData,
  OptionsType,
} from "../src/types/MetadataFields";
export type { AutocompleteAPIFieldProps } from "../src/types/MetadataProps";
export type { QueryReturnType } from "../src/types/Api";
export type { FileLocation } from "../src/types/Files";

// export some api's for other redux stores
export {
  datastationsApi,
  useFetchDatastationsTermQuery,
} from "../src/features/metadata/api/datastations";
export {
  rorApi,
  useFetchRorByNameQuery,
} from "../src/features/metadata/api/ror";

// same for slices
export { addFiles } from "../src/features/files/filesSlice";
export { initForm } from "../src/features/metadata/metadataSlice";

// expose the store
export { store as depositStore } from "../src/redux/store";
