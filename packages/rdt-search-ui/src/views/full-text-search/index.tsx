import { useContext, useState, useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
import { AutoSuggest } from "./auto-suggest";
import { InputWrapper } from "./input";
import { SearchPropsContext } from "../../context/props";
import {
  SearchStateContext,
  SearchStateDispatchContext,
} from "../../context/state";

export * from "./input";

export function FullTextSearch() {
  const { autoSuggest } = useContext(SearchPropsContext);
  const state = useContext(SearchStateContext);
  const dispatch = useContext(SearchStateDispatchContext);
  const [loader, showLoader] = useState(false);
  const [suggestActive, setSuggestActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const setQuery = debounce((value: string) => {
    dispatch({ type: "SET_QUERY", value });
    showLoader(false);
  }, 1000);
  const handleInputChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setSuggestActive(autoSuggest != null); // Set suggestActive state only to true if props.autoSuggest exists
      setInputValue(ev.target.value);
      setQuery(ev.target.value);
      showLoader(true);
    },
    [],
  );

  useEffect(() => {
    if (state.query !== inputValue) setInputValue(state.query);
  }, [state.query]);

  return (
    <>
      <InputWrapper
        handleInputChange={handleInputChange}
        inputValue={inputValue}
        setSuggestActive={setSuggestActive}
        loader={loader}
      />
      {suggestActive && (
        <AutoSuggest
          autoSuggest={autoSuggest}
          onClick={(query) => {
            setInputValue(query);
            setQuery(query);
          }}
          value={inputValue}
        />
      )}
    </>
  );
}
