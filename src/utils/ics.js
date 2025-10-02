import { DateTime } from 'luxon';

export function createICSContent(events) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Conference Deadlines//LiGHT Lab//EN',
    'CALSCALE:GREGORIAN',
  ];

  events.forEach(event => {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${event.uid}`);
    lines.push(`DTSTAMP:${DateTime.now().toFormat("yyyyMMdd'T'HHmmss'Z'")}`);

    if (event.isAllDay) {
      lines.push(`DTSTART;VALUE=DATE:${event.start.toFormat('yyyyMMdd')}`);
      lines.push(`DTEND;VALUE=DATE:${event.end.plus({ days: 1 }).toFormat('yyyyMMdd')}`);
    } else {
      lines.push(`DTSTART:${event.start.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'")}`);
      lines.push(`DTEND:${event.end.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'")}`);
    }

    lines.push(`SUMMARY:${escapeICS(event.title)}`);

    if (event.description) {
      lines.push(`DESCRIPTION:${escapeICS(event.description)}`);
    }

    if (event.location) {
      lines.push(`LOCATION:${escapeICS(event.location)}`);
    }

    if (event.url) {
      lines.push(`URL:${event.url}`);
    }

    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function escapeICS(str) {
  return str.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');
}

export function downloadICS(content, filename) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function conferenceToICSEvents(conference) {
  const events = [];

  // Conference event (all-day)
  if (conference.start && conference.end) {
    events.push({
      uid: `conf-${conference.id}@conference-deadlines`,
      title: `${conference.title} ${conference.year}`,
      start: DateTime.fromISO(conference.start),
      end: DateTime.fromISO(conference.end),
      isAllDay: true,
      location: conference.place,
      description: conference.full_name,
      url: conference.link,
    });
  }

  // Abstract deadline
  if (conference.abstract_deadline) {
    const dt = DateTime.fromISO(conference.abstract_deadline, { zone: conference.timezone });
    events.push({
      uid: `abstract-${conference.id}@conference-deadlines`,
      title: `Abstract Deadline: ${conference.title} ${conference.year}`,
      start: dt,
      end: dt.plus({ hours: 1 }),
      isAllDay: false,
      description: `Abstract submission deadline for ${conference.full_name}`,
      url: conference.link,
    });
  }

  // Submission deadline
  if (conference.deadline) {
    const dt = DateTime.fromISO(conference.deadline, { zone: conference.timezone });
    events.push({
      uid: `deadline-${conference.id}@conference-deadlines`,
      title: `Submission Deadline: ${conference.title} ${conference.year}`,
      start: dt,
      end: dt.plus({ hours: 1 }),
      isAllDay: false,
      description: `Paper submission deadline for ${conference.full_name}`,
      url: conference.link,
    });
  }

  return events;
}

export function exportConference(conference) {
  const events = conferenceToICSEvents(conference);
  const content = createICSContent(events);
  downloadICS(content, `${conference.id}-deadlines.ics`);
}

export function exportAllConferences(conferences) {
  const allEvents = conferences.flatMap(conferenceToICSEvents);
  const content = createICSContent(allEvents);
  downloadICS(content, 'all-conference-deadlines.ics');
}
