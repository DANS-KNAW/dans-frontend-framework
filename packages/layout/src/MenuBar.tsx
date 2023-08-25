import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { DansLogoWhite } from './images/DansLogo';
import { NavLink as RouterLink } from 'react-router-dom';
import type { Page } from '@dans-framework/pages';
import { lookupLanguageString } from '@dans-framework/utils/language';
import { useTranslation } from 'react-i18next';
import { UserMenu } from '@dans-framework/auth';
import { useAuth } from 'react-oidc-context';

const MenuBar = ({ pages = [] }: { pages: Page[] }) => {
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
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
            {pages && pages.map((page, i) => (page.inMenu && page.menuTitle && ((page.restricted && auth.isAuthenticated) || !page.restricted) &&
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
            ))}
            </Menu>
            <Link component={RouterLink} to="/" sx={{ ml: 2, width: 100, display: { xs: 'flex', md: 'none' } }}>
              <DansLogoWhite/>
            </Link>
          </Box>

          {/* desktop menu */}
          <Link component={RouterLink} to="/" sx={{ mr: 2, width: 100, display: { xs: 'none', md: 'flex' } }}>
            <DansLogoWhite/>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages && pages.map((page, i) => (page.inMenu && page.menuTitle && ((page.restricted && auth.isAuthenticated) || !page.restricted) &&
              <Button
                key={i}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
                component={RouterLink} 
                to={page.slug}
              >
                {lookupLanguageString(page.menuTitle, i18n.language)}
              </Button>
            ))}
          </Box>

          <UserMenu />
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default MenuBar;