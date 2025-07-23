/**
 * Tiation Rigger Theme Utilities
 * Universal theme management functions for web, mobile, and desktop platforms
 */

import themeConfig from './tiation-rigger-theme.json';

export interface ThemeColor {
  primary: {
    cyan: string;
    magenta: string;
    dark: string;
    darker: string;
  };
  secondary: {
    purple: string;
    blue: string;
    teal: string;
    pink: string;
  };
  accent: {
    neon_green: string;
    neon_orange: string;
    neon_red: string;
    neon_yellow: string;
  };
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    card: string;
    overlay: string;
    glass: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
    accent: string;
  };
  border: {
    primary: string;
    secondary: string;
    accent: string;
    dark: string;
    light: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  mining_industry: {
    safety: string;
    hazard: string;
    approved: string;
    pending: string;
    caution: string;
    restricted: string;
  };
}

export interface Gradient {
  colors: string[];
  angle: number;
  css: string;
}

export interface MobileTypography {
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
  letterSpacing: number;
}

export interface RiggerTheme {
  metadata: any;
  colors: ThemeColor;
  gradients: Record<string, Gradient>;
  shadows: Record<string, string>;
  typography: any;
  spacing: Record<string, string>;
  border_radius: Record<string, string>;
  transitions: Record<string, string>;
  breakpoints: Record<string, string>;
  components: Record<string, any>;
  accessibility: any;
}

// Main theme object
export const riggerTheme: RiggerTheme = themeConfig as RiggerTheme;

/**
 * Get CSS custom properties string from theme
 */
export function generateCSSVariables(): string {
  const { colors, gradients, shadows, typography, spacing, border_radius, transitions } = riggerTheme;
  
  let cssVars = ':root {\n';
  
  // Primary colors
  cssVars += `  /* Primary Brand Colors */\n`;
  cssVars += `  --primary-cyan: ${colors.primary.cyan};\n`;
  cssVars += `  --primary-magenta: ${colors.primary.magenta};\n`;
  cssVars += `  --primary-dark: ${colors.primary.dark};\n`;
  cssVars += `  --primary-darker: ${colors.primary.darker};\n\n`;
  
  // Secondary colors
  cssVars += `  /* Secondary Colors */\n`;
  Object.entries(colors.secondary).forEach(([key, value]) => {
    cssVars += `  --secondary-${key}: ${value};\n`;
  });
  cssVars += '\n';
  
  // Accent colors
  cssVars += `  /* Accent Colors */\n`;
  Object.entries(colors.accent).forEach(([key, value]) => {
    cssVars += `  --accent-${key.replace('_', '-')}: ${value};\n`;
  });
  cssVars += '\n';
  
  // Background colors
  cssVars += `  /* Background Colors */\n`;
  Object.entries(colors.background).forEach(([key, value]) => {
    cssVars += `  --bg-${key}: ${value};\n`;
  });
  cssVars += '\n';
  
  // Text colors
  cssVars += `  /* Text Colors */\n`;
  Object.entries(colors.text).forEach(([key, value]) => {
    cssVars += `  --text-${key}: ${value};\n`;
  });
  cssVars += '\n';
  
  // Border colors
  cssVars += `  /* Border Colors */\n`;
  Object.entries(colors.border).forEach(([key, value]) => {
    cssVars += `  --border-${key}: ${value};\n`;
  });
  cssVars += '\n';
  
  // Status colors
  cssVars += `  /* Status Colors */\n`;
  Object.entries(colors.status).forEach(([key, value]) => {
    cssVars += `  --status-${key}: ${value};\n`;
  });
  cssVars += '\n';
  
  // Mining industry colors
  cssVars += `  /* Mining Industry Colors */\n`;
  Object.entries(colors.mining_industry).forEach(([key, value]) => {
    cssVars += `  --mining-${key.replace('_', '-')}: ${value};\n`;
  });
  cssVars += '\n';
  
  // Gradients
  cssVars += `  /* Gradients */\n`;
  Object.entries(gradients).forEach(([key, value]) => {
    cssVars += `  --gradient-${key.replace('_', '-')}: ${value.css};\n`;
  });
  cssVars += '\n';
  
  // Shadows
  cssVars += `  /* Shadow Effects */\n`;
  Object.entries(shadows).forEach(([key, value]) => {
    cssVars += `  --shadow-${key.replace('_', '-')}: ${value};\n`;
  });
  cssVars += '\n';
  
  // Typography
  cssVars += `  /* Typography */\n`;
  cssVars += `  --font-primary: ${typography.font_families.primary};\n`;
  cssVars += `  --font-monospace: ${typography.font_families.monospace};\n`;
  Object.entries(typography.font_sizes).forEach(([key, value]) => {
    cssVars += `  --font-size-${key}: ${value};\n`;
  });
  cssVars += '\n';
  
  // Spacing
  cssVars += `  /* Spacing */\n`;
  Object.entries(spacing).forEach(([key, value]) => {
    if (typeof value === 'string') {
      cssVars += `  --spacing-${key}: ${value};\n`;
    }
  });
  cssVars += '\n';
  
  // Border radius
  cssVars += `  /* Border Radius */\n`;
  Object.entries(border_radius).forEach(([key, value]) => {
    if (typeof value === 'string') {
      cssVars += `  --radius-${key}: ${value};\n`;
    }
  });
  cssVars += '\n';
  
  // Transitions
  cssVars += `  /* Transitions */\n`;
  Object.entries(transitions).forEach(([key, value]) => {
    if (typeof value === 'string') {
      cssVars += `  --transition-${key}: ${value};\n`;
    }
  });
  
  cssVars += '}\n';
  return cssVars;
}

