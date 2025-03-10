# Deposit package

The Deposit component is the heart of the form. It consists of the metadata form and a file upload section.

## Form config

```tsx
import { Deposit } from "@dans-framework/deposit"

<Deposit config=
  {
    // An array of form sections, see below
    form: [{...}],

    // Pointer to the field in the "sections" array that contains the form title, which is used in a users submissions overview
    // Must be a unique value, so no repeatable fields
    formTitle: "field_name",

    // Target object, the destination of the submission. Config usually read from .env file,
    // because of differences in demo/staging/production environment
    target: {
      envName: import.meta.env.VITE_ENV_NAME,
      configName: import.meta.env.VITE_CONFIG_NAME,
    },

    // Credentials needed for the submissions target(s). Formatted as array, to support multiple targets.
    targetCredentials: [
      {
        // user readable name for the target repository, e.g. "Dataverse"
        name: "",

        // the destination of the submission, as configured in the submission processing server,
        // e.g. ssh.datastations.nl. Usually read from .env file.
        repo: "",

        // type of authentication that the target repository requires. Depends on config of submission
        //  processing server, usually API_KEY.
        auth: "",

        // key that the app needs to pull from the keycloak user profile
        authKey: "",

        // URL where user can get their API key for this target repo, e.g. for Dataverse
        // https://ssh.datastations.nl/dataverseuser.xhtml?selectTab=apiTokenTab.
        // Usually read from .env file.
        keyUrl: ""

        // URL that the app should check this key against, e.g. for Dataverse
        // https://ssh.datastations.nl/api/users/token. Currently implemented for Dataverse and Zenodo.
        // See function validateKeyApi in user-auth package.
        // Usually read from .env file.
        keyCheckUrl: "",

        // Help text that appears where a user enters an API key for this particular target.
        // Can be a string or language object
        helpText: "",
      }
    ],

    // Legacy/redundant with Keycloak: an optional string that gets passed along
    // in the header of the form submission: "Bearer <submitKey>". Could be used if
    // skipValidation is true.
    submitKey: "",

    // if true, a form can always be submitted, handy for testing purposes
    skipValidation: false,

    // Specify optional options for file uploads
    filesUpload: {
      // override default file roles (see packages/deposit/src/features/files/fileOptions.tsx)
      fileRoles: [
        {
          value: "audio_file",
          label: "Audio file",
        },
        // etc
      ],
      // override default processing options
      fileProcessing: [
        {
          value: "create_thumbnail",
          label: {
            en: "Create thumbnail",
            nl: "Genereer thumbnail",
          },
          for: ["video", "images"],
        },
        // etc
      ],
      // enable/disable these columns (default value specified)
      embargoDate: false,
      displayRoles: true,
      displayProcesses: true,
      // set an optional maximum file upload size in bytes
      maxSize: 10737418240, // e.g. 10 GB
    },

  }
  page={...} // A page object
/>
```

For page object, see [@dans-framework/pages](pages.md).

## Form sections and field objects

Each section is a collapsible accordion in the front-end. A section is formatted like so:

