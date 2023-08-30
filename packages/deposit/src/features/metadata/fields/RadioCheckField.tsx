import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setField } from '../metadataSlice';
import { getFieldStatus } from '../metadataHelpers';
import { StatusIcon } from '../../generic/Icons';
import { lookupLanguageString } from '@dans-framework/utils/language';
import type { RadioFieldProps, CheckFieldProps } from '../../../types/MetadataProps';
import { getMetadataSubmitStatus } from '../../submit/submitSlice';
import { useTranslation } from 'react-i18next';

// List of radio button options. First value of the options is selected by default, so no need for status checking.
export const RadioField = ({field, sectionIndex}: RadioFieldProps) => {
  const dispatch = useAppDispatch();
  const metadataSubmitStatus = useAppSelector(getMetadataSubmitStatus);
  const { i18n } = useTranslation();
  const status = getFieldStatus(field);

  return (
    <FormControl>
      <FormLabel id={field.id} sx={{display:'flex', mb: 1}}>
        <StatusIcon status={status} margin="r" title={lookupLanguageString(field.description, i18n.language)} />
        {lookupLanguageString(field.label, i18n.language)}
      </FormLabel>
      <RadioGroup
        row={field.layout === 'row'}
        aria-labelledby={field.id}
        name={field.name}
        value={field.value || ''}
        onChange={(e) => dispatch(setField({
          sectionIndex: sectionIndex,
          id: field.id,
          value: e.target.value,
        }))}
      >
        {field.options.map( option =>
          <FormControlLabel 
            key={option.value} 
            value={option.value} 
            control={<Radio sx={{mr: 0.15}}/>} 
            label={lookupLanguageString(option.label, i18n.language)} 
            disabled={metadataSubmitStatus !== ''}
          />
        )}
      </RadioGroup>
    </FormControl>
  )
}

// For a list of checkboxes, we keep the selected values in an array.
export const CheckField = ({field, sectionIndex}: CheckFieldProps) => {
  const dispatch = useAppDispatch();
  const status = getFieldStatus(field);
  const metadataSubmitStatus = useAppSelector(getMetadataSubmitStatus);
  const { i18n } = useTranslation();

  return (
    <FormControl
      required={field.required}
      error={field.required && field.value?.length === 0}
      component="fieldset"
    >
      <FormLabel id={field.id} sx={{display:'flex', mb: 1}}>
        <StatusIcon status={status} margin="r" title={lookupLanguageString(field.description, i18n.language)} />
        {lookupLanguageString(field.label, i18n.language)}
      </FormLabel>
      <FormGroup>
        {field.options.map( option =>
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                sx={{mr: 0.15}}
                checked={Boolean(field.value && field.value.indexOf(option.value) !== -1)} 
                onChange={(e) => dispatch(setField({
                  sectionIndex: sectionIndex,
                  id: field.id,
                  value: e.target.checked ? [...field.value || '', e.target.name] : field.value.filter( item => item !== e.target.name),
                }))} 
                name={option.value}
                disabled={metadataSubmitStatus !== ''}
              />
            }
            label={lookupLanguageString(option.label, i18n.language)}
          />
        )}
      </FormGroup>
    </FormControl>
  )
}