/**
 * Generate React Native Paper theme object
 */
export function generateReactNativeTheme() {
  const { colors, spacing, typography, border_radius, transitions } = riggerTheme;
  
  return {
    dark: true,
    colors: {
      // Primary brand colors
      primary: colors.primary.cyan,
      secondary: colors.primary.magenta,
      accent: colors.accent.neon_green,
      
      // Background colors
      background: colors.background.primary,
      surface: colors.background.secondary,
      surfaceVariant: colors.background.tertiary,
      
      // Text colors
      onBackground: colors.text.primary,
      onSurface: colors.text.secondary,
      onPrimary: colors.text.inverse,
      onSecondary: colors.text.primary,
      
      // Status colors
      error: colors.status.error,
      warning: colors.status.warning,
      success: colors.status.success,
      info: colors.status.info,
      
      // Interactive elements
      ripple: 'rgba(0, 212, 255, 0.2)',
      disabled: '#666666',
      placeholder: colors.text.muted,
      
      // Border and dividers
      outline: colors.border.dark,
      outlineVariant: colors.border.light,
      
      // Gradient colors
      gradientStart: colors.primary.cyan,
      gradientEnd: colors.primary.magenta,
      gradientMid: colors.secondary.purple,
      
      // Mining industry specific colors
      safety: colors.mining_industry.safety,
      hazard: colors.mining_industry.hazard,
      approved: colors.mining_industry.approved,
      pending: colors.mining_industry.pending,
    },
    
    // Spacing system
    spacing: spacing.mobile_spacing,
    
    // Typography system
    typography: typography.mobile_typography,
    
    // Border radius system
    borderRadius: border_radius.mobile_radius,
    
    // Animation timings
    animation: transitions.mobile_animation,
  };
}

/**
 * Generate gradient definitions for React Native LinearGradient
 */
