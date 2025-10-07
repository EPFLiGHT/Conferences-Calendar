import yaml from 'js-yaml';
import { DateTime } from 'luxon';
import { SUBJECT_COLORS } from '@/theme';
import type { Conference, DeadlineInfo } from '@/types/conference';

const REQUIRED_FIELDS = ['title', 'year', 'id', 'timezone'] as const;

export function validateConference(conf: any, index: number): string[] {
  const errors: string[] = [];

  // Check required fields
  REQUIRED_FIELDS.forEach((field) => {
    if (!conf[field]) {
      errors.push(`Conference at index ${index}: Missing required field '${field}'`);
    }
  });

  // Validate timezone - use Luxon to validate since it accepts more timezones than Intl
  if (conf.timezone) {
    const testDate = DateTime.fromISO('2025-01-01T12:00', { zone: conf.timezone });
    if (!testDate.isValid) {
      errors.push(`Conference '${conf.id}': Invalid IANA timezone '${conf.timezone}'`);
    }
  }

  // Validate date formats
  const dateFields = ['deadline', 'abstract_deadline', 'start', 'end'];
  dateFields.forEach((field) => {
    if (conf[field]) {
      // Replace space with 'T' to make it ISO 8601 compliant
      const isoString = String(conf[field]).replace(' ', 'T');
      const parsed = DateTime.fromISO(isoString);
      if (!parsed.isValid) {
        errors.push(`Conference '${conf.id}': Invalid date format for '${field}': ${conf[field]}`);
      }
    }
  });

  // Validate year format
  if (conf.year && (typeof conf.year !== 'number' || conf.year < 1900 || conf.year > 2100)) {
    errors.push(`Conference '${conf.id}': Invalid year '${conf.year}'`);
  }

  // Validate h-index
  if (conf.hindex !== undefined && (typeof conf.hindex !== 'number' || conf.hindex < 0)) {
    errors.push(`Conference '${conf.id}': Invalid h-index '${conf.hindex}'`);
  }

  return errors;
}

export function parseConferences(yamlString: string): Conference[] {
  try {
    const conferences = yaml.load(yamlString) as any[];

    if (!Array.isArray(conferences)) {
      throw new Error('YAML must contain an array of conferences');
    }

    // Validate all conferences
    const allErrors: string[] = [];
    conferences.forEach((conf, index) => {
      const errors = validateConference(conf, index);
      allErrors.push(...errors);
    });

    // Check for duplicate IDs
    const ids = conferences.map((c) => c.id).filter(Boolean);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicates.length > 0) {
      allErrors.push(`Duplicate conference IDs found: ${duplicates.join(', ')}`);
    }

    if (allErrors.length > 0) {
      console.warn('Conference validation warnings:', allErrors);
    }

    // Fill in TBA for missing optional fields
    return conferences.map((conf) => ({
      ...conf,
      full_name: conf.full_name || conf.title,
      link: conf.link || null,
      deadline: conf.deadline || null,
      abstract_deadline: conf.abstract_deadline || null,
      place: conf.place || 'TBA',
      date: conf.date || 'TBA',
      start: conf.start || null,
      end: conf.end || null,
      paperslink: conf.paperslink || null,
      pwclink: conf.pwclink || null,
      hindex: conf.hindex || 0,
      sub: conf.sub || 'General',
      note: conf.note || '',
    })) as Conference[];
  } catch (error) {
    console.error('Error parsing YAML:', error);
    throw error;
  }
}

export function getDeadlineInfo(conference: Conference, userTimezone: string = 'local'): DeadlineInfo[] {
  const deadlines: DeadlineInfo[] = [];

  if (conference.abstract_deadline) {
    // Replace space with 'T' to make it ISO 8601 compliant
    const isoString = conference.abstract_deadline.replace(' ', 'T');
    const dt = DateTime.fromISO(isoString, { zone: conference.timezone });
    if (dt.isValid) {
      deadlines.push({
        label: 'Abstract Deadline',
        datetime: dt,
        localDatetime: userTimezone === 'local' ? dt.toLocal() : dt.setZone(userTimezone),
      });
    }
  }

  if (conference.deadline) {
    // Replace space with 'T' to make it ISO 8601 compliant
    const isoString = conference.deadline.replace(' ', 'T');
    const dt = DateTime.fromISO(isoString, { zone: conference.timezone });
    if (dt.isValid) {
      deadlines.push({
        label: 'Paper Submission',
        datetime: dt,
        localDatetime: userTimezone === 'local' ? dt.toLocal() : dt.setZone(userTimezone),
      });
    }
  }

  return deadlines;
}

export function getNextDeadline(conference: Conference): DeadlineInfo | null {
  const deadlines = getDeadlineInfo(conference);
  if (deadlines.length === 0) return null;

  const now = DateTime.now();

  // First try to find upcoming deadlines
  const upcoming = deadlines.filter((d) => d.localDatetime > now);
  if (upcoming.length > 0) return upcoming[0];

  // If no upcoming deadlines, return the most recent expired one
  return deadlines[deadlines.length - 1];
}

export function formatDeadline(datetime: DateTime, timezone: string): string {
  return datetime.toFormat('MMM dd, yyyy HH:mm') + ` ${timezone}`;
}

export function getSubjectColor(subject: string) {
  return SUBJECT_COLORS[subject] || { bg: '#f9fafb', color: '#4b5563', border: '#e5e7eb' };
}

export function getSubjectsArray(sub: string | string[]): string[] {
  if (!sub) return ['General'];
  if (Array.isArray(sub)) return sub.filter(Boolean);
  return [sub].filter(Boolean);
}

// Generate event color based on subject tag(s)
export function getEventColorFromSubjects(subjects: string | string[]): {
  backgroundColor: string;
  borderColor: string;
} {
  const subjectsArray = getSubjectsArray(subjects);

  // Use the first subject's color in case of multiple tags
  const subjectColor = getSubjectColor(subjectsArray[0]);
  return {
    backgroundColor: subjectColor.color,
    borderColor: subjectColor.color,
  };
}
