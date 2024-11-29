// import { type Dispatch, type SetStateAction  } from "react";
import { I18nextProvider } from "react-i18next";
import i18nProvider from "./languages/i18n";
import FileMapper from "./features/FileMapper";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./redux/store";
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
  <ReduxProvider store={store}>
    <I18nextProvider i18n={i18nProvider}>
      <FileMapper
        config={config}
        /*setMappedForm={setMappedForm}*/ page={page}
        depositPageSlug={depositPageSlug}
      />
    </I18nextProvider>
  </ReduxProvider>
);

export default MapWrapper;
