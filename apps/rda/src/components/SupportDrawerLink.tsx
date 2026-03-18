import { Typography } from "@mui/material";
import { useSupportDrawerControl } from "@dans-framework/support-drawer";
import { lookupLanguageString } from "@dans-framework/utils";
import { useTranslation } from "react-i18next";

interface LanguageString {
  en: string;
  nl: string;
}

export default function SupportDrawerLink({
  text,
  linkText,
  topic,
  suffix = "",
}: {
  text: LanguageString;
  linkText: LanguageString;
  topic?: string;
  suffix?: string;
}) {
  const { openDrawer } = useSupportDrawerControl();
  const { i18n } = useTranslation();

  const handleClick = () => openDrawer(topic);

  return (
    <Typography
      sx={{
        mt: 3,
        fontSize: "1rem",
        lineHeight: 2,
        color: "#4b5563",
        maxWidth: "48rem",
        textWrap: "pretty",
      }}
    >
      {lookupLanguageString(text, i18n.language)}
      <span
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick();
        }}
        style={{
          color: "#4F8E31",
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        {lookupLanguageString(linkText, i18n.language)}
      </span>
      {suffix}
    </Typography>
  );
}
