'use client';

import { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Center,
} from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import luxonPlugin from '@fullcalendar/luxon3';
import { DateTime } from 'luxon';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Filters from '@/components/Filters';
import Search from '@/components/Search';
import ConferenceModal from '@/components/ConferenceModal';
import { parseConferences } from '@/utils/parser';
import { conferenceToICSEvents, createICSContent, downloadICS } from '@/utils/ics';
import type { Conference } from '@/types/conference';
import { EventClickArg } from '@fullcalendar/core';
import '@/styles/calendar.css';


function CalendarContent() {
  const calendarRef = useRef<FullCalendar>(null);
  const searchParams = useSearchParams();
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState({
    sortBy: 'deadline',
    year: '',
    subject: '',
  });
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);

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

  useEffect(() => {
    if (!searchParams) return;
    setSearchQuery(searchParams.get('q') || '');
    setFilters({
      sortBy: 'deadline',
      year: searchParams.get('year') || '',
      subject: searchParams.get('subject') || '',
    });
  }, [searchParams]);

  const handleFilterChange = (newFilters: { sortBy?: string; year?: string; subject?: string }) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (updated.year) params.set('year', updated.year);
    if (updated.subject) params.set('subject', updated.subject);

    const newUrl = params.toString() ? `?${params.toString()}` : '/calendar';
    window.history.pushState({}, '', newUrl);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }

    const newUrl = params.toString() ? `?${params.toString()}` : '/calendar';
    window.history.pushState({}, '', newUrl);
  };

  const filteredConferences = useMemo(() => {
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

    return result;
  }, [conferences, searchQuery, filters]);

  const calendarEvents = useMemo(() => {
    const events: any[] = [];

    filteredConferences.forEach(conf => {
      if (conf.start && conf.end) {
        events.push({
          id: `conf-${conf.id}`,
          title: `${conf.title} ${conf.year}`,
          start: conf.start,
          end: DateTime.fromISO(conf.end).plus({ days: 1 }).toISODate(),
          allDay: true,
          backgroundColor: '#2563eb',
          borderColor: '#2563eb',
          extendedProps: {
            type: 'conference',
            conference: conf,
          },
        });
      }

      if (conf.abstract_deadline) {
        const dt = DateTime.fromISO(conf.abstract_deadline, { zone: conf.timezone });
        events.push({
          id: `abstract-${conf.id}`,
          title: `Abstract: ${conf.title} ${conf.year}`,
          start: dt.toISO(),
          end: dt.plus({ hours: 1 }).toISO(),
          allDay: false,
          backgroundColor: '#06b6d4',
          borderColor: '#06b6d4',
          extendedProps: {
            type: 'abstract',
            conference: conf,
            deadline: dt,
          },
        });
      }

      if (conf.deadline) {
        const dt = DateTime.fromISO(conf.deadline, { zone: conf.timezone });
        events.push({
          id: `deadline-${conf.id}`,
          title: `Submission: ${conf.title} ${conf.year}`,
          start: dt.toISO(),
          end: dt.plus({ hours: 1 }).toISO(),
          allDay: false,
          backgroundColor: '#dc2626',
          borderColor: '#dc2626',
          extendedProps: {
            type: 'submission',
            conference: conf,
            deadline: dt,
          },
        });
      }
    });

    return events;
  }, [filteredConferences]);

  const handleEventClick = (info: EventClickArg) => {
    const conference = info.event.extendedProps.conference;
    setSelectedConference(conference);
  };

  const handleExportAll = () => {
    const allEvents = filteredConferences.flatMap(conferenceToICSEvents);
    const content = createICSContent(allEvents);
    downloadICS(content, 'conference-calendar.ics');
  };


  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
    }
  };

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
                Conference Calendar
              </Heading>
              <Text fontSize="md" color="gray.600">
                View all conferences and deadlines in a calendar format
              </Text>
            </Box>

            <Search value={searchQuery} onChange={handleSearchChange} />

            <Filters
              conferences={conferences}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </Box>

          <Flex gap="4" justify="center" mb="8" direction={{ base: 'column', md: 'row' }}>
            <Button
              onClick={handleToday}
              bg="gray.100"
              color="gray.700"
              border="1px"
              borderColor="gray.300"
              size="md"
              px="6"
              transition="all 0.2s ease-in-out"
              position="relative"
              zIndex="1"
              _hover={{
                bg: 'white',
                borderColor: 'brand.400',
                color: 'brand.600',
                transform: 'translateY(-2px)',
                boxShadow: '0 2px 8px rgba(46, 95, 169, 0.15)'
              }}
              _active={{ transform: 'scale(0.98)' }}
            >
              📍 Today
            </Button>
            <Button
              onClick={handleExportAll}
              bg="brand.400"
              color="white"
              size="md"
              px="6"
              transition="all 0.2s ease-in-out"
              position="relative"
              zIndex="1"
              _hover={{
                bg: 'brand.500',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(93, 159, 210, 0.4)'
              }}
              _active={{ transform: 'scale(0.98)' }}
            >
              📥 Export All ({filteredConferences.length} conferences)
            </Button>
          </Flex>

          <Box
            bg="white"
            borderRadius="xl"
            border="1px"
            borderColor="gray.200"
            p={{ base: '4', md: '6' }}
            boxShadow="0 1px 3px rgba(0, 0, 0, 0.1)"
          >
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, luxonPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listMonth',
              }}
              events={calendarEvents}
              eventClick={handleEventClick}
              height="auto"
              timeZone="local"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }}
            />
          </Box>

          {selectedConference && (
            <ConferenceModal
              conference={selectedConference}
              onClose={() => setSelectedConference(null)}
            />
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
}

export default function Calendar() {
  return (
    <Suspense
      fallback={
        <Center minH="100vh">
          <Text fontSize="lg" color="gray.600">
            Loading conferences...
          </Text>
        </Center>
      }
    >
      <CalendarContent />
    </Suspense>
  );
}
