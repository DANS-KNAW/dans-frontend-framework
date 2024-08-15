import type { Dispatch, SetStateAction } from "react";
import { I18nextProvider } from "react-i18next";
import i18nProvider from "./languages/i18n";
import RepoAdvisor from "./features/RepoAdvisor";
import { Provider as ReduxProvider } from "react-redux";
import { store } from './redux/store';
import { type Page } from "@dans-framework/pages";

export const AdvisorWrapper = ({setRepoConfig, page, depositLocation}: { 
  setRepoConfig: Dispatch<SetStateAction<any>>;
  page: Page;
  depositLocation: string;
}) => 
  <ReduxProvider store={store}>
    <I18nextProvider i18n={i18nProvider}>
      <RepoAdvisor setRepoConfig={setRepoConfig} page={page} depositLocation={depositLocation} />
    </I18nextProvider>
  </ReduxProvider>

export default AdvisorWrapper;