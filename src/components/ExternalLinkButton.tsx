/**
 * ExternalLinkButton Component
 *
 * Reusable button component for external links (Website, Papers, PWC).
 * Wraps a Link and Button with consistent styling and behavior.
 * Supports primary and secondary variants with configurable sizes.
 */

import { Button, Link, ButtonProps } from '@chakra-ui/react';

interface ExternalLinkButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: (e: React.MouseEvent) => void;
  size?: ButtonProps['size'];
  px?: ButtonProps['px'];
}

export default function ExternalLinkButton({
  href,
  children,
  variant = 'primary',
  onClick,
  size = 'sm',
  px = '4'
}: ExternalLinkButtonProps): JSX.Element {
  const isPrimary = variant === 'primary';

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      textDecoration="none"
    >
      <Button
        size={size}
        px={px}
        py="2"
        bg={isPrimary ? 'brand.500' : 'gray.100'}
        color={isPrimary ? 'white' : 'gray.700'}
        borderRadius="md"
        fontSize="sm"
        fontWeight="500"
        border={isPrimary ? 'none' : '1px'}
        borderColor={isPrimary ? 'transparent' : 'gray.300'}
        transition="all 0.2s"
        position="relative"
        zIndex={1}
        _hover={{
          bg: isPrimary ? 'brand.600' : 'white',
          borderColor: isPrimary ? 'brand.600' : 'brand.400',
          color: isPrimary ? 'white' : 'brand.600',
          transform: 'translateY(-1px)',
          boxShadow: isPrimary
            ? '0 4px 12px rgba(46, 95, 169, 0.4)'
            : '0 2px 8px rgba(46, 95, 169, 0.15)',
        }}
        _active={{
          transform: 'scale(0.98)',
        }}
        onClick={onClick}
      >
        {children}
      </Button>
    </Link>
  );
}
