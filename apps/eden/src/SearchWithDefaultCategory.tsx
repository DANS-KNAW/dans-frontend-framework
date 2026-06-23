import { useLayoutEffect, useState } from "react";
import { ElasticWrapper } from "@dans-framework/elastic";
import { useStoreHooks } from "@dans-framework/shared-store";
import { esConfig } from "./config/elasticConfig";


const DEFAULT_CATEGORY_FILTER = {
  field: "_category.keyword",
  values: ["repository"],
  type: "all",
};

export default function SearchWithDefaultCategory({
  resultRoute,
}: {
  resultRoute?: string;
}) {
  const { useAppDispatch } = useStoreHooks();
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const hasUrlState =
      new URLSearchParams(window.location.search).toString().length > 0;
    if (!hasUrlState) {
      dispatch({
        type: "search/setSearchFilters",
        payload: [DEFAULT_CATEGORY_FILTER],
      });
    }
    setReady(true);
  }, [dispatch]);

  if (!ready) return null;
  return <ElasticWrapper config={esConfig} resultRoute={resultRoute} />;
}
