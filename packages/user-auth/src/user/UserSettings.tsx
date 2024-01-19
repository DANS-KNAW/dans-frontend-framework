import { useTranslation, Trans } from "react-i18next";
import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import { NavLink as RouterLink } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import HelpIcon from "@mui/icons-material/Help";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { useAuth } from "react-oidc-context";
import {
  useFetchUserProfileQuery,
  useSaveUserDataMutation,
  useValidateKeyQuery,
  useValidateAllKeysQuery,
} from "./userApi";
import {
  useSiteTitle,
  setSiteTitle,
  lookupLanguageString,
} from "@dans-framework/utils";
import type { Target } from "../types";
import { useDebouncedCallback } from "use-debounce";

export const UserSettings = ({
  target,
  depositSlug,
}: {
  target: Target[];
  depositSlug?: string;
}) => {
  const { t } = useTranslation("user");
  const siteTitle = useSiteTitle();
  const auth = useAuth();

  useEffect(() => {
    setSiteTitle(siteTitle, t("userSettings"));
  }, [siteTitle, name]);

  const { data: profileData } = useFetchUserProfileQuery(
    auth.settings.client_id,
  );

  // Check if all API keys are valid, to enable/disable button, but make sure they're in the users profile first
  const validateTargets = target.map((t) => ({
    key:
      profileData &&
      profileData.attributes[t.authKey] &&
      profileData.attributes[t.authKey][0],
    url: t.keyCheckUrl,
    type: t.authKey,
  }));
  const skipValidate = validateTargets.some((t) => !t.key);
  const { error: apiKeyError } = useValidateAllKeysQuery(validateTargets, {
    skip: !target || !profileData || skipValidate,
  });

  console.log(apiKeyError)

  return (
    <Container>
      <Grid container>
        <Grid xs={12} mdOffset={2.5} md={7}>
          <Typography variant="h1">{t("userSettings")}</Typography>
          {target.map(
            (tg) =>
              tg.authKey && <UserSettingsItem key={tg.authKey} target={tg} />,
          )}

          <Link
            component={RouterLink}
            to={apiKeyError !== undefined ? "" : `/${depositSlug || `deposit`}`}
          >
            <Button
              variant="contained"
              disabled={apiKeyError !== undefined || skipValidate}
            >
              {t("goToDeposit")}
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};

const UserSettingsItem = ({ target }: { target: Target }) => {
  const auth = useAuth();
  const { t, i18n } = useTranslation("user");
  // user profile that contains the API key
  const { data: profileData } = useFetchUserProfileQuery(
    auth.settings.client_id,
  );
  // the API key that we try to set
  const [apiValue, setApiValue] = useState("");
  // the value of the API key field, which we set separately from the API key itself
  const [fieldValue, setFieldValue] = useState("");

  // function to save new API key in Keycloak
  const [saveData, { isLoading: saveLoading }] = useSaveUserDataMutation();

  // Check if key is valid
  const {
    data: keyData,
    error: keyError,
    isLoading: keyLoading,
    isFetching: keyFetching,
    isSuccess: keySuccess,
  } = useValidateKeyQuery(
    {
      key: apiValue,
      url: target.keyCheckUrl,
      type: target.authKey,
    },
    {
      // only check if apiValue has an actual value, when profile has loaded, and if there's a url to check against
      skip: !profileData || !target.keyCheckUrl || !apiValue,
    },
  );

  // set API key value and field value from the server, once the user profile has been loaded
  useEffect(() => {
    if (profileData) {
      const value =
        (profileData.attributes[target.authKey] &&
          profileData.attributes[target.authKey][0]) ||
        "";
      setApiValue(value);
      setFieldValue(value);
    }
  }, [profileData, target.authKey]);

  // save the API key value to the server if it's a valid key
  useEffect(() => {
    if (
      // if there's a value filled in, and the key is valid
      apiValue &&
      !keyLoading &&
      !keyFetching &&
      keySuccess &&
      // and if there's no profile data with a key, or there is, but the key is different
      (!profileData.attributes[target.authKey] ||
        (profileData.attributes[target.authKey] &&
          profileData.attributes[target.authKey][0] !== apiValue))
    ) {
      saveData({
        id: auth.user?.profile.aud,
        content: {
          // need to pass along the entire account object to Keycloak
          ...profileData,
          attributes: {
            ...profileData.attributes,
            [target.authKey]: apiValue,
          },
        },
      });
    }
  }, [profileData, apiValue, keyLoading, keyFetching, keySuccess]);

  const changeValue = (value: string) => {
    setFieldValue(value);
    debounced(value);
  };

  // debounce the input for checking API key valid state
  const debounced = useDebouncedCallback((value) => setApiValue(value), 500);

  return (
    <Stack direction="column" alignItems="flex-start" mb={4}>
      <Typography variant="h6">
        {t("apiKeyHeader", { type: target.name })}
      </Typography>
      <Typography mb={3} sx={{ display: "flex", alignItems: "center" }}>
        <span>
          <Trans
            i18nKey="user:apiKeyDescription"
            components={[<Link href={target.keyUrl} target="_blank" />]}
          />
        </span>
        {target.helpText && (
          <Tooltip
            sx={{ marginLeft: 0.5 }}
            title={lookupLanguageString(target.helpText, i18n.language)}
          >
            <HelpIcon color="action" />
          </Tooltip>
        )}
      </Typography>
      <TextField
        id={target.authKey}
        label={t("apiKeyLabel", { type: target.name })}
        variant="outlined"
        sx={{ width: "100%", flex: 1 }}
        value={fieldValue}
        onChange={(e) => changeValue(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {keyLoading || keyFetching || saveLoading ? (
                <CircularProgress size={20} />
              ) : apiValue && keySuccess ? (
                <CheckIcon color="success" />
              ) : (keyData && keyData !== "OK") || keyError ? (
                <Tooltip title={t("keyError")}>
                  <ErrorIcon color="error" />
                </Tooltip>
              ) : null}
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
};
