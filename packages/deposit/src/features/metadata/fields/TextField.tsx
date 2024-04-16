import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
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

  const generateTitle = () => {
    const titleString = lookupLanguageString(formConfig.generatedTitle, i18n.language);
    // split string into segments to replace
    const segments = titleString ? titleString.split(/({{.*?}})/) : [];
    const generatedTitle = segments.map(segment => {
      const match = segment.match(/{{(.*?)}}/);
      if (match) {
        const field = metadata.map( section => findByIdOrName(match[1], section.fields, 'name' ) ).filter(Boolean)[0]
        return field && field.value ? (
          field.type === 'autocomplete' ?
          (
            Array.isArray(field.value) ?
            field.value.map( v => v.label ).join(' '):
            field.value.label 
          ) :
          field.value
          ) : ""
      }
      return segment;
    }).join("");
    
    dispatch(
      setField({
        sectionIndex: sectionIndex,
        id: field.id,
        value: generatedTitle,
      }),
    );
  }

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
      {field.autoGenerateCondition && allowTitleGeneration &&
        // specific for auto generation of title field
        <Button onClick={() => generateTitle()} sx={{ml: 1}}>
          {t('generate')}
        </Button>
      }
      {groupedFieldId &&
        !formDisabled && [
          totalFields > 1 && (
            <DeleteButton
              key="delete"
              sectionIndex={sectionIndex}
              groupedFieldId={groupedFieldId}
              deleteFieldIndex={currentField}
              mt={currentField === 0 ? 0 : 0.75}
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
              mt={currentField === 0 ? 0 : 0.75}
            />
          ),
        ]}
    </Stack>
  );
};

export default SingleTextField;
