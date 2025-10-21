/**
 * Channel Reminders Cron Job
 * Posts upcoming conference deadlines to a configured Slack channel
 *
 * Uses smart filtering to only post when deadlines are within specific reminder days
 * (e.g., 30, 7, 3 days before deadline), similar to DM notifications.
 * This prevents spamming the channel with the same deadlines every day.
 */

import { NextResponse } from 'next/server';
import { withSlackMiddleware, SlackRequestType } from '@/slack-bot/lib/middleware';
import { getConferences } from '@/slack-bot/utils/conferenceCache';
import { getDeadlinesWithinDays } from '@/utils/conferenceQueries';
import { postToChannel } from '@/slack-bot/lib/slackClient';
import { buildUserDeadlineNotification } from '@/slack-bot/lib/messageBuilder';
import { logger } from '@/slack-bot/utils/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Default reminder days for channel notifications
 * Will notify when deadlines are exactly these days away (±1 day margin)
 */
const DEFAULT_CHANNEL_REMINDER_DAYS = [30, 7, 3];

/**
 * GET handler for the cron job
 * Protected by Vercel Cron secret or authorization header
 */
async function handleChannelReminders(): Promise<NextResponse> {
  try {
    const channelId = process.env.SLACK_REMINDERS_CHANNEL_ID;

    if (!channelId) {
      logger.error('SLACK_REMINDERS_CHANNEL_ID not configured');
      return NextResponse.json(
        { error: 'Channel ID not configured' },
        { status: 500 }
      );
    }

    // Parse reminder days from environment or use defaults
    const reminderDaysStr = process.env.CHANNEL_REMINDER_DAYS || '';
    const reminderDays = reminderDaysStr
      ? reminderDaysStr.split(',').map(d => parseInt(d.trim(), 10)).filter(d => !isNaN(d))
      : DEFAULT_CHANNEL_REMINDER_DAYS;

    logger.info('Running channel reminders check', {
      channelId,
      reminderDays,
    });

    const allConferences = await getConferences();

    // Find the maximum reminder day threshold
    const maxReminderDays = Math.max(...reminderDays);

    // Get deadlines within the reminder window
    const upcomingDeadlines = getDeadlinesWithinDays(
      allConferences,
      maxReminderDays
    );

    // Filter to only include deadlines matching specific reminder days
    const relevantDeadlines = upcomingDeadlines.filter(item =>
      reminderDays.some(reminderDay => {
        // Notify if deadline is exactly N days away (within a margin)
        // or if it's approaching the last reminder before the deadline
        const isReminderDay = Math.abs(item.daysLeft - reminderDay) <= 1;
        return isReminderDay || item.daysLeft <= Math.min(...reminderDays);
      })
    );

    if (relevantDeadlines.length === 0) {
      logger.info('No relevant deadlines for channel notification', {
        upcomingCount: upcomingDeadlines.length,
        reminderDays,
      });
      return NextResponse.json({
        success: true,
        message: 'No relevant deadlines to post',
        count: 0,
      });
    }

    // Build notification message
    const message = buildUserDeadlineNotification(relevantDeadlines);

    // Customize the header for channel context
    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '📅 Conference Deadline Reminder',
          emoji: true,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Automated daily reminder • ${new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}`,
          },
        ],
      },
      {
        type: 'divider',
      },
      ...message.blocks.slice(3), // Skip the original header and intro, keep the deadline items
      {
        type: 'divider',
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `💡 Use \`/conf details <conference-name>\` for more information or \`/conf subscribe\` to receive personalized DM notifications.`,
          },
        ],
      },
    ];

    // Post to the channel
    await postToChannel(
      channelId,
      blocks,
      `Conference Deadline Reminder: ${relevantDeadlines.length} upcoming ${
        relevantDeadlines.length === 1 ? 'deadline' : 'deadlines'
      }`
    );

    logger.info('Posted deadline reminders to channel', {
      channelId,
      count: relevantDeadlines.length,
      reminderDays,
    });

    return NextResponse.json({
      success: true,
      message: 'Reminders posted successfully',
      count: relevantDeadlines.length,
      channelId,
      reminderDays,
    });
  } catch (error) {
    logger.error('Error in channel reminders cron', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'Failed to post reminders',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

export const GET = withSlackMiddleware({
  requestType: SlackRequestType.CRON,
  handler: handleChannelReminders,
  authConfig: {
    requireAuth: true,
  },
});
