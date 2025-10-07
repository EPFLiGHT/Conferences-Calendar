import { Badge } from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/react/tooltip';
import { getSubjectColor } from '../utils/parser';
import { SUBJECT_LABELS } from '../utils/subjects';

interface SubjectBadgeProps {
  subject: string;
}

export default function SubjectBadge({ subject }: SubjectBadgeProps): JSX.Element {
  const colors = getSubjectColor(subject);

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
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
          cursor="help"
        >
          {subject}
        </Badge>
      </Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Content
          fontSize="sm"
          borderRadius="md"
          bg="gray.800"
          color="white"
          px="3"
          py="2"
        >
          <Tooltip.Arrow>
            <Tooltip.ArrowTip />
          </Tooltip.Arrow>
          {SUBJECT_LABELS[subject] || subject}
        </Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  );
}
