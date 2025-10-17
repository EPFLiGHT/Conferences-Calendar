/**
 * /conf upcoming command
 * Shows the next 5 upcoming conference deadlines
 */

import type { BlockKitMessage } from '@/types/slack';
import { getConferences } from '../../utils/conferenceCache';
import { getUpcomingDeadlines } from '@/utils/conferenceQueries';
import { buildDeadlineList } from '../../lib/messageBuilder';
import { withCommandHandler } from '../../lib/commandWrapper';

export async function handleUpcoming(userId: string): Promise<BlockKitMessage> {
  return withCommandHandler(
    'upcoming',
    userId,
    async () => {
      // Fetch conferences
      const conferences = await getConferences();

      // Get upcoming deadlines (limit to 5)
      const upcoming = getUpcomingDeadlines(conferences, 5);

      // Build response message
      const message = buildDeadlineList(upcoming);

      return {
        ...message,
        response_type: 'ephemeral', // Only visible to user
      };
    },
    'Failed to fetch upcoming deadlines. Please try again later.'
  );
}
