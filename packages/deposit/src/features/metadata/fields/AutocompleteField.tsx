import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getFieldStatus } from '../metadataHelpers';
import { StatusIcon } from '../../generic/Icons';
import { setField } from '../metadataSlice';
import type { AutocompleteFieldProps } from '../../../types/MetadataProps';
import type { OptionsType } from '../../../types/MetadataFields';
import { lookupLanguageString } from '@dans-framework/utils/language';
import { getMetadataSubmitStatus } from '../../submit/submitSlice';

const AutocompleteField = ({field, sectionIndex, isLoading}: AutocompleteFieldProps) => {
  const dispatch = useAppDispatch();
  const status = getFieldStatus(field);
  const { t, i18n } = useTranslation('metadata');
  const metadataSubmitStatus = useAppSelector(getMetadataSubmitStatus);

  const options = Array.isArray(field.options) ? field.options as OptionsType[] : [];
  const localizedOptions = options.map( option => ({...option, label: lookupLanguageString(option.label, i18n.language)})) as OptionsType[] || [];

  return (
    <Stack direction="row" alignItems="start">
      <Autocomplete
        multiple={field.multiselect}
        fullWidth 
        id={field.id}
        options={localizedOptions}
        groupBy={(option) => (option.header && lookupLanguageString(option.header, i18n.language)) || ''}
        value={field.value || (field.multiselect ? [] : null)}
        renderInput={
          (params) => 
            <TextField 
              {...params}
              label={`${lookupLanguageString(field.label, i18n.language)}${field.required ? ' *' : ''}`}
              error={status === 'error' && field.touched}
              helperText={status === 'error' && field.touched && t('incorrect')}
            />
        }
        onChange={(e, newValue) => dispatch(setField({
          sectionIndex: sectionIndex,
          id: field.id,
          value: newValue
        }))}
        loading={isLoading === true}
        disabled={metadataSubmitStatus !== ''}
        isOptionEqualToValue={(option, value) => option.value === value.value}
      />
      {field.description && <StatusIcon margin="lt" status={status} title={lookupLanguageString(field.description, i18n.language)} />}
    </Stack>
  )
}

export default AutocompleteField;