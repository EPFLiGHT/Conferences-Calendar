import { useMemo } from 'react';
import { Box, Flex, Grid, Text, Button } from '@chakra-ui/react';
import { NativeSelectRoot, NativeSelectField } from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/react/tooltip';
import { Conference } from '@/types/conference';
import { getSubjectColor, getSubjectsArray } from '@/utils/parser';
import { SUBJECT_LABELS } from '@/utils/subjects';
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

        {/* Subject */}
        <Box gridColumn={{ base: '1', md: '1 / -1' }}>
          <Text fontSize="sm" fontWeight="600" color="gray.700" mb="2">
            Subject: {filters.subject && (
              <Text as="span" color={getSubjectColor(filters.subject).color}>
                {filters.subject}
              </Text>
            )}
            {!filters.subject && (
              <Text as="span" color="brand.600">All</Text>
            )}
          </Text>
          <Flex gap="2" wrap="wrap">
            <Button
              size="sm"
              px="4"
              borderRadius="full"
              fontWeight="500"
              bg={filters.subject === '' ? 'brand.500' : 'brand.50'}
              color={filters.subject === '' ? 'white' : 'brand.500'}
              border="1px"
              borderColor={filters.subject === '' ? 'brand.500' : 'brand.200'}
              onClick={() => onFilterChange({ subject: '' })}
              transition="all 0.2s ease-in-out"
              position="relative"
              zIndex="1"
              _hover={{
                bg: filters.subject === '' ? 'brand.600' : 'brand.100',
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
              const isSelected = filters.subject === subject;
              return (
                <Tooltip.Root key={subject}>
                  <Tooltip.Trigger asChild>
                    <Button
                      size="sm"
                      px="4"
                      borderRadius="full"
                      fontWeight="500"
                      bg={isSelected ? colors.color : colors.bg}
                      color={isSelected ? 'white' : colors.color}
                      border="1px"
                      borderColor={isSelected ? colors.color : colors.border}
                      onClick={() => onFilterChange({ subject })}
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
            })}
          </Flex>
        </Box>
      </Grid>
    </Box>
  );
}
