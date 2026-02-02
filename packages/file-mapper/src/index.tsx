// import { type Dispatch, type SetStateAction  } from "react";
import FileMapper from "./features/FileMapper";
import type { Page } from "@dans-framework/pages";
import type { FormConfig } from "@dans-framework/deposit";

export const MapWrapper = ({
  config,
  /*setMappedForm,*/ page,
  depositPageSlug,
}: {
  config: FormConfig;
  // setMappedForm?: Dispatch<SetStateAction<FormConfig | undefined>>;
  page: Page;
  depositPageSlug?: string;
}) => (
  <FileMapper
    config={config}
    /*setMappedForm={setMappedForm}*/ page={page}
    depositPageSlug={depositPageSlug}
  />
);

export default MapWrapper;
