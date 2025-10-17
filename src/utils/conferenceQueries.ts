/**
 * Conference Query Utilities
 *
 * Pure functions extracted from useConferenceFilters hook for reuse in Slack bot.
 * These functions handle filtering, searching, and sorting of conferences.
 */

import { DateTime } from 'luxon';
import { getNextDeadline } from './parser';
import type { Conference, DeadlineInfo } from '@/types/conference';

/**
 * Search conferences by title, year, or full name
 * Case-insensitive, whitespace-insensitive matching
 */
export function searchConferences(
  conferences: Conference[],
  query: string
): Conference[] {
  if (!query) return conferences;

  const q = query.toLowerCase().replace(/\s+/g, '');
  return conferences.filter(conf => {
    const searchableText = `${conf.title}${conf.year}${conf.full_name}`
      .toLowerCase()
      .replace(/\s+/g, '');
    return searchableText.includes(q);
  });
}

/**
 * Filter conferences by year
 */
export function filterByYear(
  conferences: Conference[],
  year: number
): Conference[] {
  return conferences.filter(conf => conf.year === year);
}

/**
 * Filter conferences by subject
 * Handles both string and array subject fields
 */
export function filterBySubject(
  conferences: Conference[],
  subject: string
): Conference[] {
  return conferences.filter(conf => {
    if (Array.isArray(conf.sub)) {
      return conf.sub.includes(subject);
    }
    return conf.sub === subject;
  });
}

/**
 * Sort conferences by deadline (active first, then expired)
 * Active deadlines sorted by nearness, expired by recency
 */
export function sortByDeadline(conferences: Conference[]): Conference[] {
  return [...conferences].sort((a, b) => {
    const aNext = getNextDeadline(a);
    const bNext = getNextDeadline(b);
    const now = DateTime.now();

    const aIsActive = aNext && aNext.localDatetime > now;
    const bIsActive = bNext && bNext.localDatetime > now;

    // Active deadlines come first
    if (aIsActive && !bIsActive) return -1;
    if (!aIsActive && bIsActive) return 1;

    // Both active: sort by nearness (ascending)
    if (aIsActive && bIsActive) {
      return aNext.datetime.toMillis() - bNext.datetime.toMillis();
    }

    // Both expired: sort by recency (descending)
    if (!aIsActive && !bIsActive) {
      if (!aNext && !bNext) return 0;
      if (!aNext) return 1;
      if (!bNext) return -1;
      return bNext.datetime.toMillis() - aNext.datetime.toMillis();
    }

    return 0;
  });
}

/**
 * Sort conferences by h-index (descending)
 */
export function sortByHIndex(conferences: Conference[]): Conference[] {
  return [...conferences].sort((a, b) => (b.hindex || 0) - (a.hindex || 0));
}

/**
 * Sort conferences by conference start date (descending)
 */
export function sortByStartDate(conferences: Conference[]): Conference[] {
  return [...conferences].sort((a, b) => {
    const aStart = a.start ? DateTime.fromISO(a.start) : DateTime.fromMillis(0);
    const bStart = b.start ? DateTime.fromISO(b.start) : DateTime.fromMillis(0);
    return bStart.toMillis() - aStart.toMillis();
  });
}

/**
 * Get conferences with upcoming deadlines (not expired)
 * Sorted by nearness, optionally limited
 */
export function getUpcomingDeadlines(
  conferences: Conference[],
  limit?: number
): Array<{ conference: Conference; deadline: DeadlineInfo }> {
  const now = DateTime.now();

  const upcoming = conferences
    .map(conf => ({ conference: conf, deadline: getNextDeadline(conf) }))
    .filter((item): item is { conference: Conference; deadline: DeadlineInfo } =>
      item.deadline !== null && item.deadline.localDatetime > now
    )
    .sort((a, b) => a.deadline.datetime.toMillis() - b.deadline.datetime.toMillis());

  return limit ? upcoming.slice(0, limit) : upcoming;
}

/**
 * Calculate days until deadline
 * Returns positive number for future deadlines, negative for past
 */
export function getDaysUntilDeadline(deadline: DeadlineInfo): number {
  const diff = deadline.localDatetime.diff(DateTime.now(), ['days']);
  return Math.ceil(diff.days);
}

/**
 * Check if deadline is expired
 */
export function isDeadlineExpired(deadline: DeadlineInfo): boolean {
  return deadline.localDatetime <= DateTime.now();
}

/**
 * Get all unique years from conferences
 */
export function getUniqueYears(conferences: Conference[]): number[] {
  const years = conferences.map(c => c.year);
  return Array.from(new Set(years)).sort((a, b) => b - a);
}

/**
 * Get all unique subjects from conferences
 */
export function getUniqueSubjects(conferences: Conference[]): string[] {
  const subjects = new Set<string>();
  conferences.forEach(conf => {
    if (Array.isArray(conf.sub)) {
      conf.sub.forEach(s => subjects.add(s));
    } else {
      subjects.add(conf.sub);
    }
  });
  return Array.from(subjects).sort();
}

/**
 * Group conferences by subject
 */
export function groupBySubject(
  conferences: Conference[]
): Map<string, Conference[]> {
  const bySubject = new Map<string, Conference[]>();

  conferences.forEach(conf => {
    const subjects = Array.isArray(conf.sub) ? conf.sub : [conf.sub];
    subjects.forEach(subject => {
      if (!bySubject.has(subject)) {
        bySubject.set(subject, []);
      }
      bySubject.get(subject)!.push(conf);
    });
  });

  return bySubject;
}

/**
 * Get conferences expiring within N days
 */
export function getDeadlinesWithinDays(
  conferences: Conference[],
  days: number
): Array<{ conference: Conference; deadline: DeadlineInfo; daysLeft: number }> {
  const now = DateTime.now();

  return conferences
    .map(conf => {
      const deadline = getNextDeadline(conf);
      if (!deadline || deadline.localDatetime <= now) return null;

      const daysLeft = getDaysUntilDeadline(deadline);
      if (daysLeft > days) return null;

      return { conference: conf, deadline, daysLeft };
    })
    .filter((item): item is { conference: Conference; deadline: DeadlineInfo; daysLeft: number } => item !== null)
    .sort((a, b) => a.daysLeft - b.daysLeft);
}
