import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useDebounce } from 'use-debounce';
import { useTranslation } from 'react-i18next';
import { useFetchOrcidQuery } from '../api/orcid';
import { useFetchRorByNameQuery } from '../api/ror';
import { useFetchGeonamesFreeTextQuery } from '../api/geonames';
import { useFetchGettyAATTermsQuery } from '../api/getty';
import { useFetchSheetsQuery } from '../api/sheets';
import { useFetchDatastationsTermQuery } from '../api/datastations';
import { useFetchDansFormatsQuery } from '../../files/api/dansFormats';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getFieldStatus } from '../metadataHelpers';
import { StatusIcon } from '../../generic/Icons';
import { setField, setMultiApiField } from '../metadataSlice';
import type { AutocompleteFieldProps, AutocompleteAPIFieldProps } from '../../../types/MetadataProps';
import type { TypeaheadAPI, OptionsType } from '../../../types/MetadataFields';
import type { QueryReturnType } from '../../../types/Api';
import { lookupLanguageString } from '@dans-framework/utils';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import AutocompleteField, { InfoLink, InfoChip } from './AutocompleteField';
import { getMetadataSubmitStatus } from '../../submit/submitSlice';
import { getData } from '../../../deposit/depositSlice';
import { useFetchGorcQuery } from '../api/gorc';
import { useFetchLicensesQuery } from '../api/licenses';

/*
 *  Type ahead fields for different API endpoints
 *  Create a Component for every endpoint, as we cannot call a hook conditionally
 *  Debounce needed to give the API time to respond and not hammer it with requests
 *  Queries get cached by RTK Query
*/

export const OrcidField = ({field, sectionIndex}: AutocompleteFieldProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const debouncedInputValue = useDebounce(inputValue, 500)[0];
  // Fetch data on input change
  const {data, isFetching, isLoading} = useFetchOrcidQuery<QueryReturnType>(debouncedInputValue, {skip: debouncedInputValue === ''});

  return (
    <AutocompleteAPIField 
      field={field} 
      sectionIndex={sectionIndex} 
      inputValue={inputValue} 
      setInputValue={setInputValue} 
      debouncedInputValue={debouncedInputValue} 
      data={data} 
      isLoading={isLoading} 
      isFetching={isFetching}
    />
  )
}

export const RorField = ({field, sectionIndex}: AutocompleteFieldProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const debouncedInputValue = useDebounce(inputValue, 500)[0];
  // Fetch data on input change
  const {data, isFetching, isLoading} = useFetchRorByNameQuery<QueryReturnType>(debouncedInputValue, {skip: debouncedInputValue === ''});

  return (
    <AutocompleteAPIField 
      field={field} 
      sectionIndex={sectionIndex} 
      inputValue={inputValue} 
      setInputValue={setInputValue} 
      debouncedInputValue={debouncedInputValue} 
      data={data} 
      isLoading={isLoading} 
      isFetching={isFetching} 
    />
  )
}

export const GorcField = ({field, sectionIndex}: AutocompleteFieldProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const debouncedInputValue = useDebounce(inputValue, 500)[0];
  // Fetch data on input change
  const {data, isFetching, isLoading} = useFetchGorcQuery<QueryReturnType>(debouncedInputValue, {skip: debouncedInputValue === ''});
  return (
    <>
      <AutocompleteAPIField 
        field={field} 
        sectionIndex={sectionIndex} 
        inputValue={inputValue} 
        setInputValue={setInputValue} 
        debouncedInputValue={debouncedInputValue} 
        data={data} 
        isLoading={isLoading} 
        isFetching={isFetching} 
      />
    </>
  )
}

export const LicensesField = ({field, sectionIndex}: AutocompleteFieldProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const debouncedInputValue = useDebounce(inputValue, 500)[0];
  // Fetch data on input change
  const {data, isFetching, isLoading} = useFetchLicensesQuery<QueryReturnType>(debouncedInputValue, {skip: debouncedInputValue === ''});

  return (
    <AutocompleteAPIField
      field={field}
      sectionIndex={sectionIndex}
      inputValue={inputValue}
      setInputValue={setInputValue}
      debouncedInputValue={debouncedInputValue}
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
    />
  )
}

