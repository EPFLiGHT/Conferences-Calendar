/**
 * useConferences Hook
 *
 * Custom hook that fetches conference data from the YAML file.
 * Centralizes the data fetching logic used across multiple pages.
 *
 * @returns {object} { conferences, loading, error }
 */

import { useState, useEffect } from 'react';
import { parseConferences } from '@/utils/parser';
import type { Conference } from '@/types/conference';

interface UseConferencesReturn {
  conferences: Conference[];
  loading: boolean;
  error: string | null;
}

export function useConferences(): UseConferencesReturn {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const basePath = '';
    fetch(`${basePath}/data/all-data.yaml`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch conferences data');
        }
        return response.text();
      })
      .then((yamlText) => {
        const parsed = parseConferences(yamlText);
        setConferences(parsed);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { conferences, loading, error };
}
