/**
 * useConferenceFilters Hook
 *
 * Custom hook that handles filtering and sorting of conferences.
 * Supports search, year filter, subject filter, and three sorting modes.
 *
 * @param conferences - Array of conferences to filter
 * @param searchQuery - Search query string
 * @param filters - Filter object with sortBy, year, and subject
 * @returns Filtered and sorted array of conferences
 */

import { useMemo } from 'react';
import { DateTime } from 'luxon';
import { getNextDeadline } from '@/utils/parser';
import type { Conference } from '@/types/conference';

export interface ConferenceFiltersState {
  sortBy: string;
  year: string;
  subject: string;
}

export function useConferenceFilters(
  conferences: Conference[],
  searchQuery: string,
  filters: ConferenceFiltersState
) {
  return useMemo(() => {
    let result = [...conferences];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase().replace(/\s+/g, '');
      result = result.filter(conf => {
        const searchableText = `${conf.title}${conf.year}${conf.full_name}`.toLowerCase().replace(/\s+/g, '');
        return searchableText.includes(query);
      });
    }

    // Apply year filter
    if (filters.year) {
      result = result.filter(conf => conf.year === parseInt(filters.year));
    }

    // Apply subject filter
    if (filters.subject) {
      result = result.filter(conf => {
        if (Array.isArray(conf.sub)) {
          return conf.sub.includes(filters.subject);
        }
        return conf.sub === filters.subject;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      if (filters.sortBy === 'deadline') {
        const aNext = getNextDeadline(a);
        const bNext = getNextDeadline(b);
        const now = DateTime.now();

        const aIsActive = aNext && aNext.localDatetime > now;
        const bIsActive = bNext && bNext.localDatetime > now;

        if (aIsActive && !bIsActive) return -1;
        if (!aIsActive && bIsActive) return 1;

        if (aIsActive && bIsActive) {
          return aNext.datetime.toMillis() - bNext.datetime.toMillis();
        }

        if (!aIsActive && !bIsActive) {
          if (!aNext && !bNext) return 0;
          if (!aNext) return 1;
          if (!bNext) return -1;
          return bNext.datetime.toMillis() - aNext.datetime.toMillis();
        }

        return 0;
      } else if (filters.sortBy === 'hindex') {
        return (b.hindex || 0) - (a.hindex || 0);
      } else if (filters.sortBy === 'start') {
        const aStart = a.start ? DateTime.fromISO(a.start) : DateTime.fromMillis(0);
        const bStart = b.start ? DateTime.fromISO(b.start) : DateTime.fromMillis(0);
        return bStart.toMillis() - aStart.toMillis();
      }
      return 0;
    });

    return result;
  }, [conferences, searchQuery, filters]);
}
