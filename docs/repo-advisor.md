# Repository Advisor

Interface that guides the user to the repository that best fits their data for making a deposit. When a repository is selected, the user is either redirected to an external location, or the appropriate deposit config is internally loaded into the Deposit package of the app.

The service relies on the repository advisor service of the [ACP](https://github.com/Dans-labs/automated-curation-platform), the location of which must be provided in your application's .env file as `VITE_ADVISOR_URL = 'https://location...'`. 

```tsx
import { RepoAdvisor, RepoBar, NoRepoSelected } from "@dans-framework/repo-advisor";
import { Deposit, type FormConfig } from "@dans-framework/deposit";
import { useState } from "react";

const App = () => {
  const [repoConfig, setRepoConfig] = useState<FormConfig>(); // used for storing currently selected repository, for internal repositories
  const configIsSet = repoConfig?.hasOwnProperty("form") || false;

  return (
    <>
      { /* app wrapper and other components */ }
      { 
        // this shows an information bar displaying the repository the user is currently submitting to, after a selection has been made
        configIsSet && <RepoBar repo={repoConfig?.displayName} /> 
      }
      <Routes>
        <Route
          path="/"
          element={
            <RepoAdvisor
              page={page} // page object
              setRepoConfig={setRepoConfig} // sets state when repo has been selected
              depositLocation="/deposit" // route location of deposit package
            />
          }
        />
        <Route
          path="/deposit"
          element={
            repoConfig ?
            // a repository has been selected, load the Deposit component with appropriate data
            <Deposit
              config={repoConfig}
              page={{
                name: "Deposit",
                id: "deposit",
                inMenu: true,
              }}
            /> :
            {/* When no repository is selected, prompt the user to use the repository advisor tool. Needs the location of the advisor tool. */}
            <NoRepoSelected advisorLocation="/" /> 
          }
        />
      </Routes>
      { /* end app wrapper */ }
    </>
  )
}
```
For page objects, see the [@dans-framework/pages](pages.md) package.