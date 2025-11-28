'use client';

import { Suspense, useState, useMemo, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
} from '@chakra-ui/react';
import { MapPin, Download } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import luxonPlugin from '@fullcalendar/luxon3';
import { DateTime } from 'luxon';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ConferenceFiltersPanel from '@/components/ConferenceFiltersPanel';
import ConferenceModal from '@/components/ConferenceModal';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { useConferences } from '@/hooks/useConferences';
import { useConferenceFilters, type ConferenceFiltersState } from '@/hooks/useConferenceFilters';
import { useURLSync, useInitialURLParams } from '@/utils/urlSync';
import { getEventColorFromSubjects, toISOFormat } from '@/utils/parser';
import { conferenceToICSEvents, createICSContent, downloadICS } from '@/utils/ics';
import { secondaryButtonStyle, brandButtonStyle } from '@/styles/buttonStyles';
import type { Conference } from '@/types/conference';
import { EventClickArg } from '@fullcalendar/core';


function CalendarContent() {
  const calendarRef = useRef<FullCalendar>(null);
  const { conferences, loading, error } = useConferences();
  const initialParams = useInitialURLParams();
  const { syncFiltersToURL, syncSearchToURL } = useURLSync('/calendar');

  const [searchQuery, setSearchQuery] = useState<string>(initialParams.searchQuery);
  const [filters, setFilters] = useState<ConferenceFiltersState>({
    sortBy: 'deadline',
    year: initialParams.year,
    subject: initialParams.subject,
    type: '',
  });
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);

  const handleFilterChange = (newFilters: Partial<ConferenceFiltersState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    syncFiltersToURL(searchQuery, updated);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    syncSearchToURL(query, filters);
  };

  // Use the centralized filtering hook instead of duplicating logic
  const filteredConferences = useConferenceFilters(conferences, searchQuery, filters);

  const calendarEvents = useMemo(() => {
    const events: any[] = [];

    filteredConferences.forEach(conf => {
      const eventColors = getEventColorFromSubjects(conf.sub);

      if (conf.start && conf.end) {
        events.push({
          id: `conf-${conf.id}`,
          title: `${conf.title} ${conf.year}`,
          start: conf.start,
          end: DateTime.fromISO(conf.end).plus({ days: 1 }).toISODate(),
          allDay: true,
          backgroundColor: eventColors.backgroundColor,
          borderColor: eventColors.borderColor,
          extendedProps: {
            type: 'conference',
            conference: conf,
          },
        });
      }

      if (conf.abstract_deadline) {
        const dt = DateTime.fromISO(toISOFormat(conf.abstract_deadline), { zone: conf.timezone });
        if (dt.isValid) {
          events.push({
            id: `abstract-${conf.id}`,
            title: `Abstract: ${conf.title} ${conf.year}`,
            start: dt.toISO(),
            end: dt.plus({ hours: 1 }).toISO(),
            allDay: false,
            backgroundColor: eventColors.backgroundColor,
            borderColor: eventColors.borderColor,
            extendedProps: {
              type: 'abstract',
              conference: conf,
              deadline: dt,
            },
          });
        }
      }

      if (conf.deadline) {
        const dt = DateTime.fromISO(toISOFormat(conf.deadline), { zone: conf.timezone });
        if (dt.isValid) {
          events.push({
            id: `deadline-${conf.id}`,
            title: `Submission: ${conf.title} ${conf.year}`,
            start: dt.toISO(),
            end: dt.plus({ hours: 1 }).toISO(),
            allDay: false,
            backgroundColor: eventColors.backgroundColor,
            borderColor: eventColors.borderColor,
            extendedProps: {
              type: 'submission',
              conference: conf,
              deadline: dt,
            },
          });
        }
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

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <Header />
      <Box py={{ base: '6', md: '8' }} pb={{ base: '12', md: '16' }} minH="calc(100vh - 200px)">
        <Container maxW="1200px" px={{ base: '4', md: '6' }} mx="auto">
          <ConferenceFiltersPanel
            title="Conference Calendar"
            description="View all conferences and deadlines in a calendar format"
            searchValue={searchQuery}
            onSearchChange={handleSearchChange}
            conferences={conferences}
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          <Flex gap="4" justify="center" mb="8" direction={{ base: 'column', md: 'row' }}>
            <Button
              onClick={handleToday}
              size="md"
              px="6"
              {...secondaryButtonStyle}
            >
              <Flex align="center" gap="2">
                <MapPin size={16} />
                <span>Today</span>
              </Flex>
            </Button>
            <Button
              onClick={handleExportAll}
              size="md"
              px="6"
              {...brandButtonStyle}
            >
              <Flex align="center" gap="2">
                <Download size={16} />
                <span>Export All ({filteredConferences.length} conferences)</span>
              </Flex>
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
            <style>{`
              .fc-event {
                margin-bottom: 4px !important;
              }
              .fc-daygrid-event {
                margin-bottom: 4px !important;
              }
              .fc-timegrid-event {
                margin-bottom: 6px !important;
              }
            `}</style>
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
              eventDisplay="block"
              displayEventTime={true}
              displayEventEnd={true}
              dayMaxEvents={false}
              eventMaxStack={10}
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
    <Suspense fallback={<LoadingState />}>
      <CalendarContent />
    </Suspense>
  );
}
