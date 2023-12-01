import { useTranslation } from "react-i18next";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useAuth } from "react-oidc-context";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Divider from "@mui/material/Divider";
import { NavLink as RouterLink } from "react-router-dom";
import { LoginButton, LogoutButton } from "./Buttons";

export const UserMenu = ({
  userSettings,
  userSubmissions,
}: {
  userSettings: boolean;
  userSubmissions: boolean;
}) => {
  const auth = useAuth();

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
      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
        <Avatar>
          {((auth.user?.profile.given_name as string) || "")
            .charAt(0)
            .toUpperCase()}
          {((auth.user?.profile.family_name as string) || "")
            .charAt(0)
            .toUpperCase()}
        </Avatar>
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
        <Box sx={{ pl: 2, pr: 2, pb: 1, pt: 1 }}>
          <Typography sx={{ fontSize: "80%", fontWeight: 600, mb: 1 }}>
            {t("loggedIn")}
          </Typography>
          <Typography>{auth.user?.profile.name}</Typography>
          <Typography sx={{ fontSize: "90%", color: "neutral.contrastText" }}>
            {auth.user?.profile.email}
          </Typography>
        </Box>
        <Divider />
        {userSettings && (
          <Link
            component={RouterLink}
            to="/user-settings"
            underline="none"
            color="inherit"
            onClick={handleCloseUserMenu}
          >
            <MenuItem>{t("userMenuSettings")}</MenuItem>
          </Link>
        )}
        {userSubmissions && (
          <Link
            component={RouterLink}
            to="/user-submissions"
            underline="none"
            color="inherit"
            onClick={handleCloseUserMenu}
          >
            <MenuItem divider={true}>{t("userMenuSubmissions")}</MenuItem>
          </Link>
        )}
        <LogoutButton />
      </Menu>
    </Box>
  );
};
