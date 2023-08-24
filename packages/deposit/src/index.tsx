import { Provider as ReduxProvider } from 'react-redux';
import { store } from './app/store';
import DepositPage from './pages/Deposit';

const Deposit = (props) =>
  <ReduxProvider store={store}>
    <DepositPage {...props} />
  </ReduxProvider>

export default Deposit;