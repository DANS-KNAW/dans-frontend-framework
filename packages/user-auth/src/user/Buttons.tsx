import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import { enqueueSnackbar } from 'notistack';
import { useLocation } from 'react-router-dom';

export const LoginButton = ({variant}: {variant?: 'contained'}) => {
  const { t } = useTranslation('user');
  const auth = useAuth();
  const location  = useLocation();

  return (
    <Button
      variant={variant || "outlined"}
      sx={!variant ? {
        color: 'inherit', 
        borderColor: 'inherit',
        '&:hover': {
          borderColor: 'inherit',
          backgroundColor: 'rgba(255,255,255,0.1)'
        },
      } : {}}
      onClick={
        // set the signin redirect with the current location in state
        () => void auth.signinRedirect({ state: location.pathname })
          .catch(() => enqueueSnackbar('Error redirecting to sign-in server!', {variant: 'error'}))
      }
    >
      {t('login')}
    </Button>
  )
}

export const LogoutButton = () => {
  const { t } = useTranslation('user');
  const auth = useAuth();

  // Remove user
  const logOut = () => {
    void auth.removeUser();
  }

  return (
    <MenuItem onClick={logOut}>
      <Typography>{t('logout')}</Typography>
    </MenuItem>
  );
}