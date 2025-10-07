import { Flex, FlexProps } from '@chakra-ui/react';
import SubjectBadge from './SubjectBadge';
import { getSubjectsArray } from '@/utils/parser';

interface SubjectBadgeGroupProps extends Omit<FlexProps, 'children'> {
  subjects: string | string[];
}

export default function SubjectBadgeGroup({
  subjects,
  gap = '2',
  wrap = 'wrap',
  ...flexProps
}: SubjectBadgeGroupProps): JSX.Element | null {
  const normalizedSubjects = getSubjectsArray(subjects);

  if (normalizedSubjects.length === 0) return null;

  return (
    <Flex gap={gap} wrap={wrap} {...flexProps}>
      {normalizedSubjects.map((subject) => (
        <SubjectBadge key={subject} subject={subject} />
      ))}
    </Flex>
  );
}
