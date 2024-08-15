import { I18nextProvider } from "react-i18next";
import i18nProvider from "./languages/i18n";
import FileMapper from "./features/FileMapper";
import { Provider as ReduxProvider } from "react-redux";
import { store } from './redux/store';
import { type Page } from "@dans-framework/pages";

export const MapWrapper = ({setMappedForm, page}: {
  setMappedForm: (form: any) => void;
  page: Page;
}) => 
  <ReduxProvider store={store}>
    <I18nextProvider i18n={i18nProvider}>
      <FileMapper setMappedForm={setMappedForm} page={page} />
    </I18nextProvider>
  </ReduxProvider>

export default MapWrapper;