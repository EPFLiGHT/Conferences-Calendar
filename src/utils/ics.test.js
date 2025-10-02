import { describe, it, expect } from 'vitest';
import { createICSContent, conferenceToICSEvents } from './ics';
import { DateTime } from 'luxon';

describe('conferenceToICSEvents', () => {
  it('should create events for all conference dates', () => {
    const conf = {
      id: 'test24',
      title: 'TestConf',
      year: 2024,
      start: '2024-12-10',
      end: '2024-12-15',
      deadline: '2024-11-01 23:59',
      abstract_deadline: '2024-10-25 23:59',
      timezone: 'UTC',
      place: 'Test City',
      full_name: 'Test Conference',
      link: 'https://test.com',
    };

    const events = conferenceToICSEvents(conf);
    expect(events).toHaveLength(3); // Conference + abstract + submission
    expect(events[0].isAllDay).toBe(true);
    expect(events[1].isAllDay).toBe(false);
    expect(events[2].isAllDay).toBe(false);
  });

  it('should handle conferences without deadlines', () => {
    const conf = {
      id: 'test24',
      title: 'TestConf',
      year: 2024,
      start: '2024-12-10',
      end: '2024-12-15',
      timezone: 'UTC',
    };

    const events = conferenceToICSEvents(conf);
    expect(events).toHaveLength(1); // Only conference event
  });

  it('should handle conferences without dates', () => {
    const conf = {
      id: 'test24',
      title: 'TestConf',
      year: 2024,
      deadline: '2024-11-01 23:59',
      timezone: 'UTC',
    };

    const events = conferenceToICSEvents(conf);
    expect(events).toHaveLength(1); // Only deadline event
  });
});

describe('createICSContent', () => {
  it('should create valid ICS format', () => {
    const events = [
      {
        uid: 'test@example.com',
        title: 'Test Event',
        start: DateTime.fromISO('2024-12-01T10:00:00'),
        end: DateTime.fromISO('2024-12-01T11:00:00'),
        isAllDay: false,
      },
    ];

    const ics = createICSContent(events);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('END:VEVENT');
    expect(ics).toContain('SUMMARY:Test Event');
  });

  it('should handle all-day events', () => {
    const events = [
      {
        uid: 'test@example.com',
        title: 'All Day Event',
        start: DateTime.fromISO('2024-12-01'),
        end: DateTime.fromISO('2024-12-05'),
        isAllDay: true,
      },
    ];

    const ics = createICSContent(events);
    expect(ics).toContain('DTSTART;VALUE=DATE:20241201');
    expect(ics).toContain('DTEND;VALUE=DATE:20241206'); // +1 day
  });

  it('should escape special characters', () => {
    const events = [
      {
        uid: 'test@example.com',
        title: 'Event, with; special\\characters',
        start: DateTime.fromISO('2024-12-01T10:00:00'),
        end: DateTime.fromISO('2024-12-01T11:00:00'),
        isAllDay: false,
        description: 'Line 1\nLine 2',
      },
    ];

    const ics = createICSContent(events);
    expect(ics).toContain('SUMMARY:Event\\, with\\; special\\\\characters');
    expect(ics).toContain('DESCRIPTION:Line 1\\nLine 2');
  });
});
