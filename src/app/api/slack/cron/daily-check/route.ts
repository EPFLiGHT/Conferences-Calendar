import { NextResponse } from 'next/server';
import { withSlackMiddleware, SlackRequestType } from '@/slack-bot/lib/middleware';
import { successResponse, errorResponse } from '@/slack-bot/lib/responses';
import { getConferences } from '@/slack-bot/utils/conferenceCache';
import { getAllUsersWithNotifications } from '@/slack-bot/lib/userPreferences';
import { sendDM } from '@/slack-bot/lib/slackClient';
import { buildUserDeadlineNotification } from '@/slack-bot/lib/messageBuilder';
import { getDeadlinesWithinDays, filterBySubject } from '@/utils/conferenceQueries';
import { logger } from '@/slack-bot/utils/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * This endpoint should be called by a cron job (e.g., Vercel Cron)
 * It checks for upcoming deadlines and sends notifications to subscribed users
 */
async function handleDailyCheck(): Promise<NextResponse> {
  try {
    // Get all conferences
    const allConferences = await getConferences();

    // Get all users with notifications enabled
    const users = await getAllUsersWithNotifications();

    logger.info('Running daily notification check', {
      totalUsers: users.length,
      totalConferences: allConferences.length
    });

    let notificationsSent = 0;
    const errors: Array<{ userId: string; error: string }> = [];

    // Process each user
    for (const user of users) {
      // Validate user has slackUserId early
      if (!user.slackUserId) {
        logger.warn('User missing slackUserId', { user });
        continue;
      }

      const userId = user.slackUserId; // Type narrowing, available in both try and catch

      try {
        // Filter conferences by user's subject preferences (if any)
        let userConferences = allConferences;
        if (user.subjects && user.subjects.length > 0) {
          userConferences = user.subjects.flatMap(subject =>
            filterBySubject(allConferences, subject)
          );
          // Remove duplicates
          userConferences = Array.from(new Map(
            userConferences.map(c => [c.id, c])
          ).values());
        }

        // Find the maximum reminder day threshold for this user
        const maxReminderDays = Math.max(...user.reminderDays);

        // Get deadlines within the user's reminder window
        const upcomingDeadlines = getDeadlinesWithinDays(
          userConferences,
          maxReminderDays
        );

        // Filter to only include deadlines matching user's specific reminder days
        const relevantDeadlines = upcomingDeadlines.filter(item =>
          user.reminderDays.some(reminderDay => {
            // Notify if deadline is exactly N days away (within a margin)
            // or if it's the last reminder before the deadline
            const isReminderDay = Math.abs(item.daysLeft - reminderDay) <= 1;
            return isReminderDay || item.daysLeft <= Math.min(...user.reminderDays);
          })
        );

        if (relevantDeadlines.length === 0) {
          logger.debug('No relevant deadlines for user', { userId });
          continue;
        }

        // Build and send notification
        // Note: In multi-workspace mode, user.teamId should be stored with preferences
        // For now, this will use the token fallback mechanism
        const message = buildUserDeadlineNotification(relevantDeadlines);
        await sendDM(userId, message.blocks, message.text, user.teamId);

        notificationsSent++;
        logger.info('Sent notification to user', {
          userId,
          deadlineCount: relevantDeadlines.length
        });

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('Failed to send notification to user', error, {
          userId
        });
        errors.push({
          userId,
          error: errorMessage
        });
      }
    }

    logger.info('Daily notification check completed', {
      totalUsers: users.length,
      notificationsSent,
      errors: errors.length
    });

    return successResponse({
      success: true,
      totalUsers: users.length,
      notificationsSent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    logger.error('Error in daily check cron', error);
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
