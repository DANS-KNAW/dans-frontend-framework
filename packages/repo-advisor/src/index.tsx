import type { Dispatch, SetStateAction } from "react";
import RepoAdvisor from "./features/RepoAdvisor";
import type { Page } from "@dans-framework/pages";
import type { FormConfig } from "@dans-framework/deposit";

const AdvisorWrapper = ({
  setRepoConfig,
  page,
  depositLocation,
}: {
  setRepoConfig: Dispatch<SetStateAction<FormConfig | undefined>>;
  page: Page;
  depositLocation: string;
}) => (
  <RepoAdvisor
    setRepoConfig={setRepoConfig}
    page={page}
    depositLocation={depositLocation}
  />
);

export default AdvisorWrapper;