export const GeonamesField = ({field, sectionIndex}: AutocompleteFieldProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const debouncedInputValue = useDebounce(inputValue, 500)[0];
  const apiKey = useAppSelector(getData).geonamesApiKey;
  // Fetch data on input change
  const {data, isFetching, isLoading} = useFetchGeonamesFreeTextQuery<QueryReturnType>({value: debouncedInputValue, apiKey: apiKey}, {skip: debouncedInputValue === ''});

  return (
    <AutocompleteAPIField 
      field={field} 
      sectionIndex={sectionIndex} 
      inputValue={inputValue} 
      setInputValue={setInputValue} 
      debouncedInputValue={debouncedInputValue} 
      data={data} 
      isLoading={isLoading} 
      isFetching={isFetching} 
    />
  )
}

export const GettyField = ({field, sectionIndex}: AutocompleteFieldProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const debouncedInputValue = useDebounce(inputValue, 500)[0];
  // Fetch data on input change
  const {data, isFetching, isLoading} = useFetchGettyAATTermsQuery<QueryReturnType>(debouncedInputValue, {skip: debouncedInputValue === ''});

  return (
    <AutocompleteAPIField 
      field={field} 
      sectionIndex={sectionIndex} 
      inputValue={inputValue} 
      setInputValue={setInputValue} 
      debouncedInputValue={debouncedInputValue} 
      data={data} 
      isLoading={isLoading} 
      isFetching={isFetching} 
    />
  )
}

export const DatastationsField = ({field, sectionIndex}: AutocompleteFieldProps) => {
  const { i18n } = useTranslation();
  const [inputValue, setInputValue] = useState<string>('');
  const debouncedInputValue = useDebounce(inputValue, 500)[0];
  // Fetch data on input change
  const {data, isFetching, isLoading} = useFetchDatastationsTermQuery<QueryReturnType>({
    vocabulary: field.options,
    lang: i18n.language,
    query: debouncedInputValue,
  }, {skip: debouncedInputValue === ''});

  return (
    <AutocompleteAPIField 
      field={field} 
      sectionIndex={sectionIndex} 
      inputValue={inputValue} 
      setInputValue={setInputValue} 
      debouncedInputValue={debouncedInputValue} 
      data={data} 
      isLoading={isLoading} 
      isFetching={isFetching} 
    />
  )
}

// Google Sheets and DANS file formats fields, get all values at once
// So just use a simple AutocompleteField with options fetched from the API
export const DansFormatsField = ({field, sectionIndex}: AutocompleteFieldProps) => {
  // Fetch data right away
  const {data, isFetching, isLoading} = useFetchDansFormatsQuery<QueryReturnType>(null);
  const newField = {...field, options: data && data.response ? data.response : []};

  return (
    <AutocompleteField 
      field={newField} 
      sectionIndex={sectionIndex} 
      isLoading={isLoading || isFetching} 
    />
  )
}

export const SheetsField = ({field, sectionIndex}: AutocompleteFieldProps) => {
  const apiKey = useAppSelector(getData).gsheetsApiKey;
  const {data, isFetching, isLoading} = useFetchSheetsQuery<QueryReturnType>({options: field.sheetOptions, apiKey: apiKey});
  const newField = {...field, options: data && data.response ? data.response : []};

  return (
    <AutocompleteField 
      field={newField} 
      sectionIndex={sectionIndex} 
      isLoading={isLoading || isFetching} 
    />
  )
}

