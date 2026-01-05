import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
import { SearchProvider } from "@elastic/react-search-ui";
import ElasticSearch from "./ElasticSearch";

const connector = new ElasticsearchAPIConnector({
  host: import.meta.env.VITE_ELASTICSEARCH_API_ENDPOINT,
  index: import.meta.env.VITE_ELASTICSEARCH_INDEX,
});

export default function ElasticWrapper({
  config,
  sortOptions,
} : {
  config: any;
  sortOptions?: any[];
}) {
  return (
    <SearchProvider config={{ ...config, apiConnector: connector }}>
      <ElasticSearch sortOptions={sortOptions} />
    </SearchProvider>
  )
}