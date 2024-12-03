import { useCallback, KeyboardEvent } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import HelpIcon from "@mui/icons-material/Help";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";

interface Props {
  handleInputChange: any;
  inputValue: string;
  setSuggestActive: any;
  loader?: boolean;
}
export function InputWrapper(props: Props) {
  const handleKeyDown = useCallback((ev: KeyboardEvent) => {
    if (
      ev.code === "Enter" || // Enter
      ev.code === "Escape" // Escape
    ) {
      props.setSuggestActive(false);
    }
  }, []);

  const { t } = useTranslation("views");

  return (
    <TextField
      label={t("searchDocuments")}
      value={props.inputValue}
      onClick={() => props.setSuggestActive(false)}
      onChange={props.handleInputChange}
      onKeyDown={handleKeyDown}
      fullWidth
      sx={{ mb: 2 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {props.loader ?
              <CircularProgress size={22} />
            : <Tooltip title={t("fullTextSearchHelp")}>
                <HelpIcon />
              </Tooltip>
            }
          </InputAdornment>
        ),
      }}
    />
  );
}
