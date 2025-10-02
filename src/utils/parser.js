import yaml from 'js-yaml';
import { DateTime } from 'luxon';

const REQUIRED_FIELDS = ['title', 'year', 'id', 'timezone'];

const IANA_TIMEZONES = Intl.supportedValuesOf('timeZone');

export function validateConference(conf, index) {
  const errors = [];

  // Check required fields
  REQUIRED_FIELDS.forEach(field => {
    if (!conf[field]) {
      errors.push(`Conference at index ${index}: Missing required field '${field}'`);
    }
  });

  // Validate timezone
  if (conf.timezone && !IANA_TIMEZONES.includes(conf.timezone)) {
    errors.push(`Conference '${conf.id}': Invalid IANA timezone '${conf.timezone}'`);
  }

  // Validate date formats
  const dateFields = ['deadline', 'abstract_deadline', 'start', 'end'];
  dateFields.forEach(field => {
    if (conf[field]) {
      const parsed = DateTime.fromISO(conf[field]);
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

export function parseConferences(yamlString) {
  try {
    const conferences = yaml.load(yamlString);

    if (!Array.isArray(conferences)) {
      throw new Error('YAML must contain an array of conferences');
    }

    // Validate all conferences
    const allErrors = [];
    conferences.forEach((conf, index) => {
      const errors = validateConference(conf, index);
      allErrors.push(...errors);
    });

    // Check for duplicate IDs
    const ids = conferences.map(c => c.id).filter(Boolean);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicates.length > 0) {
      allErrors.push(`Duplicate conference IDs found: ${duplicates.join(', ')}`);
    }

    if (allErrors.length > 0) {
      console.warn('Conference validation warnings:', allErrors);
    }

    // Fill in TBA for missing optional fields
    return conferences.map(conf => ({
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
    }));
  } catch (error) {
    console.error('Error parsing YAML:', error);
    throw error;
  }
}

export function getDeadlineInfo(conference, userTimezone = 'local') {
  const deadlines = [];

  if (conference.abstract_deadline) {
    const dt = DateTime.fromISO(conference.abstract_deadline, { zone: conference.timezone });
    if (dt.isValid) {
      deadlines.push({
        type: 'abstract',
        label: 'Abstract Deadline',
        datetime: dt,
        localDatetime: userTimezone === 'local' ? dt.toLocal() : dt.setZone(userTimezone),
      });
    }
  }

  if (conference.deadline) {
    const dt = DateTime.fromISO(conference.deadline, { zone: conference.timezone });
    if (dt.isValid) {
      deadlines.push({
        type: 'submission',
        label: 'Submission Deadline',
        datetime: dt,
        localDatetime: userTimezone === 'local' ? dt.toLocal() : dt.setZone(userTimezone),
      });
    }
  }

  return deadlines;
}

export function getNextDeadline(conference) {
  const deadlines = getDeadlineInfo(conference);
  const now = DateTime.now();

  const upcoming = deadlines.filter(d => d.datetime > now);
  return upcoming.length > 0 ? upcoming[0] : null;
}

export function formatDeadline(datetime, timezone) {
  return datetime.toFormat('MMM dd, yyyy HH:mm') + ` ${timezone}`;
}
