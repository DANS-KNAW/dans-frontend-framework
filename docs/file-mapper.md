# File mapper

The file mapper was developed for the [Digital Twins project](https://digitaltwins.dansdemo.nl/) and provides functionality for mapping tabular input to specific properties of the Darwin Core standard. 

It provides the user with an interface that takes a CSV or Excel file as input. The tool then takes the input file's column headers, and asks the user to map these to values present in Darwin Core. When done, the file gets added to the Deposit package interface, and the mapping attached as property in the file's metadata object.

Limitations: input data currently limited to 10 columns at most.

```tsx
import { FileMapper } from "@dans-framework/file-mapper";

<FileMapper
  config={form} // this is a formconfig object
  page={page} // this is a page object
  depositPageSlug="/deposit" // points to the route of the deposit page
/>
```

See [@dans-framework/deposit](deposit.md) and [@dans-framework/pages](pages.md) for the corresponding objects.