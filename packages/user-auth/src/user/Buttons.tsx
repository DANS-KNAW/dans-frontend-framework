import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import { enqueueSnackbar } from 'notistack';

export const LoginButton = ({variant}: {variant?: 'contained'}) => {
  const { t } = useTranslation('user');
  const auth = useAuth();

  return (
    <Button
      variant={variant || "outlined"}
      sx={!variant ? {
        color: '#fff', 
        borderColor: '#fff',
        '&:hover': {
          borderColor: '#fff',
          backgroundColor: 'rgba(255,255,255,0.1)'
        },
      } : {}}
      onClick={
        () => void auth.signinRedirect()
          .catch(e => enqueueSnackbar('Error redirecting to sign-in server!', {variant: 'error'}))
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