import { createSystem, defaultConfig } from '@chakra-ui/react'

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#f0f7ff' },
          100: { value: '#e6f2ff' },
          200: { value: '#d9ebff' },
          300: { value: '#a8cef7' },
          400: { value: '#5d9fd2' },  // LiGHT Lab light blue
          500: { value: '#2e5fa9' },  // LiGHT Lab dark blue
          600: { value: '#234a87' },
          700: { value: '#1a3766' },
          800: { value: '#122751' },
          900: { value: '#0a1a3d' },
        },
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
  },
})
