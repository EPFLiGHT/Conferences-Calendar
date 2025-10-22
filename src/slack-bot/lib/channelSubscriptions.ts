/**
 * Channel Subscriptions Management
 * Tracks which channels the bot should post reminders to across all workspaces
 * Uses Vercel KV (Redis) for storage
 */

import { kv } from '@vercel/kv';
import type { ChannelSubscription } from '@/types/slack';
import { logger } from '../utils/logger';

const CHANNEL_KEY_PREFIX = 'channel:';
const CHANNELS_LIST_KEY = 'channels:all';

/**
 * Get channel subscription info
 */
export async function getChannelSubscription(
  channelId: string
): Promise<ChannelSubscription | null> {
  try {
    const key = `${CHANNEL_KEY_PREFIX}${channelId}`;
    const subscription = await kv.get<ChannelSubscription>(key);
    return subscription;
  } catch (error) {
    logger.error('Failed to get channel subscription', error, { channelId });
    return null;
  }
}

/**
 * Subscribe a channel to receive reminders
 */
export async function subscribeChannel(
  channelId: string,
  channelName: string,
  teamId: string,
  addedBy?: string
): Promise<ChannelSubscription> {
  try {
    const key = `${CHANNEL_KEY_PREFIX}${channelId}`;
    const now = new Date().toISOString();

    const subscription: ChannelSubscription = {
      channelId,
      channelName,
      teamId,
      isActive: true,
      addedBy,
      subscribedAt: now,
      lastPostedAt: null,
    };

    await kv.set(key, subscription);

    // Add to global channels list for bulk operations
    await kv.sadd(CHANNELS_LIST_KEY, channelId);

    logger.info('Channel subscribed', { channelId, channelName, teamId });
    return subscription;
  } catch (error) {
    logger.error('Failed to subscribe channel', error, { channelId, teamId });
    throw error;
  }
}

/**
 * Unsubscribe a channel from receiving reminders
 */
export async function unsubscribeChannel(channelId: string): Promise<void> {
  try {
    const key = `${CHANNEL_KEY_PREFIX}${channelId}`;
    await kv.del(key);
    await kv.srem(CHANNELS_LIST_KEY, channelId);
    logger.info('Channel unsubscribed', { channelId });
  } catch (error) {
    logger.error('Failed to unsubscribe channel', error, { channelId });
    throw error;
  }
}

/**
 * Update when a channel was last posted to
 */
export async function updateChannelLastPosted(
  channelId: string
): Promise<void> {
  try {
    const subscription = await getChannelSubscription(channelId);
    if (!subscription) {
      logger.warn('Cannot update last posted time - channel not found', { channelId });
      return;
    }

    const key = `${CHANNEL_KEY_PREFIX}${channelId}`;
    subscription.lastPostedAt = new Date().toISOString();
    await kv.set(key, subscription);
  } catch (error) {
    logger.error('Failed to update channel last posted time', error, { channelId });
  }
}

/**
 * Get all active channel subscriptions
 */
export async function getAllActiveChannels(): Promise<ChannelSubscription[]> {
  try {
    const channelIds = await kv.smembers(CHANNELS_LIST_KEY);
    if (!channelIds || channelIds.length === 0) {
      logger.info('No channel subscriptions found');
      return [];
    }

    const channels = await Promise.all(
      channelIds.map(async (channelId: string) => {
        const key = `${CHANNEL_KEY_PREFIX}${channelId}`;
        return kv.get<ChannelSubscription>(key);
      })
    );

    return channels.filter(
      (channel: ChannelSubscription | null): channel is ChannelSubscription =>
        channel !== null && channel.isActive
    );
  } catch (error) {
    logger.error('Failed to get active channels', error);
    return [];
  }
}

/**
 * Get all subscribed channels for a specific team
 */
export async function getTeamChannels(teamId: string): Promise<ChannelSubscription[]> {
  try {
    const allChannels = await getAllActiveChannels();
    return allChannels.filter(channel => channel.teamId === teamId);
  } catch (error) {
    logger.error('Failed to get team channels', error, { teamId });
    return [];
  }
}

/**
 * Get total channel subscription count
 */
export async function getChannelCount(): Promise<number> {
  try {
    const count = await kv.scard(CHANNELS_LIST_KEY);
    return count || 0;
  } catch (error) {
    logger.error('Failed to get channel count', error);
    return 0;
  }
}
