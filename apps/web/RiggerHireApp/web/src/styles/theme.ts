import { createTheme } from '@mui/material/styles';

export const darkNeonTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ffff', // Cyan
      light: '#5fffff',
      dark: '#00cccc',
      contrastText: '#000000',
    },
    secondary: {
      main: '#ff00ff', // Magenta
      light: '#ff5fff',
      dark: '#cc00cc',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    error: {
      main: '#ff3d00',
    },
    success: {
      main: '#00ff9f',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Inter", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
          '&:hover': {
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
          color: '#000000',
          '&:hover': {
            background: 'linear-gradient(45deg, #5fffff, #ff5fff)',
          },
        },
        outlined: {
          borderColor: '#00ffff',
          color: '#00ffff',
          '&:hover': {
            borderColor: '#5fffff',
            color: '#5fffff',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(26, 26, 26, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 255, 255, 0.1)',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)',
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 255, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 255, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00ffff',
            },
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});
