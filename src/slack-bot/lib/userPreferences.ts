/**
 * User Preferences Management
 * Uses Vercel KV (Redis) for storing user settings
 */

// @ts-ignore - @vercel/kv will be installed when deploying to Vercel
import { kv } from '@vercel/kv';
import type { UserPreferences } from '@/types/slack';
import { logger } from '../utils/logger';
import { NOTIFICATION_CONFIG } from '../config/constants';

const USER_KEY_PREFIX = 'user:';
const USERS_LIST_KEY = 'users:all';

/**
 * Get user preferences
 */
export async function getUserPreferences(
  userId: string
): Promise<UserPreferences | null> {
  try {
    const key = `${USER_KEY_PREFIX}${userId}`;
    const prefs = await kv.get<UserPreferences>(key);
    return prefs;
  } catch (error) {
    logger.error('Failed to get user preferences', error, { userId });
    return null;
  }
}

/**
 * Create default user preferences
 */
function createDefaultPreferences(userId: string): UserPreferences {
  const now = new Date().toISOString();
  return {
    slackUserId: userId,
    notificationsEnabled: false,
    timezone: NOTIFICATION_CONFIG.DEFAULT_TIMEZONE,
    reminderDays: [...NOTIFICATION_CONFIG.DEFAULT_REMINDER_DAYS],
    subjects: [],
    lastNotified: now,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Update user preferences (creates if doesn't exist)
 */
export async function updateUserPreferences(
  userId: string,
  updates: Partial<Omit<UserPreferences, 'slackUserId' | 'createdAt'>>
): Promise<UserPreferences> {
  try {
    const key = `${USER_KEY_PREFIX}${userId}`;
    const existing = await getUserPreferences(userId);

    const prefs: UserPreferences = existing
      ? {
          ...existing,
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      : {
          ...createDefaultPreferences(userId),
          ...updates,
        };

    await kv.set(key, prefs);

    // Add to users list for bulk operations
    await kv.sadd(USERS_LIST_KEY, userId);

    logger.info('User preferences updated', { userId, updates });
    return prefs;
  } catch (error) {
    logger.error('Failed to update user preferences', error, { userId });
    throw error;
  }
}

/**
 * Enable notifications for user
 */
export async function enableNotifications(userId: string): Promise<UserPreferences> {
  return updateUserPreferences(userId, { notificationsEnabled: true });
}

/**
 * Disable notifications for user
 */
export async function disableNotifications(userId: string): Promise<UserPreferences> {
  return updateUserPreferences(userId, { notificationsEnabled: false });
}

/**
 * Update user's subscribed subjects
 */
export async function updateSubjects(
  userId: string,
  subjects: string[]
): Promise<UserPreferences> {
  return updateUserPreferences(userId, { subjects });
}

/**
 * Update user's reminder days
 */
export async function updateReminderDays(
  userId: string,
  reminderDays: number[]
): Promise<UserPreferences> {
  return updateUserPreferences(userId, { reminderDays });
}

/**
 * Update user's timezone
 */
export async function updateTimezone(
  userId: string,
  timezone: string
): Promise<UserPreferences> {
  return updateUserPreferences(userId, { timezone });
}

/**
 * Get all users with notifications enabled
 */
export async function getAllUsersWithNotifications(): Promise<UserPreferences[]> {
  try {
    const userIds = await kv.smembers(USERS_LIST_KEY);
    if (!userIds || userIds.length === 0) return [];

    const users = await Promise.all(
      userIds.map(async (userId: string) => {
        const key = `${USER_KEY_PREFIX}${userId}`;
        return kv.get<UserPreferences>(key);
      })
    );

    return users.filter(
      (user: UserPreferences | null): user is UserPreferences =>
        user !== null && user.notificationsEnabled
    );
  } catch (error) {
    logger.error('Failed to get users with notifications', error);
    return [];
  }
}

/**
 * Delete user preferences
 */
export async function deleteUserPreferences(userId: string): Promise<void> {
  try {
    const key = `${USER_KEY_PREFIX}${userId}`;
    await kv.del(key);
    await kv.srem(USERS_LIST_KEY, userId);
    logger.info('User preferences deleted', { userId });
  } catch (error) {
    logger.error('Failed to delete user preferences', error, { userId });
    throw error;
  }
}

/**
 * Get total user count
 */
export async function getUserCount(): Promise<number> {
  try {
    const count = await kv.scard(USERS_LIST_KEY);
    return count || 0;
  } catch (error) {
    logger.error('Failed to get user count', error);
    return 0;
  }
}
