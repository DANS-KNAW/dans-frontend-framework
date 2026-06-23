import { useRef, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { elasticResultApi } from "@dans-framework/elastic-result";
import { lookupLanguageString, type LanguageStrings } from "@dans-framework/utils";

type Item = { label: string | LanguageStrings; value: string };

type Config = {
  title: string;
  subTitle?: string;
  list?: Item[];
  chips?: Item[];
  externalLink?: string;
  valueLabels?: Record<string, Record<string, string>>;
};

const C = {
  ink: "#16191d",
  text: "#22282e",
  body: "#33393f",
  label: "#8a929c",
  labelStrong: "#9aa3ad",
  line: "#e7e9ed",
  lineSoft: "#f0f2f4",
  blue: "#1c5d99",
  blueSoft: "#eef4f9",
  blueBorder: "#dbe7f2",
  chipBg: "#f2f4f6",
  tagBg: "#f4f6f9",
  tagBorder: "#e6eaef",
};
const SANS = "'Public Sans',system-ui,-apple-system,sans-serif";
const SERIF = "'Source Serif 4',Georgia,serif";
const MONO = "ui-monospace,SFMono-Regular,Menlo,monospace";

const getNestedValue = (obj: Record<string, any>, path: string): any =>
  obj?.[path] ?? path.split(".").reduce((acc, key) => acc?.[key], obj);

const toArray = (value: unknown): string[] => {
  if (value === undefined || value === null || value === "") return [];
  return (Array.isArray(value) ? value : [value])
    .filter((v) => v !== undefined && v !== null && v !== "")
    .map((v) => String(v));
};

const isUrl = (val: string): boolean => {
  try {
    const u = new URL(val);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

export default function RecordDetails({ config }: { config: Config }) {
  const { id } = useParams();
  const { data, isLoading } = elasticResultApi.useFetchRecordQuery(id);
  const { t, i18n } = useTranslation("elasticResult");
  const [toastOpen, setToastOpen] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = (text: string) => {
    try {
      navigator.clipboard?.writeText(text);
    } catch {
    }
    setToastOpen(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastOpen(false), 1500);
  };

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "16rem" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (data === undefined) {
    return (
      <Container sx={{ maxWidth: "940px !important", py: 6 }}>
        <Typography variant="h3">{t("recordNotFound")}</Typography>
        <Typography gutterBottom>{t("recordNotFoundDescription")}</Typography>
      </Container>
    );
  }

  const labelFor = (key: string): string => {
    const item = config.list?.find((i) => i.value === key);
    return (item && lookupLanguageString(item.label, i18n.language)) || key;
  };

  const valuesFor = (key: string): string[] => toArray(getNestedValue(data, key));

  const displayValuesFor = (key: string): string[] => {
    const raw = valuesFor(key);
    const map = config.valueLabels?.[key];
    return map ? raw.map((v) => map[v] ?? v) : raw;
  };

  const dedicated = new Set<string>([
    "dct:identifier", // Identifiers
    "dcat:keyword", // Keywords
    "dcat:service", // Services
    "dct:description", // About
    config.title,
    ...(config.externalLink ? [config.externalLink] : []),
    ...(config.subTitle ? [config.subTitle] : []),
  ]);

  const seenDetail = new Set<string>();
  const detailKeys = (config.list ?? [])
    .map((i) => i.value)
    .filter((k) => !dedicated.has(k) && !seenDetail.has(k) && seenDetail.add(k));

  const title = data[config.title] ? lookupLanguageString(data[config.title], i18n.language) : t("noTitle");
  const description = data["dct:description"] ? lookupLanguageString(data["dct:description"], i18n.language) : "";
  const extUrl = config.externalLink ? data[config.externalLink] : undefined;
  const services = valuesFor("dcat:service");
  const keywords = valuesFor("dcat:keyword");
  const identifiers = valuesFor("dct:identifier");

  return (
    <Box sx={{ fontFamily: SANS, bgcolor: "#fff" }}>
      <Container sx={{ maxWidth: "940px !important", px: 3, pt: { xs: 4, sm: "44px" }, pb: 10 }}>

        {/* title + external link */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 4,
            mt: "14px",
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          <Typography
            component="h1"
            sx={{ m: 0, font: `600 38px/1.15 ${SERIF}`, color: C.ink, letterSpacing: "-.01em" }}
          >
            {title}
          </Typography>
          {extUrl && (
            <Button
              component={Link}
              href={extUrl}
              target="_blank"
              rel="noopener"
              disableElevation
              sx={{
                flex: "none",
                mt: "6px",
                bgcolor: C.blue,
                color: "#fff",
                px: "20px",
                py: "12px",
                borderRadius: "8px",
                font: `600 14px/1 ${SANS}`,
                textTransform: "none",
                whiteSpace: "nowrap",
                boxShadow: "0 1px 2px rgba(28,93,153,.4)",
                "&:hover": { bgcolor: "#17517f" },
              }}
            >
              {t("externalLink")} &#8599;
            </Button>
          )}
        </Box>

        {/* About */}
        <SectionHeader>About</SectionHeader>
        {description ? (
          <Typography sx={{ m: 0, maxWidth: "68ch", font: `400 16px/1.68 ${SANS}`, color: C.body }}>
            {description}
          </Typography>
        ) : (
          <NotSpecified />
        )}

        {/* Identifiers */}
        <SectionHeader>Identifiers</SectionHeader>
        {identifiers.length === 0 ? (
          <NotSpecified />
        ) : (
          identifiers.map((value, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  py: "14px",
                  borderBottom: `1px solid ${C.lineSoft}`,
                }}
              >
                <Box sx={{ fontFamily: MONO, fontSize: 13, color: "#2a3138", minWidth: 0, wordBreak: "break-all" }}>
                  {value}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: "none" }}>
                  <Box
                    component="button"
                    onClick={() => copy(value)}
                    sx={{
                      font: `500 12px/1 ${SANS}`,
                      color: "#5b636d",
                      bgcolor: "#fff",
                      border: "1px solid #e2e5ea",
                      borderRadius: "6px",
                      px: "11px",
                      py: "7px",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#f5f6f8", borderColor: "#d3d8de" },
                    }}
                  >
                    Copy
                  </Box>
                  {isUrl(value) && (
                    <Link
                      href={value}
                      target="_blank"
                      rel="noopener"
                      sx={{
                        font: `500 12px/1 ${SANS}`,
                        color: C.blue,
                        bgcolor: C.blueSoft,
                        border: `1px solid ${C.blueBorder}`,
                        borderRadius: "6px",
                        px: "11px",
                        py: "7px",
                        textDecoration: "none",
                        "&:hover": { bgcolor: "#e3eef8" },
                      }}
                    >
                      Open &#8599;
                    </Link>
                  )}
                </Box>
              </Box>
            ))
        )}

        <SectionHeader>Details</SectionHeader>
        {detailKeys.map((key) => (
          <DetailRow key={key} label={labelFor(key)} values={displayValuesFor(key)} />
        ))}

        {/* Services */}
        <SectionHeader>{labelFor("dcat:service")}</SectionHeader>
        {services.length === 0 ? (
          <NotSpecified />
        ) : (
          services.map((value, i) => (
              <Link
                key={i}
                href={isUrl(value) ? value : undefined}
                target="_blank"
                rel="noopener"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  py: "13px",
                  borderBottom: `1px solid ${C.lineSoft}`,
                  textDecoration: "none",
                }}
              >
                <Box sx={{ fontFamily: MONO, fontSize: 12.5, color: C.text, minWidth: 0, wordBreak: "break-all" }}>
                  {value}
                </Box>
                {isUrl(value) && (
                  <Box sx={{ flex: "none", font: `500 12px/1 ${SANS}`, color: C.blue }}>Open &#8599;</Box>
                )}
              </Link>
            ))
        )}

        {/* Keywords */}
        <SectionHeader>{labelFor("dcat:keyword")}</SectionHeader>
        {keywords.length === 0 ? (
          <NotSpecified />
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {keywords.map((kw, i) => (
              <Box
                key={i}
                sx={{ font: `400 13px/1 ${SANS}`, color: "#3a4149", bgcolor: C.chipBg, px: "13px", py: "7px", borderRadius: "999px" }}
              >
                {kw}
              </Box>
            ))}
          </Box>
        )}
      </Container>

      {toastOpen && (
        <Box
          role="status"
          sx={{
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: C.ink,
            color: "#fff",
            px: "20px",
            py: "11px",
            borderRadius: "9px",
            font: `500 13.5px/1 ${SANS}`,
            boxShadow: "0 8px 24px rgba(0,0,0,.25)",
            zIndex: 80,
            display: "flex",
            alignItems: "center",
            gap: "9px",
          }}
        >
          <Box component="span" sx={{ color: "#7fe0a8" }}>
            &#10003;
          </Box>
          Copied to clipboard
        </Box>
      )}
    </Box>
  );
}

