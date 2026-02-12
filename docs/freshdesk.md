# Freshdesk package

Internal package that exports a Freshworks support widget component and control hook for customer support integration.

## Freshdesk

Loads the Freshworks support widget script. Renders nothing but initializes the widget on mount.

```tsx
import { Freshdesk } from "@dans-framework/freshdesk";

<Freshdesk
  // Your Freshworks widget ID
  widgetId={00000000000}
/>;
```

## useFreshworksWidgetControl

Hook to control the Freshworks widget. Use this to open the widget from buttons or links.

```tsx
import { useFreshworksWidgetControl } from "@dans-framework/freshdesk";

const { openWidget, closeWidget, hideWidget, showWidget } =
  useFreshworksWidgetControl();

// Example: open widget on button click
<button onClick={() => openWidget()}>Contact support</button>;
```

The hook returns four functions:

- `openWidget` - Opens the support widget
- `closeWidget` - Closes the widget
- `hideWidget` - Hides the widget from view
- `showWidget` - Shows a hidden widget
