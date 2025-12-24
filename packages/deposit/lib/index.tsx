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

// export all api and slices
export { default as metadataReducer, initForm } from "../src/features/metadata/metadataSlice";
export { default as filesReducer, addFiles } from "../src/features/files/filesSlice";
export { default as submitReducer } from "../src/features/submit/submitSlice";
export { default as depositReducer, type DepositState } from "../src/deposit/depositSlice";
export { orcidApi } from "../src/features/metadata/api/orcid";
export { rorApi, useFetchRorByNameQuery } from "../src/features/metadata/api/ror";
export { geonamesApi } from "../src/features/metadata/api/geonames";
export { sheetsApi } from "../src/features/metadata/api/sheets";
export { datastationsApi, useFetchDatastationsTermQuery } from "../src/features/metadata/api/datastations";
export { languagesApi } from "../src/features/metadata/api/languages";
export { submitApi } from "../src/features/submit/submitApi";
export { dansFormatsApi } from "../src/features/files/api/dansFormats";
export { dansUtilityApi } from "../src/features/files/api/dansUtility";
export { licenceApi } from "../src/features/metadata/api/licences";
export { sshLicenceApi } from "../src/features/metadata/api/sshLicences";
export { maptilerApi } from "../src/features/metadata/api/maptiler";
export { rdaApi } from "../src/features/metadata/api/rdaApi";
export { wmsApi } from "../src/features/metadata/api/wms";
export { biodiversityApi } from "../src/features/metadata/api/biodiversity";
export { wikidataApi } from "../src/features/metadata/api/wikidata";
export { unsdgApi } from "../src/features/metadata/api/unsdg";