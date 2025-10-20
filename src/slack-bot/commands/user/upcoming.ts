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
      const conferences = await getConferences();
      const upcoming = getUpcomingDeadlines(conferences, 5);
      const message = buildDeadlineList(upcoming);

      return {
        ...message,
        response_type: 'in_channel',
      };
    },
    'Failed to fetch upcoming deadlines. Please try again later.'
  );
}