```tsx
{
  // unique identifier for this section
  id: "section_id",

  // section title, can be a string or a language object
  title: {
    en: "English title",
    nl: "Nederlandse titel"
  },

  // Array of input fields for this section
  fields: [
    {
      // Field type. Can be:
      // * autocomplete - this is a selectbox with either a pre-defined list or typeahead service coupled
      // * text - plain textbox
      // * date - date/time selector
      // * daterange - a date range selector
      // * number - numbers only
      // * group - a field group, this group contains another fields array
      // * radio - a radio button selection field (one option is always selected)
      // * check - a checkbox selection field (select zero or more options)
      // * drawmap - a map that indicating location: gives user the ability to draw shapes, change and convert coordinates to different coordinate systems, requires a Maptiler and Geonames API key in the .env file: VITE_MAPTILER_API_KEY and VITE_GEONAMES_API_KEY
      type: "text",

      // Label can be a string or preferably a language object
      label: "Some string",

      // Name for this field, gets sent to the API, needed for mapping
      name: "some_string",

      // Optionally set field to required or not. Not applicable to radio buttons or group fields.
      required: true,

      // Optionally set field to not display a "recommended you fill this in" status. Field cannot be required obviously.
      // Disabled for daterange field types.
      noIndicator: true,

      // Optional field description, can be a string or a language object. Appears in tooltip or under label in case of group field
      description: "Some description",

      // Optional pre-set value of this field. A string in case of a text field, an options object in case of an autocomplete field
      value: "Some value string",

      // Optionally set field to private - this data won"t be public
      private: true,

      // You can set the disabled flag if you don"t want the user to change this field"s value
      disabled: true,

      // Text, number, date and group fields only, make field repeatable field
      repeatable: true,

      // Text field only, enable this if you want a larger textarea
      multiline: true,

      // Sets field with to 100% instead of default 50%, recommended for daterange
      fullWidth: true,

      // Textfield only, to validate input. See ValidationType in types/Metadata.ts
      validation: "email",

      // Textfield only. Optionally provide this value if you want to fill a textfield based on user authentication object.
      // See AuthProperty in @dans-framework/user-auth/types for options.
      autofill: "name",

      // Date and daterange field only. Specify the format you want to use. See DateTimeFormat in types/Metadata.ts.
      format: "DD-MM-YYYY HH:mm",

      // Date and daterange field only. Provide an optional list of date format options the user can choose from.
      formatOptions: ["YYYY", "MM-YYYY", "DD-MM-YYYY", "DD-MM-YYYY HH:mm"],

      // Date and daterange field only. Specify an optional minimum and/or maximum input date, in the format you've provided.
      minDate: "01-01-2020 12:00",
      maxDate: "01-01-2024 12:00",

      // Daterange only, set end date as optional
      // By default, an end date is required for a date range, when a starting date has been filled in
      optionalEndDate: true,

      // Number field only, specify min and/or max number
      minValue: "10",
      maxValue: "20",

      // Autocomplete, radio and check fields only. Selectable options, can be:
      // * an array of option objects like below
      // * an API service: "orcid", "ror", "narcis", etc (autocomplete only). See TypeaheadAPI in types/Metadata.ts.
      // * an array of API services ["orcid", "ror"] (autocomplete only)
      options: [
        // This is an options object
        {
          // Can be a string or language object
          label: "Some label",
          // Value is a string, gets sent to server
          value: "some_string",
          // Optionally set this to true, to always have this value selected. Autocomplete only.
          mandatory: true,
        }
      ],

      // In case Google Sheets is selected as API, you must provide a sheetOptions object
      sheetOptions: {
        // ID of the Google sheet, a long string
        sheetId: "IDXXX",
        // Name of the page/spread inside the Google sheet you wish to retrieve
        page: "Page 1",
        // Start displaying data from this row onwards, counting starts at 0
        startAtRow: 1,
        // The column number that contains the display label, starting at 0
        labelCol: 0,
        // The column that contains the value, starting at 0
        valueCol: 1,
        // Optionally, in case you have a list that contain values that need to be grouped with a header in the dropdown,
        // the column that contains the header name
        headerCol: 2,
      },

      // Autocompletefield only. In case an array of typeahead services is provided, pick the default service (required)
      multiApiValue: "orcid",

      // Autocompletefield only. Make multiple selections possible.
      multiselect: true,

      // Autocompletefield only. Allow user to enter a value not in dropdown/API.
      allowFreeText: true,

      // Group field only. An array of inputfields (text, autocomplete, etc, as above).
      fields: [{...}],

      // Optional selector that causes other fields, indicated by their name in an array,
      // and not required on their own, to change to a required status if the current field is filled in.
      toggleRequired: ["name_of_field_to_change"],

      // Optional selector that causes other fields, indicated by their name in an array,
      // to toggle their private status if the current field is filled in.
      togglePrivate: ["name_of_field_to_change"],

      // Auto generate the value of this field, based on a specific string. Only for text fields.
      // Value must be a string, or a language string object
      autoGenerateValue: "{{some_field_name}} has a value, and {{some_other_field}} also has one",

      // Optional logic that enabled the field to be populated from the value derived from the specified field name.
      // Value must be a single string.
      // Will only trigger if the user hasn't `Touched` the field. (This is to prevent data loss)
      deriveFrom: "name_of_field_to_derive_from"
    },
  ]
}
```

## i18n

Exposes the Deposit components language config. Use this in the main apps language config.

```tsx
import { i18n as i18nDeposit } from "@dans-framework/deposit";
```
