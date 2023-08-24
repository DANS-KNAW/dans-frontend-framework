import { Provider as ReduxProvider } from 'react-redux';
import { store } from './app/store';
import DepositPage from './pages/Deposit';
import i18n from './languages/i18n';
import { I18nextProvider } from 'react-i18next';

const Deposit = (props) =>
  <ReduxProvider store={store}>
    <I18nextProvider i18n={i18n}>
      <DepositPage {...props} />
    </I18nextProvider>
  </ReduxProvider>

export default Deposit;

// also expose the language function
export { default as i18n } from './languages/i18n';