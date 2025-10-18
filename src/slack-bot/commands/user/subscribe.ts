/**
 * /conf subscribe command
 * Enable deadline notifications for user
 */

import type { BlockKitMessage } from '@/types/slack';
import { enableNotifications } from '../../lib/userPreferences';
import { buildSuccessMessage } from '../../lib/messageBuilder';
import { withCommandHandler } from '../../lib/commandWrapper';

export async function handleSubscribe(userId: string): Promise<BlockKitMessage> {
  return withCommandHandler(
    'subscribe',
    userId,
    async () => {
      const prefs = await enableNotifications(userId);

      return buildSuccessMessage(
        `🔔 *Notifications Enabled!*\n\n` +
          `You'll now receive deadline reminders ${prefs.reminderDays.join(', ')} days before deadlines.\n\n` +
          `Use \`/conf settings\` to customize your preferences.`
      );
    },
    'Failed to enable notifications. Please try again later.'
  );
}
