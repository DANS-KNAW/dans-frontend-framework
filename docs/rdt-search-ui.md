# Elastic Search Dashboard and search UI

Package that exports an interface to be used with an Elastic Search endpoint. Has a search, dashboard and detailed results view.

## Setup and config
```tsx
import { FacetedWrapper, FacetedSearchProvider } from "@dans-framework/rdt-search-ui";
```
Wrap your application in a `<FacetedSearchProvider />` component, and use `<FacetedWrapper />` inside it to display a search and dashboard page.

### FacetedSearchProvider config
```tsx
const elasticConfig = {
  name: "Name of your Elastic interface",
  url: `${import.meta.env.VITE_ELASTICSEARCH_API_ENDPOINT}/endpoint`, // endpoint URL
  user: import.meta.env.VITE_ELASTICSEARCH_API_USER, // optional if endpoint is protected with BasicAuth
  pass: import.meta.env.VITE_ELASTICSEARCH_API_PASS, // optional if endpoint is protected with BasicAuth
  fullTextFields: ["field1"], // an array of Elastic fields that are full text fields and can be searched using free text search 
  fullTextHighlight: {
    fields: {
      field1: { number_of_fragments: 0 }, // 0 = return full field with highlights, >0 = return N snippets around matches
    },
  },
  resultBodyComponent: <ReactComponent/>, // custom component to display search detail page
  onClickResultPath: "record", // search detail page location
  dashboardSearchIconToggle: false, // 
  customColumns: 12, // optionally set a custom amount of columns for the dashboard in desktop view (default is 8). Columns in mobile view will always be full or half width.
  /*
  * Developed specifically for the Super Catalog project
  * Define a config for 'fixed' facets, that can be changed by the user
  * but do not show up in the 'active' filters
  * For type 'url' we search in the attributes.url value of our ES instance,
  * for 'keyword', we search in attributes.subject.subject value,
  * for 'client', the relationships.client.data.id value.
  */
  fixedFacets: [
    {
      name: "Name of fixed facet",
      type: "client",
      location: "relationships.client.data.id.keyword",  // field where this value exists in the Elastic database
      value: "dans.dataversenl", // value to look for in the Elastic database
      altValue: "dataverse.nl", // value to look for in the Elastic database for type url, needed for url matching
      group: "DANS", // group with other fixed facets
      defaultEnabled: true, // if disabled, results will initially be excluded
    },
  ],
  dashboard: [ 
    {/* list of facets, see below */}
  ],
};

<FacetedSearchProvider config={elasticConfig}>
  {/* use FacetedWrapper inside your RouterProvider as a Route element */}
  <Routes>
    <Route 
      path="/" 
      element={
        <FacetedWrapper 
          dashboard // if provided, this will be the dashboard view component
          dashRoute="/" // set route for dashboard interface, often the root route
          resultRoute="/search" // set route for search interface
        />
      } 
    />
  </Routes>
</FacetedSearchProvider>
```
For a basic page generating function, if used with the [@dans-framework/pages](pages.md) package, you could use this example:
```tsx
import { FacetedWrapper } from "@dans-framework/rdt-search-ui";
import { SingleRecord } from "./YourSingleRecordComp";
import { Generic, type Page } from "@dans-framework/pages"

const createElementByTemplate = (page: Page) => {
  switch (page.template) {
    case "dashboard":
      return <FacetedWrapper dashboard dashRoute="/" resultRoute="/search" />;
    case "search":
      return <FacetedWrapper dashRoute="/" resultRoute="/search" />;
    case "record":
      return (
        <FacetedWrapper dashRoute="/" resultRoute="/search">
          <SingleRecord />
        </FacetedWrapper>
      );
    default:
      return <Generic {...page} />;
  }
};
```  
### Facets
The interface is made up out of one or more facets, like text lists or pie charts. Each facet takes a specific config object.
#### List facet
Displays a list of text items a user can filter on.
```tsx
import { ListFacet } from "@dans-framework/rdt-search-ui";

<ListFacet
  config={{
    id: "pw", // unique identifier for facet
    field: "identifier.normalized", // points to a field in the Elastic Search database
    fieldLabel: "identifier", // can be provided if label for the facets differs from the business logic used by the facet, also points to a field in the Elastic Search database
    title: {
      en: "Pathways",
      nl: "Paden",
    }, // can be a string or language object
    sort: {
      by: SortBy.Key,	
      direction: SortDirection.Asc,
    }, // optionally set initial sort order
    cutoff: 10, // amount of 
    cols: 2, // amount of columns this facet type takes up
    rows: 1, // amount of rows
    tooltip: "Some tooltip content string" // displays an optional tooltip alongside the title
  }}
/>
```
#### Map facet
Displays an interactive map for facets with geo data.
```tsx
import { MapFacet } from "@dans-framework/rdt-search-ui";

<MapFacet
  config={{
    id: "countriesMap", // unique identifier for facet
    field: "countries.location", // points to a geo location field in the Elastic database
    title:  "Countries title", // can be a string or language object
    cols: 6, // amount of columns this facet type takes up
    rows: 1, // amount of rows
    tooltip: "Some tooltip content string" // displays an optional tooltip alongside the title
    disableSort: true, // 
  }}
/>
```
#### Chart facets
Displays a pie chart, a bar chart, or a date range chart
```tsx
import { DateChartFacet, PieChartFacet } from "@dans-framework/rdt-search-ui";

<DateChartFacet
  config={{
    id: "unique",
    field: "start_date", // needs to be formatted as date in the Elastic database
    title:  "Year...",
    interval: "year", // set interval for the bars and the interactive range slider
    cols: 9,
    rows: 1,
    tooltip: "Some tips",
  }}
/>

<PieChartFacet
  config={{
    id: "unique",
    field: "elasticfield",
    title: "Title",
    groupBy: [{
      name: "label", 
      location: "attributes.url",
      value: "string",
    }], // To be used in combination with fixed facets
    groupByLabel: "elasticfield", // set this if you want to group by label, instead of doing aggregation grouping. Disables user interactions with chart.
    cols: 4,
    rows: 1,
    tooltip: "Some tips",
    legend: false, // if set to true, this will display a legend below the chart
    chartType: "bar", // if set to "bar", this will display a bar chart instead of a pie chart
    chartOptions: {
      xAxis: {
        type: "log",
      },
    }, // chartOptions can be any valid Apache Echarts option config, see e.g. [https://echarts.apache.org/handbook/en/concepts/axis]
  }}
/>
```
