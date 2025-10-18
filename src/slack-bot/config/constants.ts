/**
 * Slack Bot Configuration Constants
 */

export const BOT_CONFIG = {
  NAME: 'ConferenceBot',
  EMOJI: '📅',
  VERSION: '1.0.0',
} as const;
export const NOTIFICATION_CONFIG = {
  DEFAULT_REMINDER_DAYS: [1, 3, 7],
  DEFAULT_TIMEZONE: 'UTC',
  MAX_CONFERENCES_PER_MESSAGE: 10,
  CACHE_TTL_SECONDS: 300, // 5 minutes
} as const;

export const COMMAND_DESCRIPTIONS = {
  upcoming: 'Show upcoming conference deadlines',
  search: 'Search conferences by name',
  subject: 'Filter conferences by subject (ML, CV, NLP, SEC, etc.)',
  info: 'Get detailed information about a specific conference',
  subscribe: 'Enable deadline notifications',
  unsubscribe: 'Disable deadline notifications',
  settings: 'View and update your notification preferences',
  test: 'Send a test notification to yourself',
  help: 'Show all available commands',
} as const;

export const URGENCY_CONFIG = {
  CRITICAL_DAYS: 1,
  URGENT_DAYS: 3,
  UPCOMING_DAYS: 7,
} as const;

export const URGENCY_EMOJIS = {
  critical: '🔴',
  urgent: '🟡',
  upcoming: '🟢',
} as const;

// Re-export SUBJECT_EMOJIS from unified constants for convenience
export { SUBJECT_EMOJIS } from '@/constants/subjects';
