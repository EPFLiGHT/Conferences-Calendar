/**
 * /conf info <conference-id> command
 * Get detailed information about a specific conference
 */

import type { BlockKitMessage } from '@/types/slack';
import { getConferences } from '../../utils/conferenceCache';
import { getNextDeadline } from '@/utils/parser';
import { buildConferenceCard, buildErrorMessage } from '../../lib/messageBuilder';
import { withCommandHandler } from '../../lib/commandWrapper';

export async function handleInfo(userId: string, conferenceId: string): Promise<BlockKitMessage> {
  // Validate input before wrapping
  if (!conferenceId || conferenceId.trim() === '') {
    return buildErrorMessage(
      'Please provide a conference ID. Example: `/conf info cvpr25`\n\nYou can find conference IDs in the deadline lists.'
    );
  }

  return withCommandHandler(
    'info',
    userId,
    async () => {
      // Fetch conferences
      const conferences = await getConferences();

      // Find conference by ID
      const conference = conferences.find((c) => c.id === conferenceId.toLowerCase());

      if (!conference) {
        return buildErrorMessage(
          `Conference "${conferenceId}" not found.\n\nUse \`/conf search ${conferenceId}\` to find similar conferences.`
        );
      }

      // Get deadline info
      const deadline = getNextDeadline(conference);

      if (!deadline) {
        return {
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `📅 *${conference.title} ${conference.year}*\n\n${conference.full_name}\n\n❌ No upcoming deadlines available for this conference.`,
              },
            },
          ],
          text: `${conference.title} ${conference.year} - No deadlines`,
          response_type: 'ephemeral',
        };
      }

      // Build detailed conference card
      return buildConferenceCard(conference, deadline);
    },
    'Failed to fetch conference information. Please try again later.',
    { conferenceId }
  );
}