function NotSpecified() {
  return (
    <Typography sx={{ py: "13px", font: `400 15px/1.5 ${SANS}`, fontStyle: "italic", color: "#aeb5bd" }}>
      Not specified
    </Typography>
  );
}

function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: "42px", mb: "16px" }}>
      <Typography
        component="span"
        sx={{ font: `700 12px/1 ${SANS}`, letterSpacing: ".1em", textTransform: "uppercase", color: C.ink }}
      >
        {children}
      </Typography>
      <Box sx={{ flex: 1, height: "1px", bgcolor: C.line }} />
    </Box>
  );
}

function DetailRow({ label, values }: { label: string; values: string[] }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: "4px", sm: 3 },
        py: "13px",
        borderBottom: `1px solid ${C.lineSoft}`,
      }}
    >
      <Typography
        sx={{
          flex: "none",
          width: { sm: "220px" },
          pt: "2px",
          font: `600 11px/1.5 ${SANS}`,
          letterSpacing: ".05em",
          textTransform: "uppercase",
          color: C.label,
        }}
      >
        {label}
      </Typography>
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "4px", font: `500 15px/1.5 ${SANS}`, color: C.text }}>
        {values.length === 0 ? (
          <Box component="span" sx={{ fontWeight: 400, color: "#aeb5bd", fontStyle: "italic" }}>
            Not specified
          </Box>
        ) : (
          values.map((v, i) =>
            isUrl(v) ? (
              <Link key={i} href={v} target="_blank" rel="noopener" sx={{ color: C.blue, wordBreak: "break-all" }}>
                {v}
              </Link>
            ) : (
              <Box component="span" key={i}>
                {v}
              </Box>
            ),
          )
        )}
      </Box>
    </Box>
  );
}

