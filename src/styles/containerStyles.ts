/**
 * Container Styles
 *
 * Reusable container/box style objects for consistent card layouts.
 * These styles define the white card containers used throughout the app.
 *
 * Usage: <Box {...whiteCardStyle}>Content</Box>
 */

import { BoxProps } from '@chakra-ui/react';
import { SHADOWS } from '@/theme';

export const whiteCardStyle: Partial<BoxProps> = {
  bg: 'white',
  borderRadius: 'xl',
  border: '1px',
  borderColor: 'brand.200',
  boxShadow: SHADOWS.md,
};

export const paginationContainerStyle: Partial<BoxProps> = {
  ...whiteCardStyle,
  p: '6',
};
