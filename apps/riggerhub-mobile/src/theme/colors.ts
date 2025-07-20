export const Colors = {
  // Primary Brand Colors
  primary: {
    50: '#e6f7ff',
    100: '#bae7ff',
    200: '#91d5ff',
    300: '#69c0ff',
    400: '#40a9ff',
    500: '#1890ff', // Main primary
    600: '#096dd9',
    700: '#0050b3',
    800: '#003a8c',
    900: '#002766',
  },
  
  // Secondary Colors (Cyan/Teal)
  secondary: {
    50: '#e6fffb',
    100: '#b5f5ec',
    200: '#87e8de',
    300: '#5cdbd3',
    400: '#36cfc9',
    500: '#13c2c2', // Main secondary
    600: '#08979c',
    700: '#006d75',
    800: '#00474f',
    900: '#002329',
  },
  
  // Success Colors
  success: {
    50: '#f6ffed',
    100: '#d9f7be',
    200: '#b7eb8f',
    300: '#95de64',
    400: '#73d13d',
    500: '#52c41a', // Main success
    600: '#389e0d',
    700: '#237804',
    800: '#135200',
    900: '#092b00',
  },
  
  // Warning Colors
  warning: {
    50: '#fffbe6',
    100: '#fff1b8',
    200: '#ffe58f',
    300: '#ffd666',
    400: '#ffc53d',
    500: '#faad14', // Main warning
    600: '#d48806',
    700: '#ad6800',
    800: '#874d00',
    900: '#613400',
  },
  
  // Error Colors
  error: {
    50: '#fff2f0',
    100: '#ffccc7',
    200: '#ffa39e',
    300: '#ff7875',
    400: '#ff4d4f',
    500: '#f5222d', // Main error
    600: '#cf1322',
    700: '#a8071a',
    800: '#820014',
    900: '#5c0011',
  },
  
  // Neutral/Gray Colors
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#f0f0f0',
    300: '#d9d9d9',
    400: '#bfbfbf',
    500: '#8c8c8c',
    600: '#595959',
    700: '#434343',
    800: '#262626',
    900: '#1f1f1f',
  },
  
  // Background Colors
  background: {
    primary: '#ffffff',
    secondary: '#fafafa',
    tertiary: '#f5f5f5',
    dark: '#1a1a2e',
    darkSecondary: '#16213e',
    card: '#ffffff',
    cardDark: '#2d3748',
  },
  
  // Text Colors
  text: {
    primary: '#262626',
    secondary: '#595959',
    tertiary: '#8c8c8c',
    inverse: '#ffffff',
    link: '#1890ff',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
  },
  
  // Border Colors
  border: {
    light: '#f0f0f0',
    medium: '#d9d9d9',
    dark: '#8c8c8c',
  },
  
  // Construction Industry Specific
  construction: {
    orange: '#ff7f00',
    yellow: '#ffd700',
    helmet: '#ff6b35',
    vest: '#ff4500',
    steel: '#708090',
    concrete: '#a9a9a9',
  },
  
  // Status Colors for Jobs
  status: {
    available: '#52c41a',
    urgent: '#ff4d4f',
    closing: '#faad14',
    filled: '#8c8c8c',
  },
  
  // Experience Level Colors
  experience: {
    entry: '#13c2c2',
    intermediate: '#1890ff',
    experienced: '#722ed1',
    senior: '#eb2f96',
  },
  
  // Shift Colors
  shift: {
    day: '#faad14',
    night: '#531dab',
    rotating: '#1890ff',
    weekend: '#f5222d',
  },
  
  // Transparency Overlays
  overlay: {
    light: 'rgba(255, 255, 255, 0.9)',
    medium: 'rgba(255, 255, 255, 0.7)',
    dark: 'rgba(0, 0, 0, 0.3)',
    darker: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Gradients
  gradients: {
    primary: ['#1890ff', '#40a9ff'],
    secondary: ['#13c2c2', '#36cfc9'],
    success: ['#52c41a', '#73d13d'],
    warning: ['#faad14', '#ffc53d'],
    error: ['#f5222d', '#ff4d4f'],
    construction: ['#ff7f00', '#ffd700'],
    dark: ['#1a1a2e', '#16213e'],
  },
};

export const getThemeColors = (isDark: boolean = false) => ({
  ...Colors,
  background: isDark ? {
    primary: Colors.background.dark,
    secondary: Colors.background.darkSecondary,
    tertiary: Colors.gray[800],
    card: Colors.background.cardDark,
  } : Colors.background,
  text: isDark ? {
    ...Colors.text,
    primary: Colors.text.inverse,
    secondary: Colors.gray[300],
    tertiary: Colors.gray[400],
  } : Colors.text,
});

export default Colors;