/**
 * Conference Data Cache
 * Caches conference data in Vercel KV to reduce YAML parsing overhead
 */

// @ts-ignore - @vercel/kv will be installed when deploying to Vercel
import { kv } from '@vercel/kv';
import type { Conference } from '@/types/conference';
import { parseConferences } from '@/utils/parser';
import { logger } from './logger';
import { NOTIFICATION_CONFIG } from '../config/constants';

const CACHE_KEY = 'conferences:data';
const CACHE_TIMESTAMP_KEY = 'conferences:timestamp';

/**
 * Fetch conferences from cache or parse from YAML
 */
export async function getConferences(): Promise<Conference[]> {
  try {
    // Try cache first
    const cached = await kv.get<Conference[]>(CACHE_KEY);
    if (cached && cached.length > 0) {
      logger.debug('Conferences loaded from cache', { count: cached.length });
      return cached;
    }

    // Cache miss - fetch and parse YAML
    logger.info('Cache miss - fetching conferences from YAML');
    const conferences = await fetchAndParseYAML();

    // Cache the result
    await cacheConferences(conferences);

    return conferences;
  } catch (error) {
    logger.error('Failed to get conferences', error);
    throw error;
  }
}

/**
 * Fetch YAML from URL and parse
 */
async function fetchAndParseYAML(): Promise<Conference[]> {
  try {
    const baseUrl = process.env.CONFERENCES_DATA_URL;
    const yamlUrl = `${baseUrl}/data/conferences.yaml`;

    logger.info('Fetching conference data', { url: yamlUrl });

    const response = await fetch(yamlUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch YAML: ${response.status} ${response.statusText}`);
    }

    const yamlText = await response.text();
    const conferences = parseConferences(yamlText);

    logger.info('Conferences parsed successfully', { count: conferences.length });
    return conferences;
  } catch (error) {
    logger.error('Failed to fetch and parse YAML', error);
    throw error;
  }
}

/**
 * Cache conferences with TTL
 */
async function cacheConferences(conferences: Conference[]): Promise<void> {
  try {
    const ttl = NOTIFICATION_CONFIG.CACHE_TTL_SECONDS;
    await kv.set(CACHE_KEY, conferences, { ex: ttl });
    await kv.set(CACHE_TIMESTAMP_KEY, new Date().toISOString(), { ex: ttl });
    logger.info('Conferences cached', { count: conferences.length, ttl });
  } catch (error) {
    logger.error('Failed to cache conferences', error);
    // Non-fatal error - continue without caching
  }
}

/**
 * Invalidate conference cache (force refresh)
 */
export async function invalidateCache(): Promise<void> {
  try {
    await kv.del(CACHE_KEY);
    await kv.del(CACHE_TIMESTAMP_KEY);
    logger.info('Conference cache invalidated');
  } catch (error) {
    logger.error('Failed to invalidate cache', error);
  }
}

/**
 * Get cache status
 */
export async function getCacheStatus(): Promise<{
  cached: boolean;
  timestamp: string | null;
  count: number;
}> {
  try {
    const data = await kv.get<Conference[]>(CACHE_KEY);
    const timestamp = await kv.get<string>(CACHE_TIMESTAMP_KEY);

    return {
      cached: data !== null,
      timestamp,
      count: data?.length || 0,
    };
  } catch (error) {
    logger.error('Failed to get cache status', error);
    return { cached: false, timestamp: null, count: 0 };
  }
}