export const MultiApiField = ({field, sectionIndex}: AutocompleteFieldProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('metadata');
  const metadataSubmitStatus = useAppSelector(getMetadataSubmitStatus);

  return (
    <Stack direction="row" alignItems="start">
       <FormControl  sx={{ minWidth: 110, mr: 1 }}>
        <InputLabel id="select-api">{t('multiApiSelectLabel')}</InputLabel>
        <Select
          labelId="select-api"
          label={t('multiApiSelectLabel')}
          onChange={(e) => {
            // set the type of API used
            dispatch(setMultiApiField({
              sectionIndex: sectionIndex,
              id: field.id,
              value: e.target.value,
            }));
            // and reset the currently selected value if there is one
            field.value && dispatch(setField({
              sectionIndex: sectionIndex,
              id: field.id,
              value: '',
            }))
          }}
          value={field.multiApiValue}
          disabled={metadataSubmitStatus !== ''}
        >
          {Array.isArray(field.options) && (field.options as TypeaheadAPI[]).map( option => 
            <MenuItem key={option} value={option}>{t(`multi-${option}`)}</MenuItem>
          )}
        </Select>
      </FormControl>
      {field.multiApiValue === 'ror' && <RorField field={field} sectionIndex={sectionIndex} />}
      {field.multiApiValue === 'orcid' && <OrcidField field={field} sectionIndex={sectionIndex} />}
      {field.multiApiValue === 'gorc' && <GorcField field={field} sectionIndex={sectionIndex} />}
      {field.multiApiValue === 'geonames' && <GeonamesField field={field} sectionIndex={sectionIndex} />}
      {field.multiApiValue === 'getty' && <GettyField field={field} sectionIndex={sectionIndex} />}
      {field.multiApiValue === 'sheets' && <SheetsField field={field} sectionIndex={sectionIndex} />}
      {field.multiApiValue === 'dansFormats' && <DansFormatsField field={field} sectionIndex={sectionIndex} />}
      {(field.multiApiValue === 'elsst' || field.multiApiValue === 'narcis') && <DatastationsField field={field} sectionIndex={sectionIndex} />}
    </Stack>
  )
}

