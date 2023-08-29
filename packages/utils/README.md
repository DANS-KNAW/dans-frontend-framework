# DANS helper utilities

### @dans-framework/utils/language
`import { lookupLanguageString } from '@dans-framework/utils/language'`
Exposes a `lookupLanguageString(languageObject, language)` function. Converts a languageObject `{en: '', nl: ''}` to the appropriate string, or displays a string in case a plain string is passed instead of a languageObject.

### @dans-framework/utils/error
`import { errorLogger } from '@dans-framework/utils/error'`
Helper function to show errors called by RTK. Don't forget to add it to your middleware.
