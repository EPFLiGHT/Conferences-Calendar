'use client';

import { useState, useEffect, useMemo } from 'react';
import { DateTime } from 'luxon';
import { Box, Container, Heading, Text, Grid, Button, Flex, Center } from '@chakra-ui/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConferenceCard from '@/components/ConferenceCard';
import ConferenceModal from '@/components/ConferenceModal';
import Filters from '@/components/Filters';
import Search from '@/components/Search';
import { parseConferences, getNextDeadline } from '@/utils/parser';
import type { Conference } from '@/types/conference';

const ITEMS_PER_PAGE = 12;

export default function Page() {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    sortBy: 'deadline',
    year: '',
    subject: '',
  });

  useEffect(() => {
    const basePath = process.env.NODE_ENV === 'production' ? '/Conferences-Calendar' : '';
    fetch(`${basePath}/data/conferences.yaml`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch conferences data');
        }
        return response.text();
      })
      .then((yamlText) => {
        const parsed = parseConferences(yamlText);
        setConferences(parsed);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const scrollToTop = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  };

  const handleFilterChange = (newFilters: { sortBy?: string; year?: string; subject?: string }) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const filteredAndSortedConferences = useMemo(() => {
    setCurrentPage(1);
    let result = [...conferences];

    if (searchQuery) {
      const query = searchQuery.toLowerCase().replace(/\s+/g, '');
      result = result.filter(conf => {
        const searchableText = `${conf.title}${conf.year}${conf.full_name}`.toLowerCase().replace(/\s+/g, '');
        return searchableText.includes(query);
      });
    }

    if (filters.year) {
      result = result.filter(conf => conf.year === parseInt(filters.year));
    }

    if (filters.subject) {
      result = result.filter(conf => {
        if (Array.isArray(conf.sub)) {
          return conf.sub.includes(filters.subject);
        }
        return conf.sub === filters.subject;
      });
    }

    result.sort((a, b) => {
      if (filters.sortBy === 'deadline') {
        const aNext = getNextDeadline(a);
        const bNext = getNextDeadline(b);
        const now = DateTime.now();

        const aIsActive = aNext && aNext.localDatetime > now;
        const bIsActive = bNext && bNext.localDatetime > now;

        if (aIsActive && !bIsActive) return -1;
        if (!aIsActive && bIsActive) return 1;

        if (aIsActive && bIsActive) {
          return aNext.datetime.toMillis() - bNext.datetime.toMillis();
        }

        if (!aIsActive && !bIsActive) {
          if (!aNext && !bNext) return 0;
          if (!aNext) return 1;
          if (!bNext) return -1;
          return bNext.datetime.toMillis() - aNext.datetime.toMillis();
        }

        return 0;
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

  const paginatedConferences = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedConferences.slice(startIndex, endIndex);
  }, [filteredAndSortedConferences, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedConferences.length / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <Center minH="100vh">
        <Text fontSize="lg" color="gray.600">
          Loading conferences...
        </Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="100vh" p="8">
        <Box textAlign="center">
          <Heading as="h2" size="lg" mb="4" color="gray.800">
            Error Loading Data
          </Heading>
          <Text color="gray.600">{error}</Text>
        </Box>
      </Center>
    );
  }

  return (
    <>
      <Header />
      <Box py={{ base: '6', md: '8' }} pb={{ base: '12', md: '16' }} minH="calc(100vh - 200px)">
        <Container maxW="1200px" px={{ base: '4', md: '6' }} mx="auto">
          <Box
            bg="white"
            borderRadius="xl"
            border="1px"
            borderColor="brand.200"
            p={{ base: '6', md: '8' }}
            mb="8"
            boxShadow="0 2px 8px rgba(46, 95, 169, 0.08)"
          >
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
          </Box>

          <Text fontSize="sm" color="gray.600" mb="6" textAlign="center">
            Showing {paginatedConferences.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedConferences.length)} of {filteredAndSortedConferences.length} conferences
          </Text>

          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(auto-fill, minmax(350px, 1fr))' }}
            gap={{ base: '4', md: '6' }}
            mb="8"
          >
            {paginatedConferences.length === 0 ? (
              <Box gridColumn="1 / -1" textAlign="center" py="16" px="8">
                <Text fontSize="lg" color="gray.500">
                  No conferences found matching your criteria.
                </Text>
              </Box>
            ) : (
              paginatedConferences.map((conference, index) => (
                <ConferenceCard
                  key={conference.id}
                  conference={conference}
                  onClick={() => setSelectedConference(conference)}
                  index={index}
                />
              ))
            )}
          </Grid>

          {totalPages > 1 && (
            <Flex
              justify="center"
              align="center"
              gap="4"
              mt="12"
              p="6"
              bg="white"
              borderRadius="xl"
              border="1px"
              borderColor="brand.200"
              boxShadow="0 2px 8px rgba(46, 95, 169, 0.08)"
            >
              <Button
                onClick={() => {
                  setCurrentPage(prev => Math.max(1, prev - 1));
                  scrollToTop();
                }}
                disabled={currentPage === 1}
                size="md"
                px="6"
                bg="brand.500"
                color="white"
                fontWeight="600"
                borderRadius="lg"
                transition="all 0.2s ease-in-out"
                _hover={{
                  bg: 'brand.600',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(46, 95, 169, 0.3)'
                }}
                _active={{
                  transform: 'scale(0.98)'
                }}
                _disabled={{
                  bg: 'gray.200',
                  color: 'gray.400',
                  cursor: 'not-allowed',
                  transform: 'none',
                  boxShadow: 'none',
                  _hover: {
                    bg: 'gray.200',
                    transform: 'none',
                    boxShadow: 'none'
                  }
                }}
              >
                ← Previous
              </Button>

              <Box
                px="6"
                py="2"
                bg="brand.50"
                borderRadius="lg"
                border="1px"
                borderColor="brand.200"
              >
                <Text fontSize="sm" color="brand.600" fontWeight="600">
                  Page {currentPage} of {totalPages}
                </Text>
              </Box>

              <Button
                onClick={() => {
                  setCurrentPage(prev => Math.min(totalPages, prev + 1));
                  scrollToTop();
                }}
                disabled={currentPage === totalPages}
                size="md"
                px="6"
                bg="brand.500"
                color="white"
                fontWeight="600"
                borderRadius="lg"
                transition="all 0.2s ease-in-out"
                _hover={{
                  bg: 'brand.600',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(46, 95, 169, 0.3)'
                }}
                _active={{
                  transform: 'scale(0.98)'
                }}
                _disabled={{
                  bg: 'gray.200',
                  color: 'gray.400',
                  cursor: 'not-allowed',
                  transform: 'none',
                  boxShadow: 'none',
                  _hover: {
                    bg: 'gray.200',
                    transform: 'none',
                    boxShadow: 'none'
                  }
                }}
              >
                Next →
              </Button>
            </Flex>
          )}
        </Container>

        {selectedConference && (
          <ConferenceModal
            conference={selectedConference}
            onClose={() => setSelectedConference(null)}
          />
        )}
      </Box>
      <Footer />
    </>
  );
}
