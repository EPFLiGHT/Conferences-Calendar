import { Badge, Flex, FlexProps } from '@chakra-ui/react';
import InfoTooltip from './InfoTooltip';
import { getSubjectColor, getSubjectsArray } from '@/utils/parser';
import { SUBJECT_LABELS } from '@/constants/subjects';

interface SubjectBadgeProps extends Omit<FlexProps, 'children'> {
  subjects: string | string[];
}

export default function SubjectBadge({
  subjects,
  gap = '2',
  wrap = 'wrap',
  ...flexProps
}: SubjectBadgeProps): JSX.Element | null {
  const normalizedSubjects = getSubjectsArray(subjects);

  if (normalizedSubjects.length === 0) return null;

  return (
    <Flex gap={gap} wrap={wrap} {...flexProps}>
      {normalizedSubjects.map((subject) => {
        const colors = getSubjectColor(subject);

        return (
          <InfoTooltip key={subject} label={SUBJECT_LABELS[subject] || subject}>
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
          </InfoTooltip>
        );
      })}
    </Flex>
  );
}
