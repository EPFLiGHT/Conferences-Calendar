import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

export const system = createSystem(defaultConfig, defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#f0f7ff' },
          100: { value: '#e6f2ff' },
          200: { value: '#d9ebff' },
          300: { value: '#a8cef7' },
          400: { value: '#5d9fd2' },
          500: { value: '#2e5fa9' },
          600: { value: '#234a87' },
          700: { value: '#1a3766' },
          800: { value: '#122751' },
          900: { value: '#0a1a3d' },
        },
      },
      fonts: {
        body: { value: 'Chillax, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif' },
        heading: { value: 'Chillax, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif' },
      },
      animations: {
        'button-transition': { value: 'all 0.2s ease-in-out' },
        'card-transition': { value: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' },
      },
    },
    semanticTokens: {
      colors: {
        primary: { value: '{colors.brand.500}' },
        'primary.solid': { value: '{colors.brand.500}' },
        'primary.contrast': { value: 'white' },
      },
    },
  },
  globalCss: {
    'button, a': {
      transition: 'all 0.2s ease-in-out',
    },
    'button:active': {
      transform: 'scale(0.98)',
    },

    /* FullCalendar Custom Styles */
    '.fc': {
      fontFamily: 'inherit',
    },

    /* Toolbar buttons */
    '.fc .fc-button': {
      background: '{colors.brand.500} !important',
      borderColor: '{colors.brand.500} !important',
      textTransform: 'capitalize',
      fontWeight: '500',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      color: 'white !important',
      outline: 'none !important',
      boxShadow: 'none !important',
    },

    /* Remove hover effects for prev/next buttons */
    '.fc .fc-prev-button:hover, .fc .fc-next-button:hover': {
      background: '{colors.brand.500} !important',
      borderColor: '{colors.brand.500} !important',
      transform: 'none !important',
      boxShadow: 'none !important',
    },

    /* Keep hover effect for other buttons (view switcher) */
    '.fc .fc-button:not(.fc-prev-button):not(.fc-next-button):hover': {
      background: '{colors.brand.600} !important',
      borderColor: '{colors.brand.600} !important',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(46, 94, 168, 0.4) !important',
    },

    '.fc .fc-button:active': {
      transform: 'scale(0.98)',
      boxShadow: 'none !important',
    },

    '.fc .fc-button:focus, .fc .fc-button:focus-visible': {
      outline: 'none !important',
      boxShadow: 'none !important',
      background: '{colors.brand.500} !important',
      borderColor: '{colors.brand.500} !important',
    },

    '.fc .fc-button-active': {
      background: '{colors.brand.600} !important',
      borderColor: '{colors.brand.600} !important',
      boxShadow: 'none !important',
    },

    '.fc .fc-button-active:focus, .fc .fc-button-active:focus-visible': {
      outline: 'none !important',
      boxShadow: 'none !important',
      background: '{colors.brand.600} !important',
      borderColor: '{colors.brand.600} !important',
    },

    '.fc .fc-button:disabled': {
      opacity: '0.4',
      cursor: 'not-allowed',
    },

    /* Title */
    '.fc .fc-toolbar-title': {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '{colors.gray.800}',
    },

    /* Grid borders */
    '.fc-theme-standard td, .fc-theme-standard th': {
      borderColor: '{colors.gray.200}',
    },

    '.fc-theme-standard .fc-scrollgrid': {
      borderColor: '{colors.gray.200}',
    },

    /* Day numbers */
    '.fc .fc-daygrid-day-number': {
      color: '{colors.gray.600}',
      padding: '0.5rem',
      fontSize: '0.9rem',
    },

    '.fc .fc-day-today .fc-daygrid-day-number': {
      background: '{colors.brand.500}',
      color: 'white',
      borderRadius: '50%',
      width: '1.8rem',
      height: '1.8rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    /* Column headers */
    '.fc .fc-col-header-cell-cushion': {
      color: '{colors.gray.500}',
      fontWeight: '600',
      fontSize: '0.875rem',
      padding: '0.75rem',
    },

    '.fc .fc-col-header-cell': {
      background: '{colors.gray.50}',
      borderColor: '{colors.gray.200}',
    },

    /* Today background */
    '.fc .fc-day-today': {
      background: '{colors.brand.50} !important',
    },

    /* Events */
    '.fc .fc-event': {
      cursor: 'pointer',
      borderRadius: '6px',
      padding: '2px 6px',
      fontSize: '0.875rem',
      border: 'none',
      transition: 'all 0.2s ease-in-out',
    },

    '.fc .fc-event:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    },

    '.fc .fc-event-time': {
      display: 'none !important',
    },

    '.fc-timegrid-event .fc-event-time': {
      display: 'block !important',
      fontWeight: '600',
    },

    /* Mobile responsive */
    '@media screen and (max-width: 768px)': {
      '.fc .fc-toolbar': {
        flexDirection: 'column',
        gap: '0.75rem',
        alignItems: 'stretch',
      },

      '.fc .fc-toolbar-chunk': {
        display: 'flex',
        justifyContent: 'center',
      },

      '.fc .fc-toolbar-title': {
        fontSize: '1.25rem',
      },

      '.fc .fc-button': {
        padding: '0.375rem 0.75rem',
        fontSize: '0.875rem',
      },
    } as any,
  },
}))

