import React, { ReactElement, useState } from "react";
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
import { Typography } from "@mui/material";

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
                          to={(page.slug || page.link) as string}
                          target={page.newTab ? "_blank" : "_self"}
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
              {Logo(logo)}
            </Link>
          </Box>

          {/* desktop menu */}
          <Link
            component={RouterLink}
            to="/"
            sx={{ mr: 2, width: 100, display: { xs: "none", md: "flex" } }}
            style={{
              textDecoration: "none",
              justifyContent: "center",
            }}
          >
            {Logo(logo)}
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
                      to={(page.slug || page.link) as string}
                      target={page.newTab ? "_blank" : "_self"}
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

/**
 * Renders the logo based on the provided input.
 * If the input is a string, it checks if it is a valid image URL and renders an image if true,
 * otherwise renders the input as plain text.
 * If the input is a React element, it renders it directly.
 *
 * @param logo - The logo to be rendered. It can be a string or a React element.
 * @returns The rendered logo.
 */
const Logo = (logo: string | ReactElement) => {
  if (typeof logo === "string") {
    // Regular expression to detect image URLs
    const imagePattern = /\.(jpeg|jpg|gif|png|svg)$/i;
    if (imagePattern.test(logo)) {
      return <img src={logo} alt="Logo" />;
    } else {
      // Render plain text
      return (
        <Typography
          variant="h2"
          style={{
            fontWeight: "bold",
            marginBottom: "0",
          }}
        >
          {logo}
        </Typography>
      );
    }
  }
  // Directly render if it's a React element
  return <>{logo}</>;
};

export default MenuBar;
