import { createTheme } from "@mui/material/styles";
import {grey} from "@mui/material/colors";
import type {} from "@mui/x-data-grid/themeAugmentation";
import type {} from "@mui/x-date-pickers/themeAugmentation";

const base = createTheme({
  palette: {
    neutral: {
      light: grey[300],
      main: grey[400],
      dark: grey[500],
      contrastText: grey[700],
    },
    footerTop: {
      main: grey[200],
      light: grey[100],
      dark: grey[300],
      contrastText: grey[800],
    },
    footerBottom: {
      main: grey[400],
      light: grey[300],
      dark: grey[500],
      contrastText: grey[500],
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          "&:first-of-type": { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
          "&:last-of-type": { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            opacity: 0.7,
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: ({ theme }) => ({
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
          "&:hover": {
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            transform: "translateY(-1px)",
            boxShadow: `0 2px 8px ${theme.palette.primary.main}40`,
          },
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          "&.Mui-disabled": {
            opacity: 0.6,
            cursor: "not-allowed",
            color: `${theme.palette.primary.contrastText}99`,
          },
        }),
        containedSizeLarge: {
          padding: "0.5rem 1.5rem",
          fontSize: "1rem",
        }
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 16px 0 rgba(0,0,0,0.06), 0 1px 3px 0 rgba(0,0,0,0.04)",
          borderRadius: 8,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          }
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPickersInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPickersOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

base.palette.footerBottom!.link = base.palette.primary.main;

export const theme = base;

declare module "@mui/material/styles" {
  interface PaletteColor {
    link?: string;
  }

  interface SimplePaletteColorOptions {
    link?: string;
  }

  interface Palette {
    neutral?: Palette["primary"];
    footerTop?: Palette["primary"];
    footerBottom?: PaletteColor;
  }

  interface PaletteOptions {
    neutral?: PaletteOptions["primary"];
    footerTop?: Palette["primary"];
    footerBottom?: SimplePaletteColorOptions;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    neutral: true;
  }
}

declare module "@mui/material/SvgIcon" {
  interface SvgIconPropsColorOverrides {
    neutral: true;
  }
}
