import { I18nextProvider } from "react-i18next";
import i18nProvider from "./languages/i18n";
import RepoAdvisor from "./features/RepoAdvisor";
import { Provider as ReduxProvider } from "react-redux";
import { store } from './redux/store';

export const AdvisorWrapper = ({setRepoConfig}: { setRepoConfig: (form: any) => void }) => 
  <ReduxProvider store={store}>
    <I18nextProvider i18n={i18nProvider}>
      <RepoAdvisor setRepoConfig={setRepoConfig} />
    </I18nextProvider>
  </ReduxProvider>

export default AdvisorWrapper;