export function getReactNativeGradients() {
  const { gradients } = riggerTheme;
  
  const rnGradients: Record<string, any> = {};
  
  Object.entries(gradients).forEach(([key, gradient]) => {
    rnGradients[key] = {
      colors: gradient.colors,
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    };
  });
  
  // Add specific status gradients
  rnGradients.status = {
    success: [riggerTheme.colors.status.success, riggerTheme.colors.accent.neon_green],
    warning: [riggerTheme.colors.status.warning, riggerTheme.colors.accent.neon_yellow],
    error: [riggerTheme.colors.status.error, riggerTheme.colors.accent.neon_red],
    info: [riggerTheme.colors.status.info, riggerTheme.colors.secondary.blue],
  };
  
  return rnGradients;
}

/**
 * Get neon text style for React Native
 */
export function getNeonTextStyle(color: string = riggerTheme.colors.primary.cyan) {
  return {
    color,
    textShadowColor: color,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  };
}

/**
 * Generate Jekyll _config.yml theme section
 */
export function generateJekyllThemeConfig(): string {
  const { colors, gradients } = riggerTheme;
  
  return `# Dark neon theme
custom_css: |
  :root {
    --primary-color: ${colors.primary.cyan};
    --secondary-color: ${colors.primary.magenta};
    --background-color: ${colors.background.primary};
    --text-color: ${colors.text.primary};
    --accent-color: ${colors.accent.neon_green};
    --neon-cyan: ${colors.primary.cyan};
    --neon-magenta: ${colors.primary.magenta};
    --neon-blue: ${colors.secondary.blue};
    --text-primary: ${colors.text.primary};
    --text-secondary: ${colors.text.secondary};
    --text-accent: ${colors.text.accent};
    --gradient-primary: ${gradients.primary.css};
    --gradient-secondary: ${gradients.secondary.css};
    --shadow-neon: ${riggerTheme.shadows.neon_glow};
    --shadow-glow: ${riggerTheme.shadows.magenta_glow};
  }
  
  body {
    background: ${colors.background.primary};
    background-image: 
      radial-gradient(circle at 25% 25%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(255, 0, 128, 0.1) 0%, transparent 50%);
    color: ${colors.text.primary};
    line-height: 1.6;
  }`;
}

/**
 * Get color by path (e.g., "primary.cyan")
 */
export function getColor(path: string): string {
  const parts = path.split('.');
  let current: any = riggerTheme.colors;
  
  for (const part of parts) {
    if (current && current[part]) {
      current = current[part];
    } else {
      console.warn(`Color path "${path}" not found in theme`);
      return riggerTheme.colors.primary.cyan; // fallback
    }
  }
  
  return current;
}

/**
 * Get gradient by name
 */
export function getGradient(name: string): Gradient | null {
  return riggerTheme.gradients[name] || null;
}

/**
 * Get gradient style for React Native LinearGradient component
 */
export function getGradientStyle(gradientName: string) {
  const gradient = getGradient(gradientName);
  
  if (!gradient) {
    return {
      colors: [riggerTheme.colors.primary.cyan, riggerTheme.colors.primary.magenta],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    };
  }
  
  return {
    colors: gradient.colors,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  };
}

/**
 * Validate theme structure
 */
export function validateTheme(): boolean {
  const requiredSections = ['colors', 'gradients', 'shadows', 'typography', 'spacing'];
  
  for (const section of requiredSections) {
    if (!(section in riggerTheme)) {
      console.error(`Missing required theme section: ${section}`);
      return false;
    }
  }
  
  return true;
}

/**
 * Export theme for different platforms
 */
export const themeExports = {
  // Raw theme object
  theme: riggerTheme,
  
  // CSS variables
  cssVariables: generateCSSVariables(),
  
  // React Native theme
  reactNativeTheme: generateReactNativeTheme(),
  
  // React Native gradients
  reactNativeGradients: getReactNativeGradients(),
  
  // Jekyll config
  jekyllConfig: generateJekyllThemeConfig(),
  
  // Utility functions
  getColor,
  getGradient,
  getGradientStyle,
  getNeonTextStyle,
  validateTheme,
};

export default themeExports;
