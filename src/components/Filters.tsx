import { useMemo } from 'react';
import { Box, Flex, Grid, Text, Button } from '@chakra-ui/react';
import { NativeSelectRoot, NativeSelectField } from '@chakra-ui/react';
import InfoTooltip from './InfoTooltip';
import { Conference } from '@/types/conference';
import { getSubjectColor, getSubjectsArray } from '@/utils/parser';
import { SUBJECT_LABELS } from '@/constants/subjects';
import type { ConferenceFiltersState } from '@/hooks/useConferenceFilters';

interface FiltersProps {
  conferences: Conference[];
  filters: ConferenceFiltersState;
  onFilterChange: (newFilters: Partial<ConferenceFiltersState>) => void;
}

export default function Filters({ conferences, filters, onFilterChange }: FiltersProps): JSX.Element {
  const years = useMemo(() => {
    const uniqueYears = [...new Set(conferences.map(c => c.year))].sort((a, b) => b - a);
    return uniqueYears;
  }, [conferences]);

  const subjects = useMemo(() => {
    const subjectSet = new Set<string>();
    conferences.forEach(conference => {
      getSubjectsArray(conference.sub).forEach(subject => subjectSet.add(subject));
    });
    return [...subjectSet].sort();
  }, [conferences]);

  const types = ['conference', 'summit', 'workshop'];

  const getTypeColor = (type: string) => {
    const colors = {
      conference: { bg: '#f3e8ff', color: '#9333EA', border: '#d8b4fe' },
      workshop: { bg: '#ccfbf1', color: '#14B8A6', border: '#5eead4' },
      summit: { bg: '#fef3c7', color: '#F59E0B', border: '#fde68a' },
    };
    return colors[type as keyof typeof colors] || colors.conference;
  };

  return (
    <Box>
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
        gap="6"
      >
        {/* Sort By */}
        <Flex direction="column" gap="2">
          <Text fontSize="sm" fontWeight="600" color="gray.700">
            Sort by: <Text as="span" color="brand.600">{
              filters.sortBy === 'deadline' ? 'Upcoming Deadline' :
              filters.sortBy === 'hindex' ? 'H-Index' :
              'Start Date'
            }</Text>
          </Text>
          <NativeSelectRoot>
            <NativeSelectField
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value })}
              borderColor="brand.200"
              borderRadius="lg"
              _focus={{
                borderColor: 'brand.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
              }}
            >
              <option value="deadline">Upcoming Deadline</option>
              <option value="hindex">H-Index</option>
              <option value="start">Start Date</option>
            </NativeSelectField>
          </NativeSelectRoot>
        </Flex>

        {/* Year */}
        <Flex direction="column" gap="2">
          <Text fontSize="sm" fontWeight="600" color="gray.700">
            Year: <Text as="span" color="brand.600">{filters.year || 'All Years'}</Text>
          </Text>
          <NativeSelectRoot>
            <NativeSelectField
              value={filters.year}
              onChange={(e) => onFilterChange({ year: e.target.value })}
              borderColor="brand.200"
              borderRadius="lg"
              _focus={{
                borderColor: 'brand.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
              }}
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </NativeSelectField>
          </NativeSelectRoot>
        </Flex>

        {/* Type */}
        <Box gridColumn={{ base: '1', md: '1 / -1' }}>
          <Text fontSize="sm" fontWeight="600" color="gray.700" mb="2">
            Type: {filters.type.length === 0 && (
              <Text as="span" color="brand.600">All</Text>
            )}
            {filters.type.length > 0 && (
              <Text as="span" color="gray.600">
                {filters.type.map(t => (
                  <Text key={t} as="span" color={getTypeColor(t).color} textTransform="capitalize" mr="1">
                    {t}
                    {filters.type.indexOf(t) < filters.type.length - 1 ? ', ' : ''}
                  </Text>
                ))}
              </Text>
            )}
          </Text>
          <Flex gap="2" wrap="wrap">
            <Button
              size="sm"
              px="4"
              borderRadius="full"
              fontWeight="500"
              bg={filters.type.length === 0 ? 'brand.500' : 'brand.50'}
              color={filters.type.length === 0 ? 'white' : 'brand.500'}
              border="1px"
              borderColor={filters.type.length === 0 ? 'brand.500' : 'brand.200'}
              onClick={() => onFilterChange({ type: [] })}
              transition="all 0.2s ease-in-out"
              position="relative"
              zIndex="1"
              _hover={{
                bg: filters.type.length === 0 ? 'brand.600' : 'brand.100',
                transform: 'translateY(-1px)',
              }}
              _active={{
                transform: 'scale(0.97)',
              }}
            >
              All
            </Button>
            {types.map(type => {
              const colors = getTypeColor(type);
              const isSelected = filters.type.includes(type);
              return (
                <Button
                  key={type}
                  size="sm"
                  px="4"
                  borderRadius="full"
                  fontWeight="500"
                  textTransform="capitalize"
                  bg={isSelected ? colors.color : colors.bg}
                  color={isSelected ? 'white' : colors.color}
                  border="1px"
                  borderColor={isSelected ? colors.color : colors.border}
                  onClick={() => {
                    const newTypes = isSelected
                      ? filters.type.filter(t => t !== type)
                      : [...filters.type, type];
                    onFilterChange({ type: newTypes });
                  }}
                  transition="all 0.2s ease-in-out"
                  position="relative"
                  zIndex="1"
                  _hover={{
                    bg: isSelected ? colors.color : colors.bg,
                    transform: 'translateY(-1px)',
                    opacity: 0.9,
                  }}
                  _active={{
                    transform: 'scale(0.97)',
                  }}
                >
                  {type}
                </Button>
              );
            })}
          </Flex>
        </Box>

        {/* Subject */}
        <Box gridColumn={{ base: '1', md: '1 / -1' }}>
          <Text fontSize="sm" fontWeight="600" color="gray.700" mb="2">
            Subject: {filters.subject.length === 0 && (
              <Text as="span" color="brand.600">All</Text>
            )}
            {filters.subject.length > 0 && (
              <Text as="span" color="gray.600">
                {filters.subject.map(s => (
                  <Text key={s} as="span" color={getSubjectColor(s).color} mr="1">
                    {s}
                    {filters.subject.indexOf(s) < filters.subject.length - 1 ? ', ' : ''}
                  </Text>
                ))}
              </Text>
            )}
          </Text>
          <Flex gap="2" wrap="wrap">
            <Button
              size="sm"
              px="4"
              borderRadius="full"
              fontWeight="500"
              bg={filters.subject.length === 0 ? 'brand.500' : 'brand.50'}
              color={filters.subject.length === 0 ? 'white' : 'brand.500'}
              border="1px"
              borderColor={filters.subject.length === 0 ? 'brand.500' : 'brand.200'}
              onClick={() => onFilterChange({ subject: [] })}
              transition="all 0.2s ease-in-out"
              position="relative"
              zIndex="1"
              _hover={{
                bg: filters.subject.length === 0 ? 'brand.600' : 'brand.100',
                transform: 'translateY(-1px)',
              }}
              _active={{
                transform: 'scale(0.97)',
              }}
            >
              All
            </Button>
            {subjects.map(subject => {
              const colors = getSubjectColor(subject);
              const isSelected = filters.subject.includes(subject);
              return (
                <InfoTooltip key={subject} label={SUBJECT_LABELS[subject] || subject}>
                  <Button
                    size="sm"
                    px="4"
                    borderRadius="full"
                    fontWeight="500"
                    bg={isSelected ? colors.color : colors.bg}
                    color={isSelected ? 'white' : colors.color}
                    border="1px"
                    borderColor={isSelected ? colors.color : colors.border}
                    onClick={() => {
                      const newSubjects = isSelected
                        ? filters.subject.filter(s => s !== subject)
                        : [...filters.subject, subject];
                      onFilterChange({ subject: newSubjects });
                    }}
                    transition="all 0.2s ease-in-out"
                    position="relative"
                    zIndex="1"
                    cursor="help"
                    _hover={{
                      bg: isSelected ? colors.color : colors.bg,
                      transform: 'translateY(-1px)',
                      opacity: 0.9,
                    }}
                    _active={{
                      transform: 'scale(0.97)',
                    }}
                  >
                    {subject}
                  </Button>
                </InfoTooltip>
              );
            })}
          </Flex>
        </Box>
      </Grid>
    </Box>
  );
}
