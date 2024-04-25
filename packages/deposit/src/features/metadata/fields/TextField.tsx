import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import RefreshIcon from '@mui/icons-material/Refresh';
import InputAdornment from "@mui/material/InputAdornment";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { StatusIcon } from "../../generic/Icons";
import { AddButton, DeleteButton } from "../MetadataButtons";
import { setField, getMetadata, getAllowTitleGeneration } from "../metadataSlice";
import { getFieldStatus, findByIdOrName } from "../metadataHelpers";
import type { TextFieldProps } from "../../../types/MetadataProps";
import { lookupLanguageString } from "@dans-framework/utils";
import { getFormDisabled, getData } from "../../../deposit/depositSlice";
import moment from "moment";

const SingleTextField = ({
  field,
  sectionIndex,
  groupedFieldId,
  currentField = 0,
  totalFields = 1,
}: TextFieldProps) => {
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const status = getFieldStatus(field);
  const { t, i18n } = useTranslation("metadata");
  const formDisabled = useAppSelector(getFormDisabled);
  const allowTitleGeneration = useAppSelector(getAllowTitleGeneration);
  const formConfig = useAppSelector(getData);
  const metadata = useAppSelector(getMetadata);
  const [generatedTitle, setGeneratedTitle] = useState<string>('');

  useEffect(() => {
    // if requested, auto fill user data from oidc, if field has no (manually) set value
    if (field.autofill && auth.user && !field.value) {
      dispatch(
        setField({
          sectionIndex: sectionIndex,
          id: field.id,
          value: auth.user.profile[field.autofill] as string,
        }),
      );
    }
  }, [dispatch, field.autofill, field.id, sectionIndex, auth.user]);

  // function to generate title from form config string and filled in fields
  // set to state, so we only have to call this function once
  const generateTitle = () => {
    const titleString = lookupLanguageString(formConfig.generatedTitle, i18n.language);
    // split string into segments to replace
    const segments = titleString ? titleString.split(/({{.*?}})/) : [];
    const title = segments.map(segment => {
      const match = segment.match(/{{(.*?)}}/);
      if (match) {
        const field = metadata.map( section => findByIdOrName(match[1], section.fields, 'name' ) ).filter(Boolean)[0];

        return field && field.value ? (
          field.type === 'autocomplete' ?
          (
            Array.isArray(field.value) ?
            field.value.map( v => v.label ).join(' & ') :
            field.value.label 
          ) : 
          // if field type is date, just convert it to DD-MM-YYYY for every value
          // TODO: should any other app than ohsmart want to use this, modify this where necessary
          field.type === 'date' ?
          moment(field.value).startOf('day').format('DD-MM-YYYY') :
          field.value
        ) : null
      }
      return segment;
    });

    if (!title.includes(null)) { 
      setGeneratedTitle(title.join(""));
    }
  }

  const setTitle = () => {
    dispatch(
      setField({
        sectionIndex: sectionIndex,
        id: field.id,
        value: generatedTitle,
      }),
    );
  }

  // generate the title, makes sure this updates when title state has been set
  useEffect(() => {
    if (field.autoGenerateTitle && allowTitleGeneration) {
      // generate title if it hasn't been do so yet
      !generatedTitle && generateTitle();
      // if there's no value set yet, set title to generated value
      !field.value && setTitle();
    }
  }, [generatedTitle]);

  return (
    <Stack direction="row" alignItems="center">
      <TextField
        fullWidth
        error={status === "error" && field.touched}
        helperText={status === "error" && field.touched && t("incorrect")}
        variant="outlined"
        type={field.type}
        label={lookupLanguageString(field.label, i18n.language)}
        required={field.required}
        multiline={field.multiline}
        rows={field.multiline ? 4 : ""}
        value={field.value || ""}
        disabled={
          (field.disabled &&
            !(field.autofill && !auth.user?.profile[field.autofill])) ||
          formDisabled
        }
        onChange={(e) =>
          dispatch(
            setField({
              sectionIndex: sectionIndex,
              id: field.id,
              value: e.target.value,
            }),
          )
        }
        sx={{
          mt: groupedFieldId && currentField !== 0 ? 1 : 0,
        }}
        placeholder={field.placeholder}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <StatusIcon
                status={status}
                title={
                  field.description &&
                  lookupLanguageString(field.description, i18n.language)
                }
              />
            </InputAdornment>
          ),
        }}
        inputProps={{ "data-testid": `${field.name}-${field.id}` }}
      />
      {field.autoGenerateTitle && allowTitleGeneration && generatedTitle &&
        // auto generation of title field if allowed and there's a title available
        <Tooltip title={t('generate')}>
          <IconButton 
            onClick={() => setTitle()} 
            sx={{
              ml: 0.5,
              // keep icon centered
              mt: status === "error" && field.touched ? -3 : 0,
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      }
      {groupedFieldId &&
        !formDisabled && [
          totalFields > 1 && (
            <DeleteButton
              key="delete"
              sectionIndex={sectionIndex}
              groupedFieldId={groupedFieldId}
              deleteFieldIndex={currentField}
              mt={
                (status === "error" && field.touched ? -3 : 0) + 
                (currentField === 0 ? 0 : 1)
              }
              deleteGroupId={field.id}
              groupedFieldName={field.name}
            />
          ),
          currentField + 1 === totalFields && (
            <AddButton
              key="add"
              sectionIndex={sectionIndex}
              groupedFieldId={groupedFieldId}
              groupedFieldName={field.name}
              type="single"
              mt={
                (status === "error" && field.touched ? -3 : 0) + 
                (currentField === 0 ? 0 : 1)
              }
            />
          ),
        ]}
    </Stack>
  );
};

export default SingleTextField;
