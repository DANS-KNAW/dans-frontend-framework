import {
  CheckCircleOutlined,
  CloseOutlined,
  ErrorOutlined,
  HelpOutlined,
  InfoOutlined,
} from "@mui/icons-material";
import {
  Box,
  ClickAwayListener,
  IconButton,
  InputAdornment,
  ListSubheader,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type MajorType =
  | "application"
  | "audio"
  | "chemical"
  | "example"
  | "font"
  | "image"
  | "message"
  | "model"
  | "multipart"
  | "text"
  | "video";

export interface SubEntry {
  value: string;
  label: string;
}

export type ValidationState =
  | "empty"
  | "typing-major"
  | "locked-no-sub"
  | "invalid-chars"
  | "known"
  | "unknown-valid";

export interface MediaTypeValue {
  major: MajorType;
  sub: string;
  full: string;
}

export interface MediaTypeInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onConfirmed?: (result: MediaTypeValue) => void;
  label?: string;
  size?: "small" | "medium";
}

const MAJORS: MajorType[] = [
  "application",
  "audio",
  "chemical",
  "example",
  "font",
  "image",
  "message",
  "model",
  "multipart",
  "text",
  "video",
];

const KNOWN_SUBS: Record<MajorType, SubEntry[]> = {
  image: [
    { value: "png", label: "PNG image" },
    { value: "jpeg", label: "JPEG image" },
    { value: "gif", label: "GIF" },
    { value: "webp", label: "WebP" },
    { value: "svg+xml", label: "SVG vector" },
    { value: "tiff", label: "TIFF" },
    { value: "avif", label: "AVIF" },
  ],
  application: [
    { value: "json", label: "JSON data" },
    { value: "xml", label: "XML" },
    { value: "pdf", label: "PDF" },
    { value: "zip", label: "ZIP archive" },
    { value: "octet-stream", label: "Binary" },
    { value: "rdf+xml", label: "RDF/XML" },
    { value: "ld+json", label: "JSON-LD" },
    { value: "x-ndjson", label: "NDJSON" },
    { value: "vnd.ms-excel", label: "Excel (legacy)" },
    {
      value: "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      label: "Excel (xlsx)",
    },
    { value: "vnd.api+json", label: "JSON:API" },
  ],
  text: [
    { value: "plain", label: "Plain text" },
    { value: "csv", label: "CSV" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "javascript", label: "JavaScript" },
    { value: "markdown", label: "Markdown" },
    { value: "xml", label: "XML text" },
    { value: "tab-separated-values", label: "TSV" },
  ],
  audio: [
    { value: "mpeg", label: "MP3" },
    { value: "ogg", label: "Ogg" },
    { value: "wav", label: "WAV" },
    { value: "webm", label: "WebM audio" },
    { value: "aac", label: "AAC" },
  ],
  video: [
    { value: "mp4", label: "MP4" },
    { value: "webm", label: "WebM video" },
    { value: "ogg", label: "Ogg video" },
    { value: "mpeg", label: "MPEG" },
  ],
  font: [
    { value: "woff", label: "WOFF" },
    { value: "woff2", label: "WOFF2" },
    { value: "ttf", label: "TrueType" },
    { value: "otf", label: "OpenType" },
  ],
  multipart: [
    { value: "form-data", label: "Form data" },
    { value: "mixed", label: "Mixed" },
    { value: "alternative", label: "Alternative" },
  ],
  message: [
    { value: "http", label: "HTTP message" },
    { value: "rfc822", label: "Email RFC 822" },
  ],
  model: [
    { value: "gltf+json", label: "glTF JSON" },
    { value: "gltf-binary", label: "glTF binary" },
    { value: "obj", label: "OBJ" },
  ],
  chemical: [
    { value: "x-pdb", label: "Protein Data Bank" },
    { value: "x-xyz", label: "XYZ format" },
  ],
  example: [{ value: "example", label: "Example type" }],
};

const SUB_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9!#$&\-^_.+]*$/;

type Suggestion = {
  key: string;
  group: "Major types" | "Known types" | "Subtypes";
  left: string;
  right: string;
  major: MajorType;
  sub: string;
};

