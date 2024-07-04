# DANS front-end framework

The DANS front-end framework lets you build apps that help a user submit metadata to archiving services in a standardised way. It presents the user with a highly usable interface that guides them through the steps needed to submit their data in the most complete way as possible.

## Documentation

Read the [documentation](https://dans-knaw.github.io/dans-frontend-framework/) on how to get started.

## Features

- Components split up into individually importable packages
- CMS like framework with configurable pages via JSON
- Fully configurable metadata form
  - Conditionally controlled fields: private/public data, required/recommended/not-required fields
  - Title generation
  - Repeatable fields and repeatable group fields
  - Many typeahead API endpoints
  - etc
- Drag and drop file uploads with configurable file roles and visibility
- User authentication using OIDC provided by a Keycloak instance
  - Metadata submission status overview
  - Save metadata as drafts
- Elastic Search dashboards
- Multi-language
- Multiple submission endpoints (via a packaging service)
- Look and feel based on Material Design, completely themeable
- Automated ticketing to Freshdesk
