import { useState, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Badge,
  VStack,
  Link,
} from '@chakra-ui/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import luxonPlugin from '@fullcalendar/luxon3';
import { DateTime } from 'luxon';
import Filters from '../components/Filters';
import Search from '../components/Search';
import { conferenceToICSEvents, createICSContent, downloadICS } from '../utils/ics';

export default function CalendarPage({ conferences }) {
  const calendarRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    sortBy: 'deadline',
    year: searchParams.get('year') || '',
    subject: searchParams.get('subject') || '',
  });
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleFilterChange = (newFilters) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    // Update URL params
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (updated.year) params.set('year', updated.year);
    if (updated.subject) params.set('subject', updated.subject);
    setSearchParams(params);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  const filteredConferences = useMemo(() => {
    let result = [...conferences];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(conf =>
        conf.title.toLowerCase().includes(query) ||
        conf.full_name.toLowerCase().includes(query)
      );
    }

    if (filters.year) {
      result = result.filter(conf => conf.year === parseInt(filters.year));
    }

    if (filters.subject) {
      result = result.filter(conf => conf.sub === filters.subject);
    }

    return result;
  }, [conferences, searchQuery, filters]);

  const calendarEvents = useMemo(() => {
    const events = [];

    filteredConferences.forEach(conf => {
      // Conference event (all-day)
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

      // Abstract deadline
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

      // Submission deadline
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

  const handleEventClick = (info) => {
    setSelectedEvent({
      event: info.event,
      el: info.el,
    });
  };

  const handleExportAll = () => {
    const allEvents = filteredConferences.flatMap(conferenceToICSEvents);
    const content = createICSContent(allEvents);
    downloadICS(content, 'conference-calendar.ics');
  };

  const handleExportEvent = () => {
    if (!selectedEvent) return;

    const conf = selectedEvent.event.extendedProps.conference;
    const events = conferenceToICSEvents(conf);
    const content = createICSContent(events);
    downloadICS(content, `${conf.id}.ics`);
  };

  const handleCopyLink = () => {
    if (!selectedEvent) return;

    const conf = selectedEvent.event.extendedProps.conference;
    const params = new URLSearchParams();
    params.set('conf', conf.id);
    const url = `${window.location.origin}${window.location.pathname}?${params}`;

    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
    }
  };

  return (
    <Box py={{ base: '6', md: '8' }} pb={{ base: '12', md: '16' }} minH="calc(100vh - 200px)">
      <Container maxW="1200px" px={{ base: '4', md: '6' }} mx="auto">
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

        <Flex gap="4" justify="center" mb="8" direction={{ base: 'column', md: 'row' }}>
          <Button
            onClick={handleToday}
            variant="outline"
            colorScheme="gray"
            transition="all 0.2s ease-in-out"
            position="relative"
            zIndex="1"
            _hover={{ transform: 'translateY(-1px)', boxShadow: 'sm' }}
            _active={{ transform: 'scale(0.97)' }}
          >
            Today
          </Button>
          <Button
            onClick={handleExportAll}
            colorScheme="blue"
            transition="all 0.2s ease-in-out"
            position="relative"
            zIndex="1"
            _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
            _active={{ transform: 'scale(0.97)' }}
          >
            Export All ({filteredConferences.length} conferences)
          </Button>
        </Flex>

        <Box
          bg="white"
          borderRadius="xl"
          border="1px"
          borderColor="brand.200"
          p={{ base: '4', md: '6' }}
          boxShadow="0 1px 3px rgba(46, 95, 169, 0.08)"
          css={{
            '.fc': { fontFamily: 'inherit' },
            '.fc .fc-button': {
              background: 'var(--chakra-colors-brand-500)',
              borderColor: 'var(--chakra-colors-brand-500)',
              textTransform: 'capitalize',
              fontWeight: '500',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              position: 'relative',
              zIndex: '1',
            },
            '.fc .fc-button:hover': {
              background: 'var(--chakra-colors-brand-600)',
              borderColor: 'var(--chakra-colors-brand-600)',
            },
            '.fc .fc-button-active': {
              background: 'var(--chakra-colors-brand-700)',
              borderColor: 'var(--chakra-colors-brand-700)',
            },
            '.fc .fc-toolbar-title': {
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'var(--chakra-colors-gray-800)',
            },
            '.fc-theme-standard td, .fc-theme-standard th': {
              borderColor: 'var(--chakra-colors-brand-200)',
            },
            '.fc .fc-daygrid-day-number': {
              color: 'var(--chakra-colors-gray-800)',
            },
            '.fc .fc-col-header-cell-cushion': {
              color: 'var(--chakra-colors-gray-600)',
              fontWeight: '600',
            },
            '.fc .fc-event': {
              cursor: 'pointer',
              borderRadius: '4px',
              padding: '2px 4px',
              fontSize: '0.875rem',
            },
            '.fc .fc-event-time': {
              display: 'none !important',
            },
            '.fc-timegrid-event .fc-event-time': {
              display: 'block !important',
            },
            '@media (max-width: 768px)': {
              '.fc .fc-toolbar': {
                flexDirection: 'column',
                gap: '1rem',
              },
              '.fc .fc-toolbar-title': {
                fontSize: '1.25rem',
              },
              '.fc .fc-button': {
                padding: '0.375rem 0.75rem',
                fontSize: '0.875rem',
              },
            },
          }}
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

        {selectedEvent && (
          <Box
            position="fixed"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="rgba(0, 0, 0, 0.5)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex="1000"
            p="4"
            onClick={() => setSelectedEvent(null)}
          >
            <Box
              bg="white"
              borderRadius="xl"
              p="8"
              maxW="500px"
              w="full"
              boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              position="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                position="absolute"
                top="4"
                right="4"
                variant="ghost"
                size="sm"
                fontSize="xl"
                color="gray.600"
                _hover={{ bg: 'gray.100', color: 'gray.800' }}
                onClick={() => setSelectedEvent(null)}
                aria-label="Close"
              >
                ✕
              </Button>

              <Heading as="h3" size="lg" mb="6" pr="8" color="gray.800">
                {selectedEvent.event.title}
              </Heading>

              <VStack align="stretch" gap="4" mb="6">
                {selectedEvent.event.extendedProps.type === 'conference' ? (
                  <>
                    <VStack align="start" gap="1">
                      <Text fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
                        Location:
                      </Text>
                      <Text fontSize="sm" color="gray.800">
                        {selectedEvent.event.extendedProps.conference.place}
                      </Text>
                    </VStack>
                    <VStack align="start" gap="1">
                      <Text fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
                        Date:
                      </Text>
                      <Text fontSize="sm" color="gray.800">
                        {selectedEvent.event.extendedProps.conference.date}
                      </Text>
                    </VStack>
                  </>
                ) : (
                  <>
                    <VStack align="start" gap="1">
                      <Text fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
                        Type:
                      </Text>
                      <Text fontSize="sm" color="gray.800">
                        {selectedEvent.event.extendedProps.type === 'abstract'
                          ? 'Abstract Deadline'
                          : 'Submission Deadline'}
                      </Text>
                    </VStack>
                    <VStack align="start" gap="1">
                      <Text fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
                        Original Time:
                      </Text>
                      <Text fontSize="sm" color="gray.800" fontFamily="mono">
                        {selectedEvent.event.extendedProps.deadline.toFormat('MMM dd, yyyy HH:mm')}{' '}
                        {selectedEvent.event.extendedProps.conference.timezone}
                      </Text>
                    </VStack>
                    <VStack align="start" gap="1">
                      <Text fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
                        Local Time:
                      </Text>
                      <Text fontSize="sm" color="gray.800" fontFamily="mono">
                        {selectedEvent.event.extendedProps.deadline
                          .toLocal()
                          .toFormat('MMM dd, yyyy HH:mm')}{' '}
                        {DateTime.local().zoneName}
                      </Text>
                    </VStack>
                  </>
                )}

                <VStack align="start" gap="1">
                  <Text fontSize="xs" fontWeight="600" color="gray.600" textTransform="uppercase" letterSpacing="wider">
                    Subject:
                  </Text>
                  <Badge
                    px="3"
                    py="1"
                    borderRadius="full"
                    fontSize="xs"
                    fontWeight="500"
                    bg="brand.50"
                    color="brand.500"
                    border="1px"
                    borderColor="brand.200"
                  >
                    {selectedEvent.event.extendedProps.conference.sub}
                  </Badge>
                </VStack>
              </VStack>

              <Flex gap="3" wrap="wrap" direction={{ base: 'column', md: 'row' }}>
                <Button
                  onClick={handleExportEvent}
                  colorScheme="blue"
                  size="sm"
                  flex={{ base: '1', md: 'auto' }}
                  transition="all 0.2s ease-in-out"
                  position="relative"
                  zIndex="1"
                  _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
                  _active={{ transform: 'scale(0.97)' }}
                >
                  Export to Calendar
                </Button>
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="sm"
                  flex={{ base: '1', md: 'auto' }}
                  transition="all 0.2s ease-in-out"
                  position="relative"
                  zIndex="1"
                  _hover={{ transform: 'translateY(-1px)', boxShadow: 'sm' }}
                  _active={{ transform: 'scale(0.97)' }}
                >
                  Copy Link
                </Button>
                {selectedEvent.event.extendedProps.conference.link && (
                  <Link
                    href={selectedEvent.event.extendedProps.conference.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    textDecoration="none"
                    flex={{ base: '1', md: 'auto' }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      w="full"
                      transition="all 0.2s ease-in-out"
                      position="relative"
                      zIndex="1"
                      _hover={{ transform: 'translateY(-1px)', boxShadow: 'sm' }}
                      _active={{ transform: 'scale(0.97)' }}
                    >
                      Website
                    </Button>
                  </Link>
                )}
              </Flex>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
