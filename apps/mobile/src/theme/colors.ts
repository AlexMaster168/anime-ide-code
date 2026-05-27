// apps/mobile/src/theme/index.ts — Anime IDE Code design tokens for RN
// Drop-in extension of the original apps/mobile/src/theme/colors.ts.
// Use with React Native StyleSheet:
//   import { theme } from '@/theme';
//   <Text style={{ color: theme.colors.text, fontSize: theme.type.body }} />
//
// Project: AlexMaster168/anime-ide-code (Expo + React Native).

// ---- Colors ---------------------------------------------------------------

export const colors = {
  // Surfaces
  bg: '#0E0F13',
  bgElevated: '#16181F',
  bgCard: '#1B1E27',
  border: '#262A36',

  // Ink
  text: '#F2F3F7',
  textDim: '#9AA0B0',
  textMuted: '#5B6275',

  // Brand + semantic
  accent: '#7C5CFF',
  accentDim: '#5B45C2',
  danger: '#FF5C7A',
  ok: '#4ADE80',
  warn: '#F5B642',

  // Overlays — pass as rgba() helpers; RN doesn't support rgba(var()) tricks
  scrim: 'rgba(0,0,0,0.60)',
  scrimSoft: 'rgba(0,0,0,0.70)',
  accentSoft: 'rgba(124,92,255,0.25)',
  accentVeil: 'rgba(124,92,255,0.40)',
  dangerSoft: 'rgba(255,92,122,0.10)',
  warnSoft: 'rgba(245,182,66,0.10)',
} as const;

export type ColorToken = keyof typeof colors;

// ---- Typography -----------------------------------------------------------
// React Native does NOT support the CSS system-ui keyword; you express this
// as fontFamily: undefined to inherit the platform default, or pick the SF
// Pro / Roboto branch yourself with Platform.select.

import { Platform } from 'react-native';

export const fontFamily = {
  sans: Platform.select({ ios: 'System', android: 'Roboto', default: undefined }),
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
} as const;

export const type = {
  // sizes — match Tailwind text-* in apps/web
  xs: 11,        // tiny meta, franchise sort chip
  '2xs': 12,     // genre chips, badges
  sm: 13,        // CodeMirror body / mono-friendly small body
  body: 14,      // default UI body (text-sm in web)
  base: 15,      // long-form description (leading-relaxed)
  lg: 18,        // franchise row title
  xl: 20,        // section header
  '2xl': 24,     // page H1 (sm)
  '3xl': 30,     // page H1 (lg, web only)
  '6xl': 60,     // empty-state glyph

  // weights — RN uses string values
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // line-height multipliers — apply as `size * lineHeight.snug`
  lineHeight: {
    tight: 1.15,
    snug: 1.30,
    relaxed: 1.625,
  },

  // tracking — for the uppercase eyebrow label
  trackingWider: 0.6, // RN letterSpacing is in points, ~0.05em of a 12px char
} as const;

// ---- Spacing --------------------------------------------------------------
// Mirrors Tailwind 4 px values used in the web app.
export const spacing = {
  px: 1,
  '0.5': 2,
  '1': 4,
  '1.5': 6,
  '2': 8,
  '2.5': 10,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '8': 32,
  '10': 40,
  '12': 48,
  '16': 64,
} as const;

// ---- Radii ----------------------------------------------------------------
export const radii = {
  sm: 6,    // small badge
  md: 8,    // nav pill, language chip
  lg: 10,   // episode square, year input
  xl: 12,   // card, poster, input, code panel  ← workhorse
  '2xl': 16,// hero poster, run button, error panel
  full: 9999,
} as const;

// ---- Elevation / shadow ---------------------------------------------------
// Two shadows in active use. RN expresses these per-platform.
export const shadow = {
  poster: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 25 },
      shadowOpacity: 0.5,
      shadowRadius: 50,
    },
    android: { elevation: 12 },
    default: {},
  }),

  // The accent ring (currently-playing franchise card) is implemented in RN
  // as a 2px accent border + a faintly tinted bg, not as a shadow.
  accentRing: {
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
} as const;

// ---- Motion ---------------------------------------------------------------
// RN Animated uses durations in ms; for color transitions on web we use
// 150ms. On RN we instead toggle opacity on press (0.7).
export const motion = {
  durFast: 150,
  durNormal: 200,
  durSlow: 300,

  // Pressable press-state — apply via { opacity: pressed ? 0.7 : 1 }
  pressedOpacity: 0.7,
} as const;

// ---- Default export — everything in one bag ------------------------------
export const theme = {
  colors,
  fontFamily,
  type,
  spacing,
  radii,
  shadow,
  motion,
} as const;

export type Theme = typeof theme;
export default theme;
