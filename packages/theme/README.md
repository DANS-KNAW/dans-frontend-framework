# DANS theme wrapper
Wraps your apps custom theme with the extra options needed by DANS components: 

The DANS framework uses the [MUI library](https://mui.com/material-ui/getting-started/) and its [theming customisation](https://mui.com/material-ui/customization/theming/). The theme config passed as props must be a valid MUI theme.

    import { ThemeWrapper } from '@dans-framework/theme'

    <ThemeWrapper theme={theme}>
      // rest of your app
    </ThemeWrapper>

Custom config used in the DANS framework:
- palette: neutral, footerTop, footerBottom