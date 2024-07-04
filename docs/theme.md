# Theme wrapper package

Wraps your apps custom theme with the extra options needed by DANS components:

The DANS framework uses the [MUI library](https://mui.com/material-ui/getting-started/) and its [theming customisation](https://mui.com/material-ui/customization/theming/). The theme config passed as props must be a valid MUI theme.

```tsx
import { ThemeWrapper } from "@dans-framework/theme";

<ThemeWrapper theme={theme} siteTitle="Site name">
  {/* rest of your app */}
</ThemeWrapper>;
```

Passing along a siteTitle prop ensures appropriate setting of the HTML document title.

Custom theme config used in the DANS framework, which can be overwritten:

- palette:
  - neutral
  - footerTop
  - footerBottom
