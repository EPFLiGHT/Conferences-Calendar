/**
 * URL Sync Utilities
 *
 * Utilities for synchronizing search query and filters with URL parameters.
 * Manages browser history for shareable URLs and back/forward navigation.
 */

import { useSearchParams } from 'next/navigation';

interface URLSyncFilters {
  year?: string;
  subject?: string;
}

interface UseURLSyncReturn {
  syncFiltersToURL: (searchQuery: string, filters: URLSyncFilters) => void;
  syncSearchToURL: (searchQuery: string, currentFilters: URLSyncFilters) => void;
}

export function useURLSync(basePath: string = ''): UseURLSyncReturn {
  const pushToHistory = (params: URLSearchParams) => {
    if (typeof window === 'undefined') return;
    const newUrl = params.toString() ? `${basePath}?${params.toString()}` : basePath;
    window.history.pushState({}, '', newUrl);
  };

  const buildParams = (searchQuery: string, filters: URLSyncFilters) => {
    const params = new URLSearchParams();

    if (searchQuery) params.set('q', searchQuery);
    if (filters.year) params.set('year', filters.year);
    if (filters.subject) params.set('subject', filters.subject);

    return params;
  };

  const syncFiltersToURL = (searchQuery: string, filters: URLSyncFilters) => {
    const params = buildParams(searchQuery, filters);
    pushToHistory(params);
  };

  const syncSearchToURL = (searchQuery: string, currentFilters: URLSyncFilters) => {
    const params = buildParams(searchQuery, currentFilters);
    pushToHistory(params);
  };

  return {
    syncFiltersToURL,
    syncSearchToURL,
  };
}

/**
 * useInitialURLParams Hook
 *
 * Reads initial URL parameters and returns them.
 * Use this once on component mount to initialize state from URL.
 */
export function useInitialURLParams() {
  const searchParams = useSearchParams();

  return {
    searchQuery: searchParams?.get('q') || '',
    year: searchParams?.get('year') || '',
    subject: searchParams?.get('subject') || '',
  };
}
