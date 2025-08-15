import { CircularProgress, Stack } from '@mui/material';
import { useEffect } from 'react';
import { useAuth } from '../contexts/auth.context';
import { useNavigate } from 'react-router-dom';
import { Paths } from '../constants/paths';

export const AuthCallbackPage = () => {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      navigate(Paths.ADMIN, { replace: true });
    }
  }, [token]);

  return (
    <Stack
      spacing={4}
      sx={{
        mt: 10,
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CircularProgress size={64} />
    </Stack>
  );
};