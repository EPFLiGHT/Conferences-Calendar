/**
 * Channel Reminders Cron Job
 * Posts upcoming conference deadlines to a configured Slack channel
 *
 * This endpoint should be triggered by Vercel Cron on a schedule (e.g., daily or weekly)
 */

import { NextResponse } from 'next/server';
import { getUpcomingConferencesMessage } from '@/slack-bot/lib/conferenceHelpers';
import { postToChannel } from '@/slack-bot/lib/slackClient';
import { logger } from '@/slack-bot/utils/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET handler for the cron job
 * Protected by Vercel Cron secret or authorization header
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      logger.error('Unauthorized cron request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const channelId = process.env.SLACK_REMINDERS_CHANNEL_ID;

    if (!channelId) {
      logger.error('SLACK_REMINDERS_CHANNEL_ID not configured');
      return NextResponse.json(
        { error: 'Channel ID not configured' },
        { status: 500 }
      );
    }

    const upcomingCount = parseInt(process.env.REMINDERS_COUNT || '10', 10);
    const message = await getUpcomingConferencesMessage(upcomingCount);

    if (!message.blocks || message.blocks.length === 0) {
      logger.info('No upcoming deadlines to post');
      return NextResponse.json({
        success: true,
        message: 'No upcoming deadlines',
        count: 0,
      });
    }

    // Add a header to make it clear this is an automated reminder
    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '📅 Upcoming Conference Deadlines',
          emoji: true,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Automated reminder • ${new Date().toLocaleDateString('en-US', {
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
      ...message.blocks.slice(1), // Skip the original header
    ];

    // Count conferences from the blocks (estimate)
    const conferenceCount = message.blocks.filter((b: any) => b.type === 'section' && b.text?.text?.includes('*')).length;

    // Post to the channel
    await postToChannel(
      channelId,
      blocks,
      `Upcoming Conference Deadlines (${conferenceCount} conferences)`
    );

    logger.info('Posted upcoming deadlines to channel', {
      channelId,
      count: conferenceCount,
    });

    return NextResponse.json({
      success: true,
      message: 'Reminders posted successfully',
      count: conferenceCount,
      channelId,
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
