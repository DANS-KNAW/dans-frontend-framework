import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { useAuth, hasAuthParams } from "react-oidc-context";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Divider from "@mui/material/Divider";
import { NavLink as RouterLink } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import Tooltip from "@mui/material/Tooltip";
import { LoginButton, LogoutButton } from "./Buttons";

export const UserMenu = ({
  userSettings,
  userSubmissions,
}: {
  userSettings: boolean;
  userSubmissions: boolean;
}) => {
  const auth = useAuth();

  // keep user signed in, and try to sign in automatically
  const [hasTriedSignin, setHasTriedSignin] = useState(false);
  useEffect(() => {
    if (
      !hasAuthParams() &&
      !auth.isAuthenticated &&
      !auth.activeNavigator &&
      !auth.isLoading &&
      !hasTriedSignin
    ) {
      auth.signinSilent();
      setHasTriedSignin(true);
    }
  }, [auth, hasTriedSignin]);

  // if we get an error renewing the token, just sign the user out
  useEffect(() => {
    auth.events.addSilentRenewError(() => {
      console.error("Auth event: silent renew error. Signing user out.");
      auth.removeUser();
    });
  }, [auth.events, auth.removeUser]);

  if (auth.isAuthenticated && auth.user) {
    return (
      <SettingsMenu
        userSettings={userSettings}
        userSubmissions={userSubmissions}
      />
    );
  }
  return <LoginButton />;
};

const SettingsMenu = ({
  userSettings,
  userSubmissions,
}: {
  userSettings: boolean;
  userSubmissions: boolean;
}) => {
  const auth = useAuth();
  const { t } = useTranslation("user");
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      {userSubmissions && (
        <Tooltip title={t("userSubmissions")}>
          <IconButton
            size="large" 
            color="inherit"
            aria-label={t("userSubmissions")}
            component={RouterLink}
            to="/user-submissions"
          >
            <CollectionsBookmarkIcon />
          </IconButton>
        </Tooltip>
      )}
      <IconButton 
        onClick={handleOpenUserMenu} 
        size="large" 
        color="inherit"
        aria-label={t("openUserMenu")}
        aria-controls={Boolean(anchorElUser) ? "menu-appbar" : undefined}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorElUser) ? "true" : undefined}
      >
        <AccountCircle />
      </IconButton>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem 
          sx={{ 
            pl: 2, 
            pr: 2, 
            pb: 1, 
            pt: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            cursor: "default",
            "&:hover": {
              backgroundColor: "transparent",
            }
          }} 
          component="div"
          disableRipple
        >
          <Typography sx={{ fontSize: "80%", fontWeight: 600, mb: 1 }}>
            {t("loggedIn")}
          </Typography>
          <Typography>{auth.user?.profile.name}</Typography>
          <Typography sx={{ fontSize: "90%", color: "neutral.contrastText" }}>
            {auth.user?.profile.email}
          </Typography>
        </MenuItem>
        <Divider />
        {userSettings && (
          <MenuItem
            component={RouterLink}
            to="/user-settings"
            onClick={handleCloseUserMenu}
            >{t("userMenuSettings")}
          </MenuItem>
        )}
        {userSettings && <Divider />}
        <LogoutButton />
      </Menu>
    </Box>
  );
};