// ============================================
// CONSTANTS
// ============================================

/**
 * Centralized theme constants for colors, shadows, borders, and transitions.
 * Use these instead of inline values for consistency across the application.
 */

// Colors (as plain values for inline usage)
export const COLORS = {
  brand: {
    50: '#f0f7ff',
    100: '#e6f2ff',
    200: '#d9ebff',
    300: '#a8cef7',
    400: '#5d9fd2',
    500: '#2e5fa9',
    600: '#234a87',
    700: '#1a3766',
    800: '#122751',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
  },
} as const;

// Shadows
export const SHADOWS = {
  sm: '0 1px 3px rgba(46, 95, 169, 0.08)',
  md: '0 2px 8px rgba(46, 95, 169, 0.08)',
  lg: '0 4px 12px rgba(46, 95, 169, 0.3)',
  xl: '0 8px 24px rgba(46, 95, 169, 0.2)',
  hover: {
    secondary: '0 2px 8px rgba(46, 95, 169, 0.15)',
    primary: '0 4px 12px rgba(46, 95, 169, 0.4)',
    brand: '0 4px 12px rgba(93, 159, 210, 0.4)',
  },
} as const;

// Transitions
export const TRANSITIONS = {
  fast: 'all 0.15s ease-in-out',
  normal: 'all 0.2s ease-in-out',
  slow: 'all 0.3s ease-in-out',
} as const;

// RGB values for brand palette (useful for semi-transparent colors)
export const BRAND_RGB = {
  300: '96, 165, 220',
  400: '93, 159, 210',
  500: '46, 95, 169',
  600: '35, 74, 135',
} as const;

export const brandAlpha = (shade: keyof typeof BRAND_RGB, alpha: number) =>
  `rgba(${BRAND_RGB[shade]}, ${alpha})`;

// Gradient tokens
export const GRADIENTS = {
  headerProgress: `linear-gradient(90deg, ${COLORS.brand[600]} 0%, ${COLORS.brand[400]} 50%, ${COLORS.brand[300]} 100%)`,
  footerBackground: `linear-gradient(180deg, #ffffff 0%, ${COLORS.gray[50]} 50%, ${COLORS.gray[100]} 100%)`,
  footerAccent: `linear-gradient(90deg, ${COLORS.brand[400]}, ${COLORS.brand[500]})`,
  footerSurface: `linear-gradient(135deg, ${COLORS.brand[400]} 0%, ${COLORS.brand[500]} 100%)`,
} as const;

// Subject/Tag Colors (for conference categories)
// Re-export SUBJECT_COLORS from unified constants
export { SUBJECT_COLORS } from '@/constants/subjects';
