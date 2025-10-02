import { describe, it, expect } from 'vitest';
import { parseConferences, validateConference, getDeadlineInfo, getNextDeadline } from './parser';
import { DateTime } from 'luxon';

describe('parseConferences', () => {
  it('should parse valid YAML', () => {
    const yaml = `
- title: TestConf
  year: 2024
  id: testconf24
  timezone: UTC
  deadline: 2024-12-01 23:59
`;
    const result = parseConferences(yaml);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('TestConf');
    expect(result[0].year).toBe(2024);
  });

  it('should fill in TBA for missing optional fields', () => {
    const yaml = `
- title: TestConf
  year: 2024
  id: testconf24
  timezone: UTC
`;
    const result = parseConferences(yaml);
    expect(result[0].place).toBe('TBA');
    expect(result[0].date).toBe('TBA');
  });

  it('should detect duplicate IDs', () => {
    const yaml = `
- title: Conf1
  year: 2024
  id: test24
  timezone: UTC
- title: Conf2
  year: 2024
  id: test24
  timezone: UTC
`;
    // Should still parse but log warnings
    const result = parseConferences(yaml);
    expect(result).toHaveLength(2);
  });
});

describe('validateConference', () => {
  it('should return errors for missing required fields', () => {
    const conf = { title: 'Test' };
    const errors = validateConference(conf, 0);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.includes('year'))).toBe(true);
    expect(errors.some(e => e.includes('id'))).toBe(true);
  });

  it('should validate timezone', () => {
    const conf = {
      title: 'Test',
      year: 2024,
      id: 'test24',
      timezone: 'Invalid/Timezone',
    };
    const errors = validateConference(conf, 0);
    expect(errors.some(e => e.includes('timezone'))).toBe(true);
  });

  it('should validate date formats', () => {
    const conf = {
      title: 'Test',
      year: 2024,
      id: 'test24',
      timezone: 'UTC',
      deadline: 'invalid-date',
    };
    const errors = validateConference(conf, 0);
    expect(errors.some(e => e.includes('date format'))).toBe(true);
  });

  it('should accept valid conference', () => {
    const conf = {
      title: 'Test',
      year: 2024,
      id: 'test24',
      timezone: 'UTC',
      deadline: '2024-12-01 23:59',
    };
    const errors = validateConference(conf, 0);
    expect(errors).toHaveLength(0);
  });
});

describe('getDeadlineInfo', () => {
  it('should parse deadlines with timezone conversion', () => {
    const conf = {
      deadline: '2024-12-01 23:59',
      abstract_deadline: '2024-11-24 23:59',
      timezone: 'America/New_York',
    };
    const deadlines = getDeadlineInfo(conf);
    expect(deadlines).toHaveLength(2);
    expect(deadlines[0].type).toBe('abstract');
    expect(deadlines[1].type).toBe('submission');
    expect(deadlines[0].datetime.zoneName).toBe('America/New_York');
  });

  it('should handle conferences without deadlines', () => {
    const conf = {
      timezone: 'UTC',
    };
    const deadlines = getDeadlineInfo(conf);
    expect(deadlines).toHaveLength(0);
  });
});

describe('getNextDeadline', () => {
  it('should return next upcoming deadline', () => {
    const futureDate = DateTime.now().plus({ days: 7 }).toISO();
    const conf = {
      deadline: futureDate,
      timezone: 'UTC',
    };
    const next = getNextDeadline(conf);
    expect(next).not.toBeNull();
    expect(next.type).toBe('submission');
  });

  it('should return null for past deadlines', () => {
    const conf = {
      deadline: '2020-01-01 23:59',
      timezone: 'UTC',
    };
    const next = getNextDeadline(conf);
    expect(next).toBeNull();
  });

  it('should prioritize abstract deadline if both are upcoming', () => {
    const abstract = DateTime.now().plus({ days: 5 }).toISO();
    const submission = DateTime.now().plus({ days: 10 }).toISO();
    const conf = {
      abstract_deadline: abstract,
      deadline: submission,
      timezone: 'UTC',
    };
    const next = getNextDeadline(conf);
    expect(next.type).toBe('abstract');
  });
});
