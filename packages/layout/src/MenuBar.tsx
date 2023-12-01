import React, { useState } from "react";
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
import dansLogoWhite from "./images/logo-dans-white.svg";
import { NavLink as RouterLink } from "react-router-dom";
import type { Page } from "@dans-framework/pages";
import { lookupLanguageString } from "@dans-framework/utils";
import { useTranslation } from "react-i18next";
import { UserMenu } from "@dans-framework/user-auth";
import { useAuth } from "react-oidc-context";

const MenuBar = ({
  pages,
  logo = dansLogoWhite,
  userSettings = true,
  userSubmissions = true,
}: {
  pages: Page[];
  logo?: any;
  userSettings?: boolean;
  userSubmissions?: boolean;
}) => {
  const { i18n } = useTranslation();
  const auth = useAuth();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container>
        <Toolbar disableGutters>
          {/* mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages &&
                pages.map(
                  (page, i) =>
                    page.inMenu &&
                    page.menuTitle &&
                    ((page.restricted && auth.isAuthenticated) ||
                      !page.restricted) && (
                      <MenuItem key={i} onClick={handleCloseNavMenu}>
                        <Link
                          underline="none"
                          color="inherit"
                          component={RouterLink}
                          to={page.slug}
                        >
                          {lookupLanguageString(page.menuTitle, i18n.language)}
                        </Link>
                      </MenuItem>
                    ),
                )}
            </Menu>
            <Link
              component={RouterLink}
              to="/"
              sx={{
                ml: 2,
                pt: 1,
                pb: 1,
                width: 100,
                display: { xs: "flex", md: "none" },
              }}
            >
              <img src={logo} />
            </Link>
          </Box>

          {/* desktop menu */}
          <Link
            component={RouterLink}
            to="/"
            sx={{ mr: 2, width: 100, display: { xs: "none", md: "flex" } }}
          >
            <img src={logo} />
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages &&
              pages.map(
                (page, i) =>
                  page.inMenu &&
                  page.menuTitle &&
                  ((page.restricted && auth.isAuthenticated) ||
                    !page.restricted) && (
                    <Button
                      key={i}
                      onClick={handleCloseNavMenu}
                      sx={{ my: 2, display: "block", color: "inherit" }}
                      component={RouterLink}
                      to={page.slug}
                    >
                      {lookupLanguageString(page.menuTitle, i18n.language)}
                    </Button>
                  ),
              )}
          </Box>

          <UserMenu
            userSettings={userSettings}
            userSubmissions={userSubmissions}
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default MenuBar;
