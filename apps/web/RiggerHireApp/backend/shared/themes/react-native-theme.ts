import { DefaultTheme } from 'react-native-paper';
import { riggerTheme } from './theme-utils';

// Standardized Dark Neon Theme with Cyan/Magenta Gradients for React Native
export const darkNeonTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    // Primary brand colors - standardized values
    primary: riggerTheme.colors.primary.cyan, // #00D4FF
    secondary: riggerTheme.colors.primary.magenta, // #FF0080
    accent: riggerTheme.colors.accent.neon_green, // #00FF88
    
    // Background colors - standardized
    background: riggerTheme.colors.background.primary, // #0A0A0A
    surface: riggerTheme.colors.background.secondary, // #1A1A1A
    surfaceVariant: riggerTheme.colors.background.tertiary, // #2A2A2A
    
    // Text colors - standardized
    onBackground: riggerTheme.colors.text.primary, // #FFFFFF
    onSurface: riggerTheme.colors.text.secondary, // #CCCCCC
    onPrimary: riggerTheme.colors.text.inverse, // #0A0A0A
    onSecondary: riggerTheme.colors.text.primary, // #FFFFFF
    
    // Status colors - standardized
    error: riggerTheme.colors.status.error, // #FF3366
    warning: riggerTheme.colors.status.warning, // #FFAA00
    success: riggerTheme.colors.status.success, // #00FF88
    info: riggerTheme.colors.status.info, // #0088FF
    
    // Interactive elements
    ripple: 'rgba(0, 212, 255, 0.2)', // Cyan ripple
    disabled: '#666666', // Muted gray
    placeholder: riggerTheme.colors.text.muted, // #999999
    
    // Border and dividers - standardized
    outline: riggerTheme.colors.border.dark, // #333333
    outlineVariant: riggerTheme.colors.border.light, // #444444
    
    // Gradient colors - standardized
    gradientStart: riggerTheme.colors.primary.cyan, // #00D4FF
    gradientEnd: riggerTheme.colors.primary.magenta, // #FF0080
    gradientMid: riggerTheme.colors.secondary.purple, // #8000FF
    
    // Mining industry specific colors - standardized
    safety: riggerTheme.colors.mining_industry.safety, // #FFD700
    hazard: riggerTheme.colors.mining_industry.hazard, // #FF4500
    approved: riggerTheme.colors.mining_industry.approved, // #00FF7F
    pending: riggerTheme.colors.mining_industry.pending, // #FFA500
    caution: riggerTheme.colors.mining_industry.caution, // #FFFF00
    restricted: riggerTheme.colors.mining_industry.restricted, // #DC143C
  },
  
  // Standardized spacing system
  spacing: riggerTheme.spacing.mobile_spacing,
  
  // Standardized typography system
  typography: riggerTheme.typography.mobile_typography,
  
  // Standardized border radius system
  borderRadius: riggerTheme.border_radius.mobile_radius,
  
  // Shadow system for elevation - using standardized values
  shadows: {
    neonGlow: {
      shadowColor: riggerTheme.colors.primary.cyan,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
      elevation: 10,
    },
    magentaGlow: {
      shadowColor: riggerTheme.colors.primary.magenta,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 8,
    },
    softGlow: {
      shadowColor: riggerTheme.colors.text.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    cardShadow: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.5,
      shadowRadius: 15,
      elevation: 15,
    },
  },
  
  // Standardized animation timings
  animation: riggerTheme.transitions.mobile_animation,
};

// Standardized gradient definitions for use with LinearGradient
export const gradients = {
  // Primary gradients - standardized
  primary: riggerTheme.gradients.primary.colors, // ['#00D4FF', '#FF0080']
  secondary: riggerTheme.gradients.secondary.colors, // Translucent version
  accent: [riggerTheme.colors.accent.neon_green, riggerTheme.colors.primary.cyan], // ['#00FF88', '#00D4FF']
  
  // Background gradients - standardized
  background: riggerTheme.gradients.background.colors, // ['#0A0A0A', '#1A0A1A', '#0A1A1A']
  button: riggerTheme.gradients.button.colors, // ['#00D4FF', '#0088FF']
  card: riggerTheme.gradients.card.colors, // ['#1A1A1A', '#2A2A2A']
  
  // Status gradients - using standardized colors
  status: {
    success: [riggerTheme.colors.status.success, riggerTheme.colors.accent.neon_green],
    warning: [riggerTheme.colors.status.warning, riggerTheme.colors.accent.neon_yellow],
    error: [riggerTheme.colors.status.error, riggerTheme.colors.accent.neon_red],
    info: [riggerTheme.colors.status.info, riggerTheme.colors.secondary.blue],
  },
  
  // Mining industry gradients
  mining: {
    safety: [riggerTheme.colors.mining_industry.safety, riggerTheme.colors.accent.neon_yellow],
    hazard: [riggerTheme.colors.mining_industry.hazard, riggerTheme.colors.accent.neon_red],
    approved: [riggerTheme.colors.mining_industry.approved, riggerTheme.colors.accent.neon_green],
    pending: [riggerTheme.colors.mining_industry.pending, riggerTheme.colors.accent.neon_yellow],
  },
};

// Theme utilities for React Native
export const getGradientStyle = (gradientName: keyof typeof gradients) => ({
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

// Standardized component styles for React Native
export const componentStyles = {
  button: {
    borderRadius: darkNeonTheme.borderRadius.md,
    paddingVertical: darkNeonTheme.spacing.md,
    paddingHorizontal: darkNeonTheme.spacing.lg,
  },
  
  card: {
    backgroundColor: darkNeonTheme.colors.surface,
    borderRadius: darkNeonTheme.borderRadius.xl,
    padding: darkNeonTheme.spacing.lg,
    ...darkNeonTheme.shadows.cardShadow,
  },
  
  input: {
    backgroundColor: darkNeonTheme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: darkNeonTheme.colors.outline,
    borderRadius: darkNeonTheme.borderRadius.md,
    padding: darkNeonTheme.spacing.md,
    color: darkNeonTheme.colors.onSurface,
  },
  
  safetyBadge: {
    backgroundColor: darkNeonTheme.colors.safety,
    borderRadius: darkNeonTheme.borderRadius.full,
    paddingVertical: darkNeonTheme.spacing.xs,
    paddingHorizontal: darkNeonTheme.spacing.sm,
  },
  
  hazardBadge: {
    backgroundColor: darkNeonTheme.colors.hazard,
    borderRadius: darkNeonTheme.borderRadius.full,
    paddingVertical: darkNeonTheme.spacing.xs,
    paddingHorizontal: darkNeonTheme.spacing.sm,
  },
};

export default darkNeonTheme;
