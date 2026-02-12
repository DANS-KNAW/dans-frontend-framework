# Support Drawer

Internal package that displays a support materials drawer. It fetches grouped documentation from an external JSON endpoint and presents it in a slide-out panel.

## SupportDrawer

Renders a fixed button in the bottom-right corner. When clicked, a drawer opens with support materials organized by category. Each material opens in a modal viewer.

```tsx
import SupportDrawer from "@dans-framework/support-drawer";

<SupportDrawer
  // URL to a JSON endpoint that returns an array of material groups
  supportMaterialEndpoint={import.meta.env.VITE_SUPPORT_DRAWER_CONFIG}
/>;
```

## Configuration Format

The endpoint must return a JSON array of material groups:

```json
[
  {
    "group": "Getting Started",
    "materials": [
      {
        "topic": "Quick Start Guide",
        "type": "PDF",
        "url": "https://example.com/guide.pdf"
      },
      {
        "topic": "FAQ",
        "type": "HTML",
        "url": "https://example.com/faq.html"
      }
    ]
  }
]
```

Each material object has three properties:

- `topic` - Display name shown in the drawer
- `type` - Either `"PDF"` or `"HTML"`
- `url` - URL to the document (loaded in an iframe when clicked)

## Environment Variable

Set the endpoint URL in your app's `.env` file:

```
VITE_SUPPORT_DRAWER_CONFIG='https://example.com/support-materials.json'
```
