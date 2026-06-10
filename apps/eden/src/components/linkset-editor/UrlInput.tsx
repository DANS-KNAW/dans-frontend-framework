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
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { type ReactNode, useMemo, useState } from "react";

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

export interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onConfirmed: (result: HeadResult) => void;
  contentTypes?: string[]; // Specify the types for allow or disallow checks
  contentTypesAllowed?: boolean; // Allow means that others are disallowed, while disallow means that others are allowed
  enableUrlCheck?: boolean; // Disable when checking almost always fails because of CORS and we do not want to use a proxy
  useProxy?: boolean; // If we will use a proxy when doing the URL check
  forceOpenInNewWindow?: boolean; // Best-effort popup/window behavior instead of standard new tab
}

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


const OUTCOME_HINTS: Record<HeadResult["outcomeReason"], string> = {
  ok: "URL confirmed reachable.",
  "wrong-type": "This type is not allowed. Check the link or allowed types.",
  "too-large": "Resource exceeds the 25 MB limit. Try a smaller resource or split it.",
  "not-found": "Resource not found (404). Double-check the URL or try a different link.",
  "network-error": "Could not reach this URL. It may be private, offline, or blocking requests.",
  cors: "Could not reach this URL. It may be private, offline, or blocking requests.",
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
  enableUrlCheck: boolean,
): { status: "idle" | "invalid-format" | "valid-format"; hint: string } => {
  const trimmed = value.trim();

  if (!trimmed) {
    return { status: "idle", hint: "Enter a URL to begin." };
  }

  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return {
      status: "invalid-format",
      hint: "URL must start with https:// or http://",
    };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return {
        status: "invalid-format",
        hint: "URL must start with https:// or http://",
      };
    }
  } catch {
    return {
      status: "invalid-format",
      hint: "URL must start with https:// or http://",
    };
  }

  return {
    status: "valid-format",
    hint: enableUrlCheck
      ? "Looks good — click Check URL or Open to verify it's reachable."
      : "Looks good — click Open to verify it's reachable.",
  };
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
): HintState => {
  switch (checkStatus) {
    case "idle":
      return {
        icon: <InfoOutlined fontSize="inherit" />,
        color: "text.secondary",
        text: "Paste a direct link.",
      };
    case "invalid-format":
      return {
        icon: <WarningAmberOutlined fontSize="inherit" />,
        color: "warning.main",
        text: "URL must start with https:// or http://",
      };
    case "valid-format":
      return {
        icon: <CheckCircleOutlineOutlined fontSize="inherit" />,
        color: "info.main",
        text: enableUrlCheck
          ? "Looks good — click Check URL or Open to verify it's reachable."
          : "Looks good — click Open to verify it's reachable.",
      };
    case "checking":
      return {
        icon: <CircularProgress size={13} />,
        color: "text.secondary",
        text: "Checking reachability…",
      };
    case "success":
      return {
        icon: <CheckCircleOutlineOutlined fontSize="inherit" />,
        color: "success.main",
        text: "Confirmed reachable.",
      };
    case "warning":
      return {
        icon: <WarningAmberOutlined fontSize="inherit" />,
        color: "warning.main",
        text: lastResult ? OUTCOME_HINTS[lastResult.outcomeReason] : OUTCOME_HINTS["network-error"],
      };
    case "error":
      return {
        icon: <ErrorOutlineOutlined fontSize="inherit" />,
        color: "error.main",
        text: lastResult ? OUTCOME_HINTS[lastResult.outcomeReason] : OUTCOME_HINTS["network-error"],
      };
    default:
      return {
        icon: <InfoOutlined fontSize="inherit" />,
        color: "text.secondary",
        text: "Paste a direct link.",
      };
  }
};

/**
 * The URL Check is using a HEAD request to determine if the URL is reachable and usable. 
 * Note that most URLs will be remote relative to the client origin, so CORS will often prevent us from getting a successful response.
 * In those cases, we could attempt to use a public CORS proxy to perform the check, but that also has limitations and may not always work.
 * Because of this, we want to allow users to disable the check entirely (enableUrlCheck) and just rely on them to verify the URL themselves by opening it in a new tab.
 */
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
  const [checkStatus, setCheckStatus] = useState<CheckStatus>("idle");
  const [lastResult, setLastResult] = useState<HeadResult | null>(null);

  const formatValidation = useMemo(
    () => getFormatValidation(value, enableUrlCheck),
    [value, enableUrlCheck],
  );
  const hintState = useMemo(
    () => getHintState(checkStatus, lastResult, enableUrlCheck),
    [checkStatus, lastResult, enableUrlCheck],
  );
  const shouldShowResultPanel =
    (checkStatus === "success" || checkStatus === "warning" || checkStatus === "error") &&
    lastResult !== null;

  const handleChange = (nextValue: string) => {
    const validation = getFormatValidation(nextValue, enableUrlCheck);
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

    const result = await checkUrl(value.trim(), contentTypes, contentTypesAllowed, useProxy);

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
        label="URL"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={(event) => {
          if (
            enableUrlCheck &&
            event.key === "Enter" &&
            formatValidation.status === "valid-format"
          ) {
            event.preventDefault();
            void handleCheck();
          }
        }}
        slotProps={{
          input: {
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
                      Check URL
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<OpenInNewOutlined />}
                    disabled={formatValidation.status !== "valid-format"}
                    onClick={() => {
                      if (forceOpenInNewWindow) {
                        openInNewWindow(value.trim());
                        return;
                      }

                      window.open(value.trim(), "_blank", "noopener,noreferrer");
                    }}
                  >
                    Open to verify
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
                  <Typography variant="caption" color="text.secondary">Status</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption">{lastResult.status ?? "—"}</Typography>
                </Grid>

                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">Content-Type</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption">{lastResult.contentType ?? "—"}</Typography>
                </Grid>

                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">Content-Length</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption">{formatContentLength(lastResult.contentLength)}</Typography>
                </Grid>

                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">Last-Modified</Typography>
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
