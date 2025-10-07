/**
 * Button Styles
 *
 * Reusable button style objects that can be spread onto Button components.
 * Provides consistent styling for primary, secondary, and brand buttons.
 *
 * Usage: <Button {...primaryButtonStyle}>Click me</Button>
 */

import { ButtonProps } from '@chakra-ui/react';
import { SHADOWS, TRANSITIONS } from '@/theme';

export const primaryButtonStyle: Partial<ButtonProps> = {
  bg: 'brand.500',
  color: 'white',
  fontWeight: '600',
  borderRadius: 'lg',
  transition: TRANSITIONS.normal,
  _hover: {
    bg: 'brand.600',
    transform: 'translateY(-2px)',
    boxShadow: SHADOWS.lg,
  },
  _active: {
    transform: 'scale(0.98)',
  },
  _disabled: {
    bg: 'gray.200',
    color: 'gray.400',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
    _hover: {
      bg: 'gray.200',
      transform: 'none',
      boxShadow: 'none',
    },
  },
};

export const secondaryButtonStyle: Partial<ButtonProps> = {
  bg: 'gray.100',
  color: 'gray.700',
  border: '1px',
  borderColor: 'gray.300',
  transition: TRANSITIONS.normal,
  position: 'relative',
  zIndex: 1,
  _hover: {
    bg: 'white',
    borderColor: 'brand.400',
    color: 'brand.600',
    transform: 'translateY(-2px)',
    boxShadow: SHADOWS.hover.secondary,
  },
  _active: {
    transform: 'scale(0.98)',
  },
};

export const brandButtonStyle: Partial<ButtonProps> = {
  bg: 'brand.400',
  color: 'white',
  transition: TRANSITIONS.normal,
  position: 'relative',
  zIndex: 1,
  _hover: {
    bg: 'brand.500',
    transform: 'translateY(-2px)',
    boxShadow: SHADOWS.hover.brand,
  },
  _active: {
    transform: 'scale(0.98)',
  },
};
