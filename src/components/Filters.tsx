import { useMemo } from 'react';
import { Box, Flex, Grid, Text, Button } from '@chakra-ui/react';
import { NativeSelectRoot, NativeSelectField } from '@chakra-ui/react';
import { Conference } from '../types/conference';

interface FiltersProps {
  conferences: Conference[];
  filters: {
    sortBy: string;
    year: string;
    subject: string;
  };
  onFilterChange: (newFilters: { sortBy?: string; year?: string; subject?: string }) => void;
}

export default function Filters({ conferences, filters, onFilterChange }: FiltersProps): JSX.Element {
  const years = useMemo(() => {
    const uniqueYears = [...new Set(conferences.map(c => c.year))].sort((a, b) => b - a);
    return uniqueYears;
  }, [conferences]);

  const subjects = useMemo(() => {
    const subjectSet = new Set<string>();
    conferences.forEach(c => {
      if (Array.isArray(c.sub)) {
        c.sub.forEach(s => subjectSet.add(s));
      } else if (c.sub) {
        subjectSet.add(c.sub);
      }
    });
    return [...subjectSet].sort();
  }, [conferences]);

  return (
    <Box
      p="6"
      bg="white"
      borderRadius="xl"
      border="1px"
      borderColor="brand.200"
      mb="8"
    >
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
        gap="6"
      >
        {/* Sort By */}
        <Flex direction="column" gap="2">
          <Text fontSize="sm" fontWeight="600" color="gray.700">
            Sort by:
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
            Year:
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
            Subject:
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
            {subjects.map(subject => (
              <Button
                key={subject}
                size="sm"
                px="4"
                borderRadius="full"
                fontWeight="500"
                bg={filters.subject === subject ? 'brand.500' : 'brand.50'}
                color={filters.subject === subject ? 'white' : 'brand.500'}
                border="1px"
                borderColor={filters.subject === subject ? 'brand.500' : 'brand.200'}
                onClick={() => onFilterChange({ subject })}
                transition="all 0.2s ease-in-out"
                position="relative"
                zIndex="1"
                _hover={{
                  bg: filters.subject === subject ? 'brand.600' : 'brand.100',
                  transform: 'translateY(-1px)',
                }}
                _active={{
                  transform: 'scale(0.97)',
                }}
              >
                {subject}
              </Button>
            ))}
          </Flex>
        </Box>
      </Grid>
    </Box>
  );
}