const AutocompleteAPIField = ({
  field, 
  sectionIndex, 
  inputValue, 
  setInputValue, 
  debouncedInputValue, 
  data, 
  isLoading, 
  isFetching,
}: AutocompleteAPIFieldProps) => {
  const dispatch = useAppDispatch();
  const status = getFieldStatus(field);
  const { t, i18n } = useTranslation('metadata');
  const apiValue = (Array.isArray(field.options) ? field.multiApiValue : field.options) as TypeaheadAPI;
  const metadataSubmitStatus = useAppSelector(getMetadataSubmitStatus);

  return (
    <Stack direction="row" alignItems="start" sx={{flex: 1}}>
      <Autocomplete
        multiple={field.multiselect}
        fullWidth 
        includeInputInList
        id={field.id}
        options={inputValue && debouncedInputValue === inputValue && data && data.arg === debouncedInputValue ? data.response : []}
        value={field.value || (field.multiselect ? [] : null)}
        inputValue={
          inputValue ||
          (!inputValue && field.value && !Array.isArray(field.value) && lookupLanguageString(field.value.label, i18n.language)) || 
          ''
        }
        renderInput={
          (params) => 
            <TextField 
              {...params}
              label={`${lookupLanguageString(field.label, i18n.language)}${field.required ? ' *' : ''}`}
              error={status === 'error' && field.touched}
              helperText={status === 'error' && field.touched && t('incorrect')}
              placeholder={lookupLanguageString(field.placeholder, i18n.language)}
              InputProps={{
                ...params.InputProps,
                startAdornment: !field.multiselect && field.value && !Array.isArray(field.value) && field.value.value && field.value.value.startsWith('http') ? 
                  <InfoLink link={field.value.value} apiValue={apiValue} /> :
                  params.InputProps.startAdornment,
              }}
            />
        }
        renderTags={(value, getTagProps) => 
          value.map((option, index) => 
            <InfoChip key={index} option={option} apiValue={apiValue} getTagProps={getTagProps} index={index} />
          )
        }
        onChange={(e, newValue, reason) => {
          // Gets set when user selects a value from the list
          // Make sure a mandatory value cannot get erased from a multiselect
          const saveValues = (reason === 'clear' || reason === 'removeOption') && Array.isArray(field.value) && Array.isArray(newValue) && 
            [...field.value.filter(v => v.mandatory), ...newValue.filter(v => !v.hasOwnProperty('mandatory'))];

          // In case freesolo is enabled and value selected using 'Enter', it's a string.
          // So we need to convert that string to an OptionsType
          const setValue = 
            // check if it's a multiselect field with a freetext input and value is selected using enter
            Array.isArray(newValue) && field.allowFreeText && typeof newValue[newValue.length - 1] === 'string' ?
            [...newValue.slice(0, -1), { value: newValue[newValue.length - 1], freetext: true, label: newValue[newValue.length - 1] }] :
            // the same for non-multiselect
            (typeof newValue === 'string')  ? 
            {label: newValue, value: newValue, freetext: true} :
            // otherwise just return the new value
            newValue;

          // Set the field
          dispatch(setField({
            sectionIndex: sectionIndex,
            id: field.id,
            value: (saveValues || setValue) as OptionsType | OptionsType[],
          }));

          // For freesolo, we reset the input value here
          field.allowFreeText && (reason === 'createOption' || reason === 'selectOption') && setInputValue('');
        }}
        onInputChange={(e, newValue) => {
          // Gets set when user starts typing
          e && e.type === 'change' && setInputValue(newValue);
          // Clears input when user selects a value (inputValue becomes value, which gets displayed in the field)
          // or when a user clicks outside of the box without selecting a value 
          e && (e.type === 'click' || e.type === 'blur') && setInputValue('');
        }}
        noOptionsText={!inputValue ? t('startTyping', {api: t(apiValue)}) : t('noResults')}
        loading={isFetching || isLoading || debouncedInputValue !== inputValue ||
          // this final check is somewhat hacky: we want freesolo to always display a dropdown box
          field.allowFreeText
        }
        loadingText={
          field.allowFreeText && !isLoading && !isFetching && debouncedInputValue === inputValue ?
          // for freesolo, display the dropdown message when not searching
          t('startTyping', {api: t(apiValue)}) :
          // otherwise the loading indicator
          <Stack direction="row" justifyContent="space-between" alignItems="end">{t('loading')} <CircularProgress size={18} /></Stack>
        }
        renderOption={(props, option) =>
          <li {...props} key={option.value} style={{flexWrap: 'wrap'}} >
            {option.categoryLabel && option.categoryContent && 
              <Typography component="div" sx={{width: '100%', fontSize: '0.8rem'}} color="neutral.contrastText">
                <Typography component="span" sx={{fontWeight: '600', fontSize: 'inherit'}}>{t(option.categoryLabel)}</Typography>: {option.categoryContent}
              </Typography>
            }
            {lookupLanguageString(option.label, i18n.language)}
            {option.extraContent && option.extraLabel &&
              <Typography component="div" sx={{width: '100%', fontSize: '0.8rem'}} color="neutral.contrastText">
                <Typography component="span" sx={{fontWeight: '600', fontSize: 'inherit'}}>{t(option.extraLabel)}</Typography>: {option.extraContent}
              </Typography>
            }
            {option.id && option.idLabel &&
              <Typography component="div" sx={{width: '100%', fontSize: '0.8rem'}} color="neutral.contrastText">
                <Typography component="span" sx={{fontWeight: '600', fontSize: 'inherit'}}>{t(option.idLabel)}</Typography>: {option.id}
              </Typography>
            }
          </li>
        }
        freeSolo={field.allowFreeText}
        forcePopupIcon 
        filterOptions={(options, params) => {
          // only for freesolo, add input directly as option
          if (field.allowFreeText && !isLoading && debouncedInputValue === inputValue) {
            const filter = createFilterOptions<OptionsType>();
            const filtered = filter(options, params);
            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some((option) => inputValue === option.label);
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                value: inputValue,
                label: inputValue,
                freetext: true,
                extraLabel: t('freetextLabel', {api: t(apiValue)}) as string,
                extraContent: t('freetextContent', {name: inputValue}) as string,
              });
            }

            return filtered;
          }
          else {
            return options;
          }
        }}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        /* 
         * For freesolo, we can either choose autoSelect or clearOnBlur, depends on the behaviour we want.
         * AutoSelect just uses the value as typed, clearOnBlur forces the user to make a conscious selection
         * For autoSelect, we could remove most of the filterOptions logic and the extra check in onChange.
         */
        clearOnBlur
        disabled={metadataSubmitStatus !== ''}
      />
      <StatusIcon 
        margin="lt"
        status={status} 
        title={lookupLanguageString(field.description, i18n.language)} 
        subtitle={t('apiValue', {api: t(apiValue)}) as string} 
      />
    </Stack>
  )
}
