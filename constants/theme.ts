/**
 * Global color palette and theme configuration for VoiceBooster
 * Easily customizable purple aesthetic theme with light and dark modes
 */

import { Platform } from 'react-native';

// Main Color Palette - Change these to update the entire app theme
const PALETTE = {
  // Purple shades
  purple50: '#FAF5FF',
  purple100: '#F3E8FF',
  purple200: '#E9D5FF',
  purple300: '#D8B4FE',
  purple400: '#C084FC',
  purple500: '#A855F7',
  purple600: '#9333EA',
  purple700: '#7E22CE',
  purple800: '#6B21A8',
  purple900: '#581C87',
  
  // Accent colors
  pink: '#FF4185',
  pinkLight: '#FF6BA3',
  
  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#E5E5E5',
  gray300: '#D4D4D4',
  gray400: '#A3A3A3',
  gray500: '#737373',
  gray600: '#525252',
  gray700: '#404040',
  gray800: '#262626',
  gray900: '#171717',
  
  // Semantic colors
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export const Colors = {
  light: {
    // Text
    text: PALETTE.gray900,
    textSecondary: PALETTE.gray600,
    textTertiary: PALETTE.gray400,
    
    // Backgrounds
    background: PALETTE.white,
    backgroundSecondary: PALETTE.gray50,
    backgroundTertiary: PALETTE.gray100,
    
    // Primary (Purple theme)
    primary: PALETTE.purple600,
    primaryLight: PALETTE.purple400,
    primaryDark: PALETTE.purple700,
    
    // Accent
    accent: PALETTE.purple500,
    accentLight: PALETTE.purple300,
    
    // UI Elements
    border: PALETTE.gray200,
    borderLight: PALETTE.gray100,
    card: PALETTE.white,
    cardHover: PALETTE.gray50,
    
    // Navigation
    tint: PALETTE.purple600,
    icon: PALETTE.gray500,
    tabIconDefault: PALETTE.gray400,
    tabIconSelected: PALETTE.purple600,
    tabBackground: PALETTE.white,
    
    // Status
    success: PALETTE.success,
    warning: PALETTE.warning,
    error: PALETTE.error,
    info: PALETTE.info,
    
    // Shadows
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowMedium: 'rgba(0, 0, 0, 0.15)',
    shadowHeavy: 'rgba(0, 0, 0, 0.25)',
  },
  dark: {
    // Text
    text: PALETTE.white,
    textSecondary: PALETTE.gray300,
    textTertiary: PALETTE.gray500,
    
    // Backgrounds
    background: PALETTE.black,
    backgroundSecondary: PALETTE.gray900,
    backgroundTertiary: PALETTE.gray800,
    
    // Primary (Purple theme)
    primary: PALETTE.purple500,
    primaryLight: PALETTE.purple400,
    primaryDark: PALETTE.purple600,
    
    // Accent
    accent: PALETTE.purple400,
    accentLight: PALETTE.purple300,
    
    // UI Elements
    border: PALETTE.gray800,
    borderLight: PALETTE.gray700,
    card: PALETTE.gray900,
    cardHover: PALETTE.gray800,
    
    // Navigation
    tint: PALETTE.purple400,
    icon: PALETTE.gray400,
    tabIconDefault: PALETTE.gray500,
    tabIconSelected: PALETTE.purple400,
    tabBackground: PALETTE.gray900,
    
    // Status
    success: PALETTE.success,
    warning: PALETTE.warning,
    error: PALETTE.error,
    info: PALETTE.info,
    
    // Shadows
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowMedium: 'rgba(0, 0, 0, 0.5)',
    shadowHeavy: 'rgba(0, 0, 0, 0.7)',
  },
};

// Spacing system
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Typography
export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 28,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
