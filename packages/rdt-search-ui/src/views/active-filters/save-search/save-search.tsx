import { useState, useContext, useCallback, useEffect } from "react";
import md5 from "md5";
import { DropDown } from "../../ui/drop-down";
import { SearchProps } from "../../../context/props";
import { SearchState } from "../../../context/state";
import { serializeObject, useSavedSearches } from "./use-saved-searches";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import ShareIcon from "@mui/icons-material/Share";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import LZString from "lz-string";
import { SearchPropsContext } from "../../../context/props";

export interface SearchFilters {
  filters: SearchState["facetFilters"];
  query: string;
}

export function SaveSearch(props: {
  url: SearchProps["url"];
  activeFilters: SearchFilters;
}) {
  const [savedSearches, saveSearch] = useSavedSearches(props.url);
  const hash = useHash(props.activeFilters);
  const [open, setOpen] = useState(false);

  const savedSearch = savedSearches.find((ss) => ss.hash === hash);
  const { t } = useTranslation("views");

  if (savedSearch) {
    return (
      <Box sx={{ flex: 1, width: "100%" }}>
        <Stack
          direction="row"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box sx={{ maxWidth: "80%" }}>
            <Typography variant="body2" sx={{ color: "neutral.dark" }}>
              {t("savedAs")}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "neutral.dark",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {savedSearch.name || savedSearch.hash}
            </Typography>
          </Box>
          <Tooltip title={t("shareSearch")}>
            <IconButton aria-label="delete" onClick={() => setOpen(true)}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <ShareDialog
          open={open}
          setOpen={setOpen}
          activeFilters={props.activeFilters}
        />
      </Box>
    );
  }

  return (
    <DropDown label={t("saveSearch")} small>
      <SavedSearches
        activeFilters={props.activeFilters}
        hash={hash}
        savedSearches={savedSearches}
        saveSearch={saveSearch}
      />
    </DropDown>
  );
}

const SavedSearches = (props: {
  activeFilters: SearchFilters;
  hash: string | undefined;
  savedSearches: ReturnType<typeof useSavedSearches>[0];
  saveSearch: ReturnType<typeof useSavedSearches>[1];
}) => {
  const [name, setName] = useState<string>();
  const { t } = useTranslation("views");

  const save = useCallback(async () => {
    if (props.hash == null) return;

    props.saveSearch({
      name,
      hash: props.hash,
      date: new Date().toUTCString(),
      ...props.activeFilters,
    });
  }, [name, props.hash, props.activeFilters]);

  if (props.hash == null) return null;

  return (
    <Box p={2}>
      <Typography variant="h6">{t("saveSearchAs")}</Typography>
      <Stack direction="row" spacing={1} mt={2}>
        <TextField
          onChange={(ev) => setName(ev.currentTarget.value)}
          onKeyDown={(ev) => {
            if (ev.key === "Enter") save();
          }}
          label={t("enterName")}
          placeholder={props.hash}
          type="text"
          value={name || ""}
          InputLabelProps={{ shrink: true }}
          fullWidth
          size="small"
        />
        <Button variant="contained" onClick={save} size="small">
          {t("save")}
        </Button>
      </Stack>
    </Box>
  );
};

function useHash(activeFilters: SearchFilters | undefined) {
  const [hash, setHash] = useState<string>();

  useEffect(() => {
    if (activeFilters == null) return;
    const activeFilterString = serializeObject(activeFilters);
    const hash = md5(activeFilterString);
    setHash(hash);
  }, [activeFilters]);

  return hash;
}

const ShareDialog = ({
  open,
  setOpen,
  activeFilters,
}: {
  open: boolean;
  setOpen: (arg: boolean) => void;
  activeFilters: SearchFilters;
}) => {
  const { shareRoutes } = useContext(SearchPropsContext);
  const { filters, ...rest } = activeFilters;
  const formattedFilters = {
    ...rest,
    facetFilters: filters,
  };
  const searchString = `?search=${LZString.compressToEncodedURIComponent(
    serializeObject(formattedFilters),
  )}`;
  const [facetValue] = useState(
    `${window.location.origin}${shareRoutes?.results}${searchString}`,
  );
  const [dashboardValue] = useState(
    `${window.location.origin}${shareRoutes?.dashboard}${searchString}`,
  );
  const [copy, setCopy] = useState("");
  const { t } = useTranslation("views");
  const close = () => {
    setOpen(false);
    setCopy("");
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
      <IconButton
        aria-label="close"
        onClick={close}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle>{t("shareSearch")}</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>{t("dashboardView")}</Typography>
        <Stack direction="row" mb={2}>
          <TextField
            id="shareDashUrl"
            fullWidth
            size="small"
            disabled
            value={dashboardValue}
            sx={{ mr: 1 }}
          />
          <Button
            variant="contained"
            onClick={() => {
              navigator.clipboard.writeText(dashboardValue);
              setCopy("dashboardView");
            }}
          >
            Copy
          </Button>
        </Stack>
        <Typography gutterBottom>{t("facetView")}</Typography>
        <Stack direction="row">
          <TextField
            id="shareResultUrl"
            fullWidth
            size="small"
            disabled
            value={facetValue}
            sx={{ mr: 1 }}
          />
          <Button
            variant="contained"
            onClick={() => {
              navigator.clipboard.writeText(facetValue);
              setCopy("facetView");
            }}
          >
            Copy
          </Button>
        </Stack>
      </DialogContent>
      {copy && (
        <Fade in={copy !== ""}>
          <Alert severity="success">
            {t("copiedShareUrl", { value: t(copy) })}
          </Alert>
        </Fade>
      )}
    </Dialog>
  );
};
