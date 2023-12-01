import { Provider as ReduxProvider } from "react-redux";
import { store } from "./redux/store";
import Deposit from "./deposit/Deposit";
import i18n from "./languages/i18n";
import { I18nextProvider } from "react-i18next";
import type { FormConfig } from "./types/Metadata";
import type { Page } from "@dans-framework/pages";

const DepositWrapper = ({ ...props }: { config: FormConfig; page: Page }) => (
  <ReduxProvider store={store}>
    <I18nextProvider i18n={i18n}>
      <Deposit {...props} />
    </I18nextProvider>
  </ReduxProvider>
);

export default DepositWrapper;
