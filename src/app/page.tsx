'use client';

import { useState, useEffect } from 'react';
import { Box, Center, Text, Heading } from '@chakra-ui/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/page-components/Home';
import { parseConferences } from '@/utils/parser';
import type { Conference } from '@/types/conference';

export default function Page() {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
      <Home conferences={conferences} />
      <Footer />
    </>
  );
}
