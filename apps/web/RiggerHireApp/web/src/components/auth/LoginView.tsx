import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Card,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Email, Lock } from '@mui/icons-material';

const AuthCard = styled(Card)(({ theme }) => ({
  background: 'rgba(26, 26, 26, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 255, 255, 0.1)',
  padding: theme.spacing(4),
  maxWidth: 400,
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #00ffff, #ff00ff)',
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    '& fieldset': {
      borderColor: 'rgba(0, 255, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
  color: '#000',
  padding: '12px',
  fontSize: '1.1rem',
  fontWeight: 600,
  marginTop: theme.spacing(2),
  '&:hover': {
    background: 'linear-gradient(45deg, #5fffff, #ff5fff)',
  },
  '&.Mui-disabled': {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.3)',
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.primary.light,
    textDecoration: 'none',
  },
}));

interface LoginViewProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onForgotPassword: () => void;
  onRegister: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  onForgotPassword,
  onRegister,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      px={2}
    >
      <AuthCard>
        <LogoText variant="h1">RiggerHire</LogoText>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <StyledTextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: <Email sx={{ mr: 1 }} />,
            }}
            disabled={loading}
          />

          <StyledTextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1 }} />,
            }}
            disabled={loading}
          />

          <LoginButton
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </LoginButton>
        </form>

        <Box mt={2} display="flex" justifyContent="space-between">
          <StyledLink
            component="button"
            variant="body2"
            onClick={onForgotPassword}
          >
            Forgot Password?
          </StyledLink>
          <StyledLink
            component="button"
            variant="body2"
            onClick={onRegister}
          >
            Create Account
          </StyledLink>
        </Box>
      </AuthCard>
    </Box>
  );
};

export default LoginView;
