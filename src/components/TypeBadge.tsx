import { Badge } from '@chakra-ui/react';

const TYPE_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  conference: {
    bg: '#f3e8ff',
    color: '#9333EA',
    border: '#d8b4fe',
  },
  workshop: {
    bg: '#ccfbf1',
    color: '#14B8A6',
    border: '#5eead4',
  },
  summit: {
    bg: '#fef3c7',
    color: '#F59E0B',
    border: '#fde68a',
  },
};

interface TypeBadgeProps {
  type: string;
}

export default function TypeBadge({ type }: TypeBadgeProps): JSX.Element | null {
  if (!type) return null;

  const colors = TYPE_COLORS[type.toLowerCase()] || TYPE_COLORS.conference;

  return (
    <Badge
      px="3"
      py="1"
      borderRadius="full"
      fontSize="xs"
      fontWeight="600"
      bg={colors.bg}
      color={colors.color}
      border="1px"
      borderColor={colors.border}
      whiteSpace="nowrap"
      textTransform="capitalize"
    >
      {type}
    </Badge>
  );
}
