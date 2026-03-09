import React, { ReactElement, useState, type SyntheticEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import dansLogo from "./images/logo-dans-rgb.svg";
import { NavLink as RouterLink, useNavigate, useLocation } from "react-router-dom";
import type { Page } from "@dans-framework/pages";
import { lookupLanguageString } from "@dans-framework/utils";
import { useTranslation } from "react-i18next";
import { UserMenu } from "@dans-framework/user-auth";
import { useAuth } from "react-oidc-context";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const NAV_HEIGHT = 58;

const activeIndicatorSx = {
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    height: "2px",
    width: 0,
    borderRadius: "2px 2px 0 0",
    backgroundColor: "currentColor",
    opacity: 0,
    transition: "width 0.22s ease, opacity 0.22s ease",
  },
  "&.active::after, &:hover::after": {
    width: "60%",
    opacity: 0.85,
  },
};

const MenuBar = ({
  pages,
  logo = dansLogo,
  userSettings = true,
  userSubmissions = true,
  userMenu = true,
  embed = false,
}: {
  pages: Page[];
  logo?: any;
  userSettings?: boolean;
  userSubmissions?: boolean;
  userMenu?: boolean;
  embed?: boolean;
}) => {
  const { i18n } = useTranslation();
  const auth = userMenu ? useAuth() : undefined;
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => setAnchorElNav(null);

  if (embed) return <TabBar pages={pages} />;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 1px 24px 0 rgba(0,0,0,0.06)",
        color: "primary.main",
        height: NAV_HEIGHT,
        justifyContent: "center",
        borderRadius: 0,
        animation: "navSlideDown 0.35s cubic-bezier(0.16,1,0.3,1) both",
        "@keyframes navSlideDown": {
          from: { transform: "translateY(-100%)", opacity: 0 },
          to: { transform: "translateY(0)", opacity: 1 },
        },
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters role="navigation" sx={{ minHeight: `${NAV_HEIGHT}px !important` }}>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" }, alignItems: "center" }}>
            <IconButton
              size="medium"
              aria-label="open navigation"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="primary"
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              slotProps={{
                paper: {
                  sx: {
                    mt: 0.5,
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(20px)",
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.07)",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
                  },
                },
              }}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages?.map(
                (page, i) =>
                  page.inMenu &&
                  page.menuTitle &&
                  ((page.restricted && auth?.isAuthenticated) || !page.restricted) && (
                    <MenuItem
                      key={i}
                      onClick={handleCloseNavMenu}
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        letterSpacing: "0.01em",
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                      }}
                    >
                      <Link
                        underline="none"
                        color="inherit"
                        component={RouterLink}
                        to={(page.slug || page.link) as string}
                        target={page.newTab ? "_blank" : "_self"}
                      >
                        {lookupLanguageString(page.menuTitle, i18n.language)}
                      </Link>
                    </MenuItem>
                  ),
              )}
            </Menu>

            {logo && (
              <Link component={RouterLink} to="/" sx={{ ml: 1 }}>
                <Logo logo={logo} />
              </Link>
            )}
          </Box>

          {/* Desktop: logo */}
          {logo && (
            <Link
              component={RouterLink}
              to="/"
              sx={{
                mr: 3,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                textDecoration: "none",
                lineHeight: 0,
              }}
            >
              <Logo logo={logo} />
            </Link>
          )}

          {/* Desktop: nav links */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              alignItems: "stretch",
              height: NAV_HEIGHT,
              gap: 0.5,
            }}
          >
            {pages?.map(
              (page, i) =>
                page.inMenu &&
                page.menuTitle &&
                ((page.restricted && auth?.isAuthenticated) || !page.restricted) && (
                  <Button
                    key={i}
                    onClick={handleCloseNavMenu}
                    component={RouterLink}
                    to={(page.slug || page.link) as string}
                    target={page.newTab ? "_blank" : "_self"}
                    sx={{
                      px: 1.75,
                      color: "text.primary",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      letterSpacing: "0.015em",
                      borderRadius: 0,
                      textTransform: "none",
                      transition: "color 0.15s ease",
                      "&:hover": { color: "primary.main", backgroundColor: "transparent" },
                      // Active state: inherit color from RouterLink's .active class
                      "&.active": { color: "primary.main" },
                      ...activeIndicatorSx,
                    }}
                  >
                    {lookupLanguageString(page.menuTitle, i18n.language)}
                  </Button>
                ),
            )}
          </Box>

          {userMenu && (
            <UserMenu userSettings={userSettings} userSubmissions={userSubmissions} />
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const TabBar = ({ pages }: { pages: Page[] }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const locationValue =
    location.pathname === "/" ? "/" : location.pathname.replace(/^\//, "");
  const [value, setValue] = useState(locationValue);

  const handleTabChange = (_event: SyntheticEvent, newValue: string) => {
    navigate(newValue);
    setValue(newValue);
  };

  return (
    <Container>
      <Box sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
        <Tabs
          onChange={handleTabChange}
          value={value}
          TabIndicatorProps={{
            style: { height: 2, borderRadius: "2px 2px 0 0" },
          }}
          sx={{
            minHeight: 44,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              minHeight: 44,
              letterSpacing: "0.01em",
            },
          }}
        >
          {pages?.map(
            (page, i) =>
              page.inMenu &&
              page.menuTitle &&
              !page.restricted && (
                <Tab
                  key={i}
                  value={(page.slug || page.link) as string}
                  label={
                    page.icon ? (
                      <Tooltip title={lookupLanguageString(page.menuTitle, i18n.language)}>
                        <page.icon />
                      </Tooltip>
                    ) : (
                      lookupLanguageString(page.menuTitle, i18n.language)
                    )
                  }
                />
              ),
          )}
        </Tabs>
      </Box>
    </Container>
  );
};

const Logo = ({
  logo,
  alt = "Logo",
}: {
  logo: string | ReactElement;
  alt?: string;
}) => {
  if (typeof logo === "string") {
    const isDataUri = logo.startsWith("data:");
    const isImageUrl = /\.(jpeg|jpg|gif|png|svg|webp)(\?.*)?$/i.test(logo);

    if (isDataUri || isImageUrl) {
      return (
        <img
          src={logo}
          alt={alt}
          style={{ height: 40, width: "auto", maxWidth: 100 }}
        />
      );
    }

    return (
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}
      >
        {logo}
      </Typography>
    );
  }

  return logo;
};

export default MenuBar;