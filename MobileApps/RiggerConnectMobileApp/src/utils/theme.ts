import { DefaultTheme } from 'react-native-paper';

// Dark Neon Theme with Cyan/Magenta Gradients
export const darkNeonTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    // Primary brand colors
    primary: '#00FFFF', // Cyan
    secondary: '#FF00FF', // Magenta
    accent: '#00FF00', // Neon Green
    
    // Background colors
    background: '#0A0A0A', // Deep black
    surface: '#1A1A1A', // Dark surface
    surfaceVariant: '#2A2A2A', // Lighter surface
    
    // Text colors
    onBackground: '#FFFFFF', // White text on dark
    onSurface: '#E0E0E0', // Light gray text
    onPrimary: '#000000', // Black text on cyan
    onSecondary: '#FFFFFF', // White text on magenta
    
    // Status colors
    error: '#FF3366', // Neon red
    warning: '#FFAA00', // Neon orange
    success: '#00FF88', // Neon green
    info: '#0088FF', // Neon blue
    
    // Interactive elements
    ripple: 'rgba(0, 255, 255, 0.2)', // Cyan ripple
    disabled: '#666666', // Muted gray
    placeholder: '#888888', // Placeholder text
    
    // Border and dividers
    outline: '#333333', // Dark borders
    outlineVariant: '#444444', // Lighter borders
    
    // Gradient colors
    gradientStart: '#00FFFF', // Cyan
    gradientEnd: '#FF00FF', // Magenta
    gradientMid: '#8000FF', // Purple blend
    
    // Mining industry specific colors
    safety: '#FFD700', // Gold for safety alerts
    hazard: '#FF4500', // Orange red for hazards
    approved: '#00FF7F', // Spring green for approvals
    pending: '#FFA500', // Orange for pending status
  },
  
  // Spacing system
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Typography system
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold' as const,
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 28,
      fontWeight: 'bold' as const,
      lineHeight: 36,
      letterSpacing: -0.25,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
      letterSpacing: 0,
    },
    h4: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
      letterSpacing: 0.25,
    },
    body1: {
      fontSize: 16,
      fontWeight: 'normal' as const,
      lineHeight: 24,
      letterSpacing: 0.5,
    },
    body2: {
      fontSize: 14,
      fontWeight: 'normal' as const,
      lineHeight: 20,
      letterSpacing: 0.25,
    },
    caption: {
      fontSize: 12,
      fontWeight: 'normal' as const,
      lineHeight: 16,
      letterSpacing: 0.4,
    },
  },
  
  // Border radius system
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
  },
  
  // Shadow system for elevation
  shadows: {
    neonGlow: {
      shadowColor: '#00FFFF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
      elevation: 10,
    },
    magentalow: {
      shadowColor: '#FF00FF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 8,
    },
    softGlow: {
      shadowColor: '#FFFFFF',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
  },
  
  // Animation timings
  animation: {
    scale: 200,
    fade: 300,
    slide: 250,
    bounce: 400,
  },
};

// Gradient definitions for use with LinearGradient
export const gradients = {
  primary: ['#00FFFF', '#FF00FF'], // Cyan to Magenta
  secondary: ['#FF00FF', '#8000FF'], // Magenta to Purple
  accent: ['#00FF00', '#00FFFF'], // Green to Cyan
  background: ['#0A0A0A', '#1A1A1A'], // Deep black gradient
  button: ['#00FFFF', '#0088FF'], // Cyan to blue
  card: ['#1A1A1A', '#2A2A2A'], // Dark surface gradient
  status: {
    success: ['#00FF88', '#00FFAA'],
    warning: ['#FFAA00', '#FFD700'],
    error: ['#FF3366', '#FF6699'],
    info: ['#0088FF', '#00AAFF'],
  },
};

// Theme utilities
export const getGradientStyle = (gradientName: keyof typeof gradients) => ({
  flex: 1,
  colors: gradients[gradientName] as string[],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
});

export const getNeonTextStyle = (color: string = darkNeonTheme.colors.primary) => ({
  color,
  textShadowColor: color,
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 8,
});

export default darkNeonTheme;
