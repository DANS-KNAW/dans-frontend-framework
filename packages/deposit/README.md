# DANS Deposit component

The Deposit component consists of the metadata form and a file upload section.

    import { Deposit } from '@dans-framework/deposit'

    <Deposit config=
      {
        form: [{...}], // an array of form sections, see below
        target: [{...}] // Target object, the destination of the submission.
        submitKey: '', // A string that gets passed along in the header of the form submission: 'Bearer <submitKey>'
        skipValidation: false, // if true, a form can always be submitted, handy for testing purposes
        geonamesApiKey: '' // optional Geonames API key
        gsheetsApiKey: '', // optional Google sheets API key
      }
      page={...} // A page object
    />

For target objects, see [@dans-framework/user-auth](/packes/auth/README.md).
For page objects, see [@dans-framework/pages](/packages/pages/README.md).

Each section is a collapsible accordion in the front-end. A section is formatted like so:

    {
      // unique identifier for this section
      id: "section_id",

      // section title, can be a string or a language object ({en: ..., nl: ..., etc})
      title: {
        en: 'English title',
        nl: 'Nederlandse titel'
      },

      // Array of input fields for this section
      fields: [
        {
          // Field type. Can be:
          // * autocomplete - this is a selectbox with either a pre-defined list or typeahead service coupled
          // * text - plain textbox
          // * date - date/time selector
          // * number - numbers only
          // * group - a field group, this group contains another fields array
          // * radio - a radio button selection field (one option is always selected)
          // * check - a checkbox selection field (select zero or more options)
          type: 'text',

          // Label can be a string or preferably a language object
          label: 'Some string',

          // Name for this field, gets sent to the API, needed for mapping
          name: 'some_string',

          // Optionally set field to required or not. Not applicable to radio buttons or group fields.
          required: true,

          // Optional field description, can be a string or a language object. Appears in tooltip or under label in case of group field
          description: 'Some description',

          // Optional pre-set value of this field. A string in case of a text field, an options object in case of an autocomplete field
          value: 'Some value string',

          // Optionally set field to private - this data won't be public
          private: true,

          // You can set the disabled flag if you don't want the user to change this field's value
          disabled: true,

          // Text and group fields only, make field repeatable field
          repeatable: true,

          // Text field only, enable this if you want a larger textarea
          multiline: true,

          // Textfield only, to validate input. See ValidationType in types/Metadata.ts
          validation: 'email',

          // Textfield only. Optionally provide this value if you want to fill a textfield based on user authentication object. See AuthProperty in types/Metadata.ts for options.
          autofill: 'name',

          // Date field only. Specify the format you want to use. See DateTimeFormat in types/Metadata.ts.
          format: 'DD-MM-YYYY HH:mm',

          // Date field only. Specify an optional minimum and/or maximum input date.
          minDate: '01-01-2020 12:00',
          maxDate: '01-01-2024 12:00',

          // Number field only, specify min and/or max number
          minValue: '10',
          maxValue: '20',

          // Autocomplete, radio and check fields only. Selectable options, can be:
          // * an array of option objects like below
          // * an API service: 'orcid', 'ror', 'narcis', etc (autocomplete only). See TypeaheadAPI in types/Metadata.ts.
          // * an array of API services ['orcid', 'ror'] (autocomplete only)
          options: [
            // This is an options object
            {
              // Can be a string or language object
              label: 'Some label',
              // Value is a string, gets sent to server
              value: 'some_string',
              // Optionally set this to true, to always have this value selected. Autocomplete only.
              mandatory: true,
            }
          ],

          // In case Google Sheets is selected as API, you must provide a sheetOptions object
          sheetOptions: {
            // ID of the Google sheet, a long string
            sheetId: 'IDXXX',
            // Name of the page/spread inside the Google sheet you wish to retrieve
            page: 'Page 1',
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
        },
      ]
    }

### i18n

Exposes the Deposit components language config. Use this in the main apps language config.

    import { i18n as i18nDeposit } from '@dans-framework/deposit'
