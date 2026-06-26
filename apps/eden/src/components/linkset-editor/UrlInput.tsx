import {
  CheckCircleOutlineOutlined,
  ErrorOutlineOutlined,
  InfoOutlined,
  OpenInNewOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import {
//  Alert,
  Button,
  CircularProgress,
  Collapse,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { type ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export type CheckStatus =
  | "idle"
  | "valid-format"
  | "invalid-format"
  | "checking"
  | "success"
  | "warning"
  | "error";

export interface HeadResult {
  status: number | null;
  contentType: string | null;
  contentLength: number | null;
  lastModified: string | null;
  finalUrl: string;
  outcome: "success" | "warning" | "error";
  outcomeReason: "ok" | "wrong-type" | "too-large" | "not-found" | "network-error" | "cors";
}

/**
 * UrlInput is a component that allows users to input a URL and optionally checks its validity and accessibility by performing a HEAD request.
 * It provides feedback on the URL format, accessibility, content type, and size. The component also handles CORS issues by optionally using a proxy for the HEAD request.
 * Users can choose to disable the URL check if they prefer to only verify the URL themselves.
 * 
 * The URL Check is using a HEAD request to determine if the URL is reachable and usable. 
 * Note that most URLs will be remote relative to the client origin, so CORS will often prevent us from getting a successful response.
 * In those cases, we could attempt to use a public CORS proxy to perform the check, but that also has limitations and may not always work.
 * Because of this, we want to allow users to disable the check entirely (enableUrlCheck) and just rely on them to verify the URL themselves by opening it in a new tab.
 *
 * Verification is supported via a button that opens the URL in a new tab or window . 
 * There is an option to attempt to use a popup window for better user experience, but it is a bit experimental
 *
 * @params value - The current value of the URL input.
 * @params onChange - Callback function that is called when the input value changes. Receives the new value as an argument.
 * @params onConfirmed - Callback function that is called when a URL check is completed. Receives the result of the HEAD request as an argument.
 * @params contentTypes - An optional array of content types to check against the response's Content-Type header. Can include wildcards (e.g., "image/*").
 * @params contentTypesAllowed - If true, the content type must match one of the specified types. If false, the content type must not match any of the specified types. Defaults to true.
 * @params enableUrlCheck - If true, the component will perform a HEAD request to check the URL's accessibility and validity. Defaults to true.
 * @params useProxy - If true, the component will use a CORS proxy when performing the HEAD request to work around CORS issues. Defaults to true.
 * @params forceOpenInNewWindow - If true, the "Open" button will attempt to open the URL in a popup window instead of a standard new tab. Defaults to false.
 * 
 * @example
 * <UrlInput
 *   value={formData.url}
 *   onChange={handleUrlChange}
 *   onConfirmed={(result) => console.log("URL check result:", result)}
 *   contentTypes={["image/*", "application/pdf"]}
 *   contentTypesAllowed={true}
 *   enableUrlCheck={true}
 *   useProxy={true}
 *   forceOpenInNewWindow={false}
 * /> 
 * 
 * In this example, the UrlInput component is used to input a URL. 
 * It checks that the URL is valid and performs a HEAD request to verify that the URL is accessible 
 * and returns a content type that matches either "image/*" or "application/pdf". 
 * The results of the check are logged to the console. 
 * The "Open" button will open the URL in a new tab, 
 * and the component will attempt to use a CORS proxy for the HEAD request to avoid CORS issues.
 *
 * Note: Possible improvement would be to suggest https when no protocol is given and allow the user to select either https (default) or http via a dropdown at the front. 
 * Another improvement would be to detect characters that need escaping and suggest doing so.
 * 
*/
export interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onConfirmed: (result: HeadResult) => void;
  contentTypes?: string[]; // Specify the types for allow or disallow checks
  contentTypesAllowed?: boolean; // Allow means that others are disallowed, while disallow means that others are allowed
  enableUrlCheck?: boolean; // Disable when checking almost always fails because of CORS and we do not want to use a proxy
  useProxy?: boolean; // If we will use a proxy when doing the URL check
  forceOpenInNewWindow?: boolean; // Open in popup/window instead of standard new tab
}

// used at the HEAD request level, so it doesn't guarantee that the actual content is within limits, but it gives us a hint and allows us to warn users about potentially large files before they attempt to open them.
// note that it is fixed for now, but it could be made configurable in the future if needed.
const MAX_BYTES = 26_214_400;

// To work around CORS issues when checking URLs, we use a public CORS proxy. 
// In a production application, you would likely want to implement your own proxy or use a more robust solution. 
// Or have a backend service that performs the URL checks for you.
// Should make this configurable in the future, but for now it's hardcoded. 
// some url prefixes that might work: 
// https://corsproxy.io/?url=
// https://proxy.corsfix.com/?
// https://api.cors.lol/?url="
const CORS_PROXY_PREFIX = "https://proxy.corsfix.com/?";

type UrlProtocol = "https://" | "http://";
const DEFAULT_PROTOCOL: UrlProtocol = "https://";


const OUTCOME_HINT_KEYS: Record<HeadResult["outcomeReason"], string> = {
  ok: "urlInput.outcome.ok",
  "wrong-type": "urlInput.outcome.wrongType",
  "too-large": "urlInput.outcome.tooLarge",
  "not-found": "urlInput.outcome.notFound",
  "network-error": "urlInput.outcome.networkError",
  cors: "urlInput.outcome.cors",
};

const inferNetworkReason = (error: unknown): "network-error" | "cors" => {
  if (error instanceof Error && /cors/i.test(error.message.toLowerCase())) {
    return "cors";
  }

  return "network-error";
};

const parseContentLength = (value: string | null): number | null => {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const splitUrlValue = (value: string): { protocol: UrlProtocol; urlWithoutProtocol: string } => {
  if (value.startsWith("http://")) {
    return {
      protocol: "http://",
      urlWithoutProtocol: value.slice("http://".length),
    };
  }

  if (value.startsWith("https://")) {
    return {
      protocol: "https://",
      urlWithoutProtocol: value.slice("https://".length),
    };
  }

  return {
    protocol: DEFAULT_PROTOCOL,
    urlWithoutProtocol: value,
  };
};

const composeUrlValue = (protocol: UrlProtocol, urlWithoutProtocol: string): string => {
  const trimmed = urlWithoutProtocol.trim();
  if (!trimmed) {
    return "";
  }

  return `${protocol}${trimmed}`;
};

const composeOutgoingValue = (protocol: UrlProtocol, urlWithoutProtocol: string): string => {
  const trimmed = urlWithoutProtocol.trim();
  if (!trimmed) {
    return protocol;
  }

  return `${protocol}${trimmed}`;
};

async function checkUrl(
  url: string,
  contentTypes?: string[],
  contentTypesAllowed: boolean = true,
  useProxy: boolean = true,
): Promise<HeadResult> {
  //const proxiedUrl = `${CORS_PROXY_PREFIX}${encodeURIComponent(url)}`;
  const proxiedUrl = `${CORS_PROXY_PREFIX}${url}`;
  const fetchUrl = useProxy ? proxiedUrl : url;

  let response: Response;

  try {
    response = await fetch(fetchUrl, { method: "HEAD", mode: "cors" });
  } catch (headError) {
    // If HEAD fails we want to try a GET with a Range header, 
    // since some servers don't support HEAD requests properly.
    try {
      response = await fetch(fetchUrl, {
        method: "GET",
        mode: "cors",
        headers: {
          Range: "bytes=0-0",
        },
      });
    } catch (getError) {
      return {
        status: null,
        contentType: null,
        contentLength: null,
        lastModified: null,
        finalUrl: url,
        outcome: "error",
        outcomeReason: inferNetworkReason(getError ?? headError),
      };
    }
  }

  const contentType = response.headers.get("Content-Type");
  const contentLength = parseContentLength(response.headers.get("Content-Length"));
  const lastModified = response.headers.get("Last-Modified");
  const status = response.status;

  if (status === 404 || status === 410) {
    return {
      status,
      contentType,
      contentLength,
      lastModified,
      finalUrl: response.url,
      outcome: "error",
      outcomeReason: "not-found",
    };
  }

  if (status < 200 || status > 299) {
    return {
      status,
      contentType,
      contentLength,
      lastModified,
      finalUrl: response.url,
      outcome: "error",
      outcomeReason: "not-found",
    };
  }

  const normalizedContentType = contentType?.split(";")[0]?.trim().toLowerCase() ?? null;

  const matchesTypeList = (typeList: string[]): boolean => {
    if (normalizedContentType === null) {
      return false;
    }

    return typeList.some((candidateType) => {
      const normalizedCandidate = candidateType.trim().toLowerCase();
      if (normalizedCandidate.endsWith("/*")) {
        return normalizedContentType.startsWith(`${normalizedCandidate.slice(0, -1)}`);
      }

      return normalizedContentType === normalizedCandidate;
    });
  };

  if (contentTypes && contentTypes.length > 0 && normalizedContentType !== null) {
    const isInList = matchesTypeList(contentTypes);
    const isWrongType = contentTypesAllowed ? !isInList : isInList;

    if (isWrongType) {
      return {
        status,
        contentType,
        contentLength,
        lastModified,
        finalUrl: response.url,
        outcome: "warning",
        outcomeReason: "wrong-type",
      };
    }
  }

  if (contentLength !== null && contentLength > MAX_BYTES) {
    return {
      status,
      contentType,
      contentLength,
      lastModified,
      finalUrl: response.url,
      outcome: "warning",
      outcomeReason: "too-large",
    };
  }

  return {
    status,
    contentType,
    contentLength,
    lastModified,
    finalUrl: response.url,
    outcome: "success",
    outcomeReason: "ok",
  };
}

const getFormatValidation = (
  value: string,
): { status: "idle" | "invalid-format" | "valid-format" } => {
  const trimmed = value.trim();

  if (!trimmed) {
    return { status: "idle" };
  }

  if (trimmed === "http://" || trimmed === "https://") {
    return { status: "idle" };
  }

  const candidateUrl =
    trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `${DEFAULT_PROTOCOL}${trimmed}`;

  try {
    const parsed = new URL(candidateUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { status: "invalid-format" };
    }

    if (!parsed.hostname) {
      return { status: "invalid-format" };
    }
  } catch {
    return { status: "invalid-format" };
  }

  return { status: "valid-format" };
};

const formatContentLength = (value: number | null): string => {
  if (value === null) {
    return "—";
  }

  if (value >= 1024 * 1024) {
    return `${(value / (1024 * 1024)).toFixed(2)} MB`;
  }

  if (value >= 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${value} B`;
};

// Bit experimental, not sure this is a good UX
const openInNewWindow = (url: string) => {
  const windowName = `url_verify_${Date.now()}`;
  const openedWindow = window.open(
    url,
    windowName,
    "popup=yes,width=980,height=760,left=120,top=80,noopener,noreferrer",
  );

  if (openedWindow) {
    openedWindow.focus();
    return;
  }

  // Fallback: if popup policies block the request, still open in a new browsing context.
  window.open(url, "_blank", "noopener,noreferrer");
};

type HintState = {
  text: string;
  color: string;
  icon: ReactNode;
};

const getHintState = (
  checkStatus: CheckStatus,
  lastResult: HeadResult | null,
  enableUrlCheck: boolean,
  t: (key: string) => string,
): HintState => {
  switch (checkStatus) {
    case "idle":
      return {
        icon: <InfoOutlined fontSize="inherit" />,
        color: "text.secondary",
        text: t("urlInput.hint.idle"),
      };
    case "invalid-format":
      return {
        icon: <WarningAmberOutlined fontSize="inherit" />,
        color: "warning.main",
        text: t("urlInput.hint.invalidFormat"),
      };
    case "valid-format":
      return {
        icon: <CheckCircleOutlineOutlined fontSize="inherit" />,
        color: "info.main",
        text: enableUrlCheck
          ? t("urlInput.hint.validFormatWithCheck")
          : t("urlInput.hint.validFormatWithoutCheck"),
      };
    case "checking":
      return {
        icon: <CircularProgress size={13} />,
        color: "text.secondary",
        text: t("urlInput.hint.checking"),
      };
    case "success":
      return {
        icon: <CheckCircleOutlineOutlined fontSize="inherit" />,
        color: "success.main",
        text: t("urlInput.hint.success"),
      };
    case "warning":
      return {
        icon: <WarningAmberOutlined fontSize="inherit" />,
        color: "warning.main",
        text: t(
          lastResult
            ? OUTCOME_HINT_KEYS[lastResult.outcomeReason]
            : OUTCOME_HINT_KEYS["network-error"],
        ),
      };
    case "error":
      return {
        icon: <ErrorOutlineOutlined fontSize="inherit" />,
        color: "error.main",
        text: t(
          lastResult
            ? OUTCOME_HINT_KEYS[lastResult.outcomeReason]
            : OUTCOME_HINT_KEYS["network-error"],
        ),
      };
    default:
      return {
        icon: <InfoOutlined fontSize="inherit" />,
        color: "text.secondary",
        text: t("urlInput.hint.idle"),
      };
  }
};

function UrlInput({
  value,
  onChange,
  onConfirmed,
  contentTypes,
  contentTypesAllowed = true,
  enableUrlCheck = true,
  useProxy = true,
  forceOpenInNewWindow = false,
}: UrlInputProps) {
  const { t } = useTranslation("linkset-editor");
  const [checkStatus, setCheckStatus] = useState<CheckStatus>("idle");
  const [lastResult, setLastResult] = useState<HeadResult | null>(null);
  const [isProtocolMenuOpen, setIsProtocolMenuOpen] = useState(false);
  const { protocol: protocolFromValue, urlWithoutProtocol } = useMemo(() => splitUrlValue(value), [value]);
  const [selectedProtocol, setSelectedProtocol] = useState<UrlProtocol>(protocolFromValue);
  const effectiveProtocol =
    value.startsWith("http://") || value.startsWith("https://")
      ? protocolFromValue
      : selectedProtocol;

  const composedUrlValue = useMemo(
    () => composeUrlValue(effectiveProtocol, urlWithoutProtocol),
    [effectiveProtocol, urlWithoutProtocol],
  );

  const formatValidation = useMemo(
    () => getFormatValidation(composedUrlValue),
    [composedUrlValue],
  );
  const hintState = useMemo(
    () => getHintState(checkStatus, lastResult, enableUrlCheck, t),
    [checkStatus, lastResult, enableUrlCheck, t],
  );
  const shouldShowResultPanel =
    (checkStatus === "success" || checkStatus === "warning" || checkStatus === "error") &&
    lastResult !== null;

  const handleChange = (nextUrlWithoutProtocol: string) => {
    const hasProtocol =
      nextUrlWithoutProtocol.startsWith("http://") ||
      nextUrlWithoutProtocol.startsWith("https://");

    const nextParts = hasProtocol
      ? splitUrlValue(nextUrlWithoutProtocol.trim())
      : {
          protocol: effectiveProtocol,
          urlWithoutProtocol: nextUrlWithoutProtocol,
        };

    if (hasProtocol) {
      setSelectedProtocol(nextParts.protocol);
    }

    const nextValue = composeOutgoingValue(nextParts.protocol, nextParts.urlWithoutProtocol);
    const validation = getFormatValidation(nextValue);
    setCheckStatus(validation.status);
    setLastResult(null);
    onChange(nextValue);
  };

  const handleProtocolChange = (nextProtocol: UrlProtocol) => {
    setSelectedProtocol(nextProtocol);
    const nextValue = composeOutgoingValue(nextProtocol, urlWithoutProtocol);
    const validation = getFormatValidation(nextValue);
    setCheckStatus(validation.status);
    setLastResult(null);
    onChange(nextValue);
  };

  const handleCheck = async () => {
    if (!enableUrlCheck) {
      return;
    }

    if (formatValidation.status !== "valid-format") {
      return;
    }

    setCheckStatus("checking");
    setLastResult(null);

    const result = await checkUrl(composedUrlValue.trim(), contentTypes, contentTypesAllowed, useProxy);

    if (result.outcome === "success") {
      setCheckStatus("success");
    } else if (result.outcome === "warning") {
      setCheckStatus("warning");
    } else {
      setCheckStatus("error");
    }

    setLastResult(result);
    onConfirmed(result);
  };

  return (
    <Stack spacing={0.75}>
      <TextField
        fullWidth
        label={t("fields.url")}
        value={urlWithoutProtocol}
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={(event) => {
          if (
            enableUrlCheck &&
            event.key === "Enter" &&
            formatValidation.status === "valid-format"
          ) {
            event.preventDefault();
            void handleCheck();
            return;
          }

          if (
            (event.key === "ArrowDown" || event.key === "ArrowUp") &&
            !urlWithoutProtocol.trim()
          ) {
            event.preventDefault();
            setIsProtocolMenuOpen(true);
            return;
          }

          if (event.key === "Backspace" && !urlWithoutProtocol.trim()) {
            event.preventDefault();
            setIsProtocolMenuOpen(true);
          }
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment
                position="start"
                sx={{
                  mr: 0,
                  alignSelf: "stretch",
                  maxHeight: "none",
                }}
              >
                <Select
                  value={effectiveProtocol}
                  open={isProtocolMenuOpen}
                  variant="standard"
                  disableUnderline
                  onClose={() => setIsProtocolMenuOpen(false)}
                  onOpen={() => setIsProtocolMenuOpen(true)}
                  onChange={(event) => handleProtocolChange(event.target.value as UrlProtocol)}
                  sx={{
                    px: 1,
                    borderRight: 1,
                    borderColor: "divider",
                    height: "100%",
                    minWidth: 105,
                    "& .MuiSelect-select": {
                      py: 1.5,
                      pr: 3,
                      fontWeight: 600,
                    },
                  }}
                >
                  <MenuItem value="https://">https://</MenuItem>
                  <MenuItem value="http://">http://</MenuItem>
                </Select>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Stack direction="row" spacing={1}>
                  {enableUrlCheck && (
                    <Button
                      variant="outlined"
                      disabled={formatValidation.status !== "valid-format"}
                      onClick={() => {
                        void handleCheck();
                      }}
                    >
                      {t("urlInput.checkButton")}
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<OpenInNewOutlined />}
                    disabled={formatValidation.status !== "valid-format"}
                    onClick={() => {
                      if (forceOpenInNewWindow) {
                        openInNewWindow(composedUrlValue.trim());
                        return;
                      }

                      window.open(composedUrlValue.trim(), "_blank", "noopener,noreferrer");
                    }}
                  >
                    {t("urlInput.openButton")}
                  </Button>
                </Stack>
              </InputAdornment>
            ),
          },
        }}
      />

      <Stack direction="row" spacing={0.75} alignItems="center" minHeight={20}>
        <Typography
          component="span"
          variant="caption"
          color={hintState.color}
          sx={{ display: "inline-flex", alignItems: "center", fontSize: 14 }}
        >
          {hintState.icon}
        </Typography>
        <Typography variant="caption" color={hintState.color}>{hintState.text}</Typography>
      </Stack>

      <Collapse in={shouldShowResultPanel}>
        {lastResult && (
          <Paper
            variant="outlined"
            sx={{
              mt: 0.5,
              p: 1.25,
              bgcolor: (theme) =>
                lastResult.outcome === "success"
                  ? alpha(theme.palette.success.main, 0.1)
                  : lastResult.outcome === "warning"
                    ? alpha(theme.palette.warning.main, 0.1)
                    : alpha(theme.palette.error.main, 0.1),
            }}
          >
            <Stack spacing={1}>
              {/* HIDE REDIRECTION, we get it from the proxy
              {lastResult.finalUrl && lastResult.finalUrl !== value.trim() && (
                <Alert
                  severity="info"
                  sx={{
                    py: 0.25,
                    "& .MuiAlert-message": { py: 0 },
                    "& .MuiAlert-icon": { py: 0 },
                  }}
                >
                  <Typography variant="caption">Redirected to {lastResult.finalUrl}</Typography>
                </Alert>
              )} */}

              <Grid container spacing={0.75}>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">{t("urlInput.details.status")}</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption">{lastResult.status ?? "—"}</Typography>
                </Grid>

                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">{t("urlInput.details.contentType")}</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption">{lastResult.contentType ?? "—"}</Typography>
                </Grid>

                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">{t("urlInput.details.contentLength")}</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption">{formatContentLength(lastResult.contentLength)}</Typography>
                </Grid>

                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">{t("urlInput.details.lastModified")}</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption">{lastResult.lastModified ?? "—"}</Typography>
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        )}
      </Collapse>
    </Stack>
  );
}

export default UrlInput;
