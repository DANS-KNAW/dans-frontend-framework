import Deposit from "./deposit/Deposit";
import type { FormConfig } from "./types/Metadata";
import type { Page } from "@dans-framework/pages";

const DepositWrapper = ({ ...props }: { config: FormConfig; page: Page }) => (
  <Deposit {...props} />
);

export default DepositWrapper;
