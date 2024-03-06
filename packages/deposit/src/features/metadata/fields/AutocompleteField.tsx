import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getFieldStatus } from "../metadataHelpers";
import { StatusIcon } from "../../generic/Icons";
import { setField } from "../metadataSlice";
import type {
  AutocompleteFieldProps,
  InfoLinkProps,
  InfoChipProps,
} from "../../../types/MetadataProps";
import type { OptionsType } from "../../../types/MetadataFields";
import { lookupLanguageString } from "@dans-framework/utils";
import Tooltip from "@mui/material/Tooltip";
import LaunchIcon from "@mui/icons-material/Launch";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import { getFormDisabled } from "../../../deposit/depositSlice";

const AutocompleteField = ({
  field,
  sectionIndex,
  isLoading,
  onOpen,
}: AutocompleteFieldProps) => {
  const dispatch = useAppDispatch();
  const status = getFieldStatus(field);
  const { t, i18n } = useTranslation("metadata");
  const formDisabled = useAppSelector(getFormDisabled);

  const options = Array.isArray(field.options)
    ? (field.options as OptionsType[])
    : [];
  const localizedOptions =
    (options.map((option) => ({
      ...option,
      label: lookupLanguageString(option.label, i18n.language),
    })) as OptionsType[]) || [];

  return (
    <Stack direction="row" alignItems="start" sx={{width: '100%'}}>
      <Autocomplete
        multiple={field.multiselect}
        fullWidth
        data-testid={`${field.name}-${field.id}`}
        options={localizedOptions}
        groupBy={(option) =>
          (option.header &&
            lookupLanguageString(option.header, i18n.language)) ||
          ""
        }
        value={field.value || (field.multiselect ? [] : null)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={`${lookupLanguageString(field.label, i18n.language)}${
              field.required ? " *" : ""
            }`}
            error={status === "error" && field.touched}
            helperText={status === "error" && field.touched && t("incorrect")}
            InputProps={{
              ...params.InputProps,
              startAdornment:
                !field.multiselect &&
                field.value &&
                !Array.isArray(field.value) &&
                ((field.value.value && field.value.value.startsWith("http")) || field.value.url) ? (
                  <InfoLink
                    link={(field.value.value.startsWith("http") && field.value.value) || field.value.url as string}
                    checkValue={lookupLanguageString(
                      field.value.label,
                      i18n.language,
                    )}
                  />
                ) : (
                  params.InputProps.startAdornment
                ),
            }}
            inputProps={{
              ...params.inputProps,
              'data-testid': `${field.name}-${field.id}`,
            }}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <InfoChip
              option={option}
              key={index}
              getTagProps={getTagProps}
              index={index}
            />
          ))
        }
        onChange={(_e, newValue) =>
          dispatch(
            setField({
              sectionIndex: sectionIndex,
              id: field.id,
              value: newValue,
            }),
          )
        }
        loading={isLoading === true}
        disabled={formDisabled}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onOpen={onOpen}
        renderOption={(props, option) => (
          <li {...props} key={`${option.value}-${option.label}`} style={{ flexWrap: "wrap" }}>
            {option.categoryLabel && option.categoryContent && (
              <Typography
                component="div"
                sx={{ width: "100%", fontSize: "0.8rem" }}
                color="neutral.contrastText"
              >
                <Typography
                  component="span"
                  sx={{ fontWeight: "600", fontSize: "inherit" }}
                >
                  {t(option.categoryLabel)}
                </Typography>
                : {option.categoryContent}
              </Typography>
            )}
            {lookupLanguageString(option.label, i18n.language)}
            {option.extraContent && option.extraLabel && (
              <Typography
                component="div"
                sx={{ width: "100%", fontSize: "0.8rem" }}
                color="neutral.contrastText"
              >
                <Typography
                  component="span"
                  sx={{ fontWeight: "600", fontSize: "inherit" }}
                >
                  {t(option.extraLabel)}
                </Typography>
                : {option.extraContent}
              </Typography>
            )}
            {option.id && option.idLabel && (
              <Typography
                component="div"
                sx={{ width: "100%", fontSize: "0.8rem" }}
                color="neutral.contrastText"
              >
                <Typography
                  component="span"
                  sx={{ fontWeight: "600", fontSize: "inherit" }}
                >
                  {t(option.idLabel)}
                </Typography>
                : {option.id}
              </Typography>
            )}
          </li>
        )}
      />
      <StatusIcon
        margin="lt"
        status={status}
        title={
          field.description &&
          lookupLanguageString(field.description, i18n.language)
        }
      />
    </Stack>
  );
};

export const InfoLink = ({
  link,
  apiValue,
  chip,
  checkValue,
}: InfoLinkProps) => {
  const { t } = useTranslation("metadata");
  return (
    <InputAdornment
      position="start"
      sx={{ ml: chip ? 1.5 : 0.5, mr: chip ? -0.75 : 0.25, zIndex: 1 }}
    >
      <Tooltip
        title={
          apiValue
            ? t("checkApi", { api: t(apiValue) })
            : t("checkValue", { value: checkValue })
        }
      >
        <a
          href={link}
          target="_blank"
          style={{ lineHeight: 0 }}
          rel="noreferrer"
        >
          <LaunchIcon
            color="primary"
            sx={{ fontSize: 16, "&:hover": { color: "primary.dark" } }}
          />
        </a>
      </Tooltip>
    </InputAdornment>
  );
};

export const InfoChip = ({
  option,
  apiValue,
  getTagProps,
  index,
}: InfoChipProps) => {
  const { i18n } = useTranslation("metadata");
  const formDisabled = useAppSelector(getFormDisabled);
  return (
    <Chip
      {...getTagProps({ index })}
      label={
        option.freetext
          ? option.value
          : lookupLanguageString(option.label, i18n.language)
      }
      size="medium"
      icon={
        (option.value && option.value.startsWith("http")) || option.url ? (
          <InfoLink
            link={(option.value.startsWith("http") && option.value) || option.url as string}
            apiValue={apiValue}
            checkValue={lookupLanguageString(option.label, i18n.language)}
            chip={true}
          />
        ) : undefined
      }
      disabled={option.mandatory || formDisabled}
    />
  );
};

export default AutocompleteField;
