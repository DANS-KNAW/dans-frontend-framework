import { I18nextProvider } from "react-i18next";
import i18nProvider from "./languages/i18n";
import FileMapper from "./features/FileMapper";

export const MapWrapper = () => 
  <I18nextProvider 
    i18n={i18nProvider}
  >
    <FileMapper />
  </I18nextProvider>

export default MapWrapper;