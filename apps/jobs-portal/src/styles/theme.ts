export const theme = {
  colors: {
    primary: {
      neon: '#00ffff',
      gradient: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)',
      hover: '#33ffff',
    },
    secondary: {
      neon: '#ff00ff',
      hover: '#ff33ff',
    },
    background: {
      dark: '#0a0a0a',
      card: '#1a1a1a',
      hover: '#2a2a2a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a0a0a0',
      muted: '#666666',
    },
    border: {
      neon: '#00ffff33',
      dark: '#333333',
    },
  },
  spacing: {
    touch: '44px', // Minimum touch target size
  },
  animation: {
    hover: 'all 0.3s ease-in-out',
  },
  shadows: {
    neon: '0 0 10px #00ffff, 0 0 20px #00ffff33',
    card: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
}
