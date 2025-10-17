import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { DateTime } from 'luxon';
import { withSlackMiddleware, SlackRequestType } from '@/slack-bot/lib/middleware';
import { successResponse, errorResponse } from '@/slack-bot/lib/responses';
import { parseConferences } from '@/utils/parser';
import type { Conference } from '@/types/conference';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * This endpoint should be called by a cron job (e.g., Vercel Cron)
 * It checks for upcoming deadlines and sends notifications to subscribed users
 */
async function handleDailyCheck(): Promise<NextResponse> {
  try {

    // Fetch conference data
    const conferencesResponse = await fetch(
      process.env.CONFERENCES_DATA_URL || 'http://localhost:3000/data/conferences.yaml'
    );

    if (!conferencesResponse.ok) {
      throw new Error('Failed to fetch conferences data');
    }

    const yamlText = await conferencesResponse.text();
    const conferences = parseConferences(yamlText);

    // Get all user subscriptions from KV
    const keys = await kv.keys('user:*:subscriptions');
    const notifications: Array<{ userId: string; teamId: string; conferences: Conference[] }> = [];

    for (const key of keys) {
      const match = key.match(/user:(.+):(.+):subscriptions/);
      if (!match) continue;

      const [, teamId, userId] = match;
      const subscriptions = await kv.smembers(key);

      if (!subscriptions || subscriptions.length === 0) continue;

      // Get user preferences
      const prefsKey = `user:${teamId}:${userId}:prefs`;
      const prefs = await kv.hgetall(prefsKey) as Record<string, string> | null;
      const reminderDays = parseInt(prefs?.reminder_days || '7', 10);

      // Filter conferences for this user's subscriptions and upcoming deadlines
      const now = DateTime.now();
      const upcomingConferences = conferences.filter((conf: Conference) => {
        if (!subscriptions.includes(conf.id)) return false;
        if (!conf.deadline) return false;

        const deadline = DateTime.fromISO(conf.deadline);
        const daysUntil = deadline.diff(now, 'days').days;

        // Notify if deadline is within reminder window
        return daysUntil >= 0 && daysUntil <= reminderDays;
      });

      if (upcomingConferences.length > 0) {
        notifications.push({
          userId,
          teamId,
          conferences: upcomingConferences
        });
      }
    }

    // Send notifications via Slack API
    // This would require the Slack Bot Token and Web API
    // For now, just log what would be sent
    console.log(`Would send ${notifications.length} notifications`);

    return successResponse({
      success: true,
      checked: keys.length,
      notifications: notifications.length,
    });
  } catch (error) {
    console.error('Error in daily check cron:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withSlackMiddleware({
  requestType: SlackRequestType.CRON,
  handler: handleDailyCheck,
  authConfig: {
    requireAuth: true,
  },
});