type HintState = {
  icon: typeof InfoOutlined;
  color: string;
  text: string;
};

const isMajorType = (value: string): value is MajorType => {
  return (MAJORS as string[]).includes(value);
};

const findKnownLabel = (major: MajorType, sub: string): string | null => {
  const lowered = sub.toLowerCase();
  const match = KNOWN_SUBS[major].find((entry) => entry.value === lowered);
  return match ? match.label : null;
};

const parseMaybeType = (raw: string): { major: MajorType; sub: string } | null => {
  const slashIdx = raw.indexOf("/");
  if (slashIdx <= 0) {
    return null;
  }

  const majorPart = raw.slice(0, slashIdx).trim().toLowerCase();
  const subPart = raw.slice(slashIdx + 1).trim();

  if (!isMajorType(majorPart)) {
    return null;
  }

  return { major: majorPart, sub: subPart };
};

const renderMatched = (text: string, query: string): ReactNode => {
  if (!query) {
    return text;
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const start = lowerText.indexOf(lowerQuery);

  if (start < 0) {
    return text;
  }

  const end = start + query.length;
  return (
    <>
      {text.slice(0, start)}
      <Box component="strong" sx={{ color: "primary.main", fontWeight: 700 }}>
        {text.slice(start, end)}
      </Box>
      {text.slice(end)}
    </>
  );
};

function MediaTypeInput({
  value,
  onChange,
  onConfirmed,
  label = "Media type",
  size = "medium",//"small",
}: MediaTypeInputProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [lockedMajor, setLockedMajor] = useState<MajorType | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [hiIdx, setHiIdx] = useState<number>(-1);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const previousValidationRef = useRef<ValidationState>("empty");
  const previousValuePropRef = useRef<string | undefined>(value);

  const assembledValue = lockedMajor ? `${lockedMajor}/${inputValue}` : inputValue;

  const lockMajor = (major: MajorType, subSoFar: string) => {
    setLockedMajor(major);
    setInputValue(subSoFar);
    setHiIdx(-1);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(subSoFar.length, subSoFar.length);
    });
  };

  const unlockMajor = () => {
    setInputValue(lockedMajor ?? "");
    setLockedMajor(null);
    setHiIdx(-1);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const suggestions = useMemo<Suggestion[]>(() => {
    if (!lockedMajor) {
      const query = inputValue.trim().toLowerCase();
      const majorMatches = MAJORS.filter((major) => major.startsWith(query)).map((major) => ({
        key: `major:${major}`,
        group: "Major types" as const,
        left: major,
        right: "Major type",
        major,
        sub: "",
      }));

      const knownAll: Suggestion[] = [];
      for (const major of MAJORS) {
        for (const sub of KNOWN_SUBS[major]) {
          const full = `${major}/${sub.value}`;
          if (full.toLowerCase().includes(query)) {
            knownAll.push({
              key: `known:${major}/${sub.value}`,
              group: "Known types",
              left: full,
              right: sub.label,
              major,
              sub: sub.value,
            });
          }
        }
      }

      return [...majorMatches, ...knownAll.slice(0, 6)];
    }

    const query = inputValue.trim().toLowerCase();
    return KNOWN_SUBS[lockedMajor]
      .filter((entry) => {
        if (!query) {
          return true;
        }

        return (
          entry.value.toLowerCase().startsWith(query) ||
          entry.label.toLowerCase().includes(query)
        );
      })
      .map((entry) => ({
        key: `sub:${lockedMajor}/${entry.value}`,
        group: "Subtypes" as const,
        left: `${lockedMajor}/${entry.value}`,
        right: entry.label,
        major: lockedMajor,
        sub: entry.value,
      }));
  }, [inputValue, lockedMajor]);

  const validationState = useMemo<ValidationState>(() => {
    if (!lockedMajor && !inputValue) {
      return "empty";
    }

    if (!lockedMajor && inputValue) {
      return "typing-major";
    }

    if (lockedMajor && !inputValue) {
      return "locked-no-sub";
    }

    if (lockedMajor && !SUB_REGEX.test(inputValue)) {
      return "invalid-chars";
    }

    if (
      lockedMajor &&
      KNOWN_SUBS[lockedMajor].some((entry) => entry.value === inputValue.toLowerCase())
    ) {
      return "known";
    }

    return "unknown-valid";
  }, [inputValue, lockedMajor]);

  const hintState = useMemo<HintState>(() => {
    if (validationState === "empty") {
      return {
        icon: InfoOutlined,
        color: "text.primary",
        text: "Start typing a major type or a full type like image/png",
      };
    }

    if (validationState === "typing-major") {
      return {
        icon: InfoOutlined,
        color: "text.secondary",
        text: "Keep typing — or pick a major type from the list",
      };
    }

    if (validationState === "locked-no-sub") {
      return {
        icon: InfoOutlined,
        color: "info.main",
        text: "Now type or pick a subtype",
      };
    }

    if (validationState === "invalid-chars") {
      return {
        icon: ErrorOutlined,
        color: "error.main",
        text: "Invalid characters — use letters, digits, hyphens, dots, or +",
      };
    }

    if (validationState === "known" && lockedMajor) {
      const knownLabel = findKnownLabel(lockedMajor, inputValue) ?? `${lockedMajor}/${inputValue}`;
      return {
        icon: CheckCircleOutlined,
        color: "success.main",
        text: `${knownLabel} — well-known type`,
      };
    }

    return {
      icon: HelpOutlined,
      color: "text.secondary",
      text: "Valid format — subtype not in common list, double-check if unsure",
    };
  }, [validationState, lockedMajor, inputValue]);

  useEffect(() => {
    if (!lockedMajor || !inputValue) {
      return;
    }

    onChange?.(`${lockedMajor}/${inputValue}`);
  }, [lockedMajor, inputValue, onChange]);

  useEffect(() => {
    const prev = previousValidationRef.current;
    const now = validationState;

    if (
      (now === "known" || now === "unknown-valid") &&
      prev !== now &&
      lockedMajor &&
      inputValue
    ) {
      onConfirmed?.({
        major: lockedMajor,
        sub: inputValue,
        full: `${lockedMajor}/${inputValue}`,
      });
    }

    previousValidationRef.current = now;
  }, [validationState, lockedMajor, inputValue, onConfirmed]);

  useEffect(() => {
    if (value === undefined) {
      previousValuePropRef.current = value;
      return;
    }

    // Only re-parse when the external prop value actually changes.
    if (value === previousValuePropRef.current) {
      return;
    }

    previousValuePropRef.current = value;

    if (value === assembledValue) {
      return;
    }

    const parsed = parseMaybeType(value);
    const nextMajor = parsed ? parsed.major : null;
    const nextInput = parsed ? parsed.sub : value;

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      setLockedMajor(nextMajor);
      setInputValue(nextInput);
    });

    return () => {
      cancelled = true;
    };
  }, [value, assembledValue]);

  const pickSuggestion = (suggestion: Suggestion) => {
    lockMajor(suggestion.major, suggestion.sub);
    setOpen(false);
  };

  const handleTextChange = (nextRaw: string) => {
    if (!lockedMajor) {
      const parsed = parseMaybeType(nextRaw);
      if (parsed) {
        lockMajor(parsed.major, parsed.sub);
        setOpen(true);
        return;
      }

      setInputValue(nextRaw);
      setOpen(true);
      return;
    }

    setInputValue(nextRaw);
    setOpen(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      setHiIdx(-1);
      return;
    }

    if (
      lockedMajor &&
      inputValue === "" &&
      event.key === "Backspace"
    ) {
      event.preventDefault();
      unlockMajor();
      return;
    }

    if (!open || suggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHiIdx((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHiIdx((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
      return;
    }

    if (event.key === "Enter" && hiIdx >= 0 && hiIdx < suggestions.length) {
      event.preventDefault();
      pickSuggestion(suggestions[hiIdx]);
    }
  };

  const groupedSuggestions = useMemo(() => {
    const groups: Array<{
      name: Suggestion["group"];
      items: Suggestion[];
    }> = [];

    for (const suggestion of suggestions) {
      const existing = groups.find((group) => group.name === suggestion.group);
      if (existing) {
        existing.items.push(suggestion);
      } else {
        groups.push({ name: suggestion.group, items: [suggestion] });
      }
    }

    return groups;
  }, [suggestions]);

  let rowIndex = -1;
  const hintIcon = hintState.icon;
  const showFullTypeValue =
    (validationState === "known" || validationState === "unknown-valid") && Boolean(assembledValue);

  return (
    <Stack spacing={0.75}>
      <Box ref={setAnchorEl}>
        <TextField
          fullWidth
          label={label}
          size={size}
          value={inputValue}
          placeholder={lockedMajor ? "subtype…" : "e.g. image/png or start typing…"}
          onFocus={() => {
            if (suggestions.length > 0) {
              setOpen(true);
            }
          }}
          onClick={() => {
            if (suggestions.length > 0) {
              setOpen(true);
            }
          }}
          onChange={(event) => handleTextChange(event.target.value)}
          onKeyDown={handleKeyDown}
          inputRef={inputRef}
          slotProps={{
            input: {
              startAdornment: lockedMajor ? (
                <InputAdornment
                  position="start"
                  sx={{
                    mr: 0,
                    alignSelf: "stretch",
                    maxHeight: "none",
                  }}
                >
                  <Box
                    sx={{
                      px: 1.25,
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                      borderRight: 1,
                      borderColor: "divider",
                      bgcolor: "info.200",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "monospace",
                        color: "info.main",
                        fontWeight: 600,
                        lineHeight: 1,
                      }}
                    >
                      {`${lockedMajor} /`}
                    </Typography>
                  </Box>
                </InputAdornment>
              ) : undefined,
              endAdornment: lockedMajor ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    aria-label="Unlock major type"
                    onClick={unlockMajor}
                  >
                    <CloseOutlined fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            },
          }}
        />
      </Box>

      <Popper
        open={open && suggestions.length > 0}
        anchorEl={anchorEl}
        placement="bottom-start"
        sx={{ zIndex: (theme) => theme.zIndex.modal + 1, width: anchorEl?.clientWidth }}
      >
        <ClickAwayListener
          onClickAway={() => {
            setOpen(false);
            setHiIdx(-1);
          }}
        >
          <Paper variant="outlined" sx={{ mt: 0.5, maxHeight: 180, overflow: "auto" }}>
            <MenuList dense>
              {groupedSuggestions.map((group, groupIdx) => (
                <Box key={group.name}>
                  {groupIdx > 0 && <ListSubheader disableSticky>{group.name}</ListSubheader>}
                  {group.items.map((item) => {
                    rowIndex += 1;
                    const currentIdx = rowIndex;
                    const query = lockedMajor ? inputValue.trim() : inputValue.trim();
                    return (
                      <MenuItem
                        key={item.key}
                        selected={hiIdx === currentIdx}
                        onMouseEnter={() => setHiIdx(currentIdx)}
                        onClick={() => pickSuggestion(item)}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 2,
                          alignItems: "baseline",
                        }}
                      >
                        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                          {renderMatched(item.left, query)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                          {item.right}
                        </Typography>
                      </MenuItem>
                    );
                  })}
                </Box>
              ))}
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </Popper>

      <Stack direction="row" spacing={0.75} alignItems="center" minHeight={20}>
        <SvgIcon component={hintIcon} inheritViewBox sx={{ fontSize: 16, color: hintState.color }} />
        <Typography variant="caption" color={hintState.color}>
          {hintState.text}
        </Typography>
      </Stack>

      {showFullTypeValue && (
        <Box
          sx={(theme) => ({
            display: "inline-flex",
            alignSelf: "flex-start",
            px: 1,
            py: 0.25,
            borderRadius: 1,
            border: 1,
            borderColor: theme.palette.success.main,
            bgcolor: alpha(theme.palette.success.main, 0.08),
            color: theme.palette.success.dark,
            fontFamily: "monospace",
          })}
        >
          <Typography variant="caption" sx={{ fontFamily: "inherit", color: "inherit" }}>
            {assembledValue}
          </Typography>
        </Box>
      )}
    </Stack>
  );
}

export default MediaTypeInput;
