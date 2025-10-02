import { useState, useMemo } from 'react';
import { DateTime } from 'luxon';
import { Box, Container, Heading, Text, Grid } from '@chakra-ui/react';
import ConferenceCard from '../components/ConferenceCard';
import ConferenceModal from '../components/ConferenceModal';
import Filters from '../components/Filters';
import Search from '../components/Search';
import { getNextDeadline } from '../utils/parser';

export default function Home({ conferences }) {
  const [selectedConference, setSelectedConference] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    sortBy: 'deadline',
    year: '',
    subject: '',
  });

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const filteredAndSortedConferences = useMemo(() => {
    let result = [...conferences];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(conf =>
        conf.title.toLowerCase().includes(query) ||
        conf.full_name.toLowerCase().includes(query)
      );
    }

    // Filter by year
    if (filters.year) {
      result = result.filter(conf => conf.year === parseInt(filters.year));
    }

    // Filter by subject
    if (filters.subject) {
      result = result.filter(conf => conf.sub === filters.subject);
    }

    // Sort
    result.sort((a, b) => {
      if (filters.sortBy === 'deadline') {
        const aNext = getNextDeadline(a);
        const bNext = getNextDeadline(b);

        // Conferences with upcoming deadlines first
        if (!aNext && !bNext) return 0;
        if (!aNext) return 1;
        if (!bNext) return -1;

        return aNext.datetime.toMillis() - bNext.datetime.toMillis();
      } else if (filters.sortBy === 'hindex') {
        return (b.hindex || 0) - (a.hindex || 0);
      } else if (filters.sortBy === 'start') {
        const aStart = a.start ? DateTime.fromISO(a.start) : DateTime.fromMillis(0);
        const bStart = b.start ? DateTime.fromISO(b.start) : DateTime.fromMillis(0);
        return bStart.toMillis() - aStart.toMillis();
      }
      return 0;
    });

    return result;
  }, [conferences, searchQuery, filters]);

  return (
    <Box py={{ base: '6', md: '8' }} pb={{ base: '12', md: '16' }} minH="calc(100vh - 200px)">
      <Container maxW="1200px" px={{ base: '4', md: '6' }} mx="auto">
        <Box mb="8" textAlign="center">
          <Heading as="h2" size="2xl" mb="2" color="gray.800">
            Research Conferences
          </Heading>
          <Text fontSize="md" color="gray.600">
            Track upcoming conferences and never miss a deadline. Click on a card for more details.
          </Text>
        </Box>

        <Search value={searchQuery} onChange={setSearchQuery} />

        <Filters
          conferences={conferences}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <Text fontSize="sm" color="gray.600" mb="6" textAlign="center">
          Showing {filteredAndSortedConferences.length} of {conferences.length} conferences
        </Text>

        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(auto-fill, minmax(350px, 1fr))' }}
          gap={{ base: '4', md: '6' }}
        >
          {filteredAndSortedConferences.length === 0 ? (
            <Box gridColumn="1 / -1" textAlign="center" py="16" px="8">
              <Text fontSize="lg" color="gray.500">
                No conferences found matching your criteria.
              </Text>
            </Box>
          ) : (
            filteredAndSortedConferences.map(conference => (
              <ConferenceCard
                key={conference.id}
                conference={conference}
                onClick={() => setSelectedConference(conference)}
              />
            ))
          )}
        </Grid>
      </Container>

      {selectedConference && (
        <ConferenceModal
          conference={selectedConference}
          onClose={() => setSelectedConference(null)}
        />
      )}
    </Box>
  );
}
