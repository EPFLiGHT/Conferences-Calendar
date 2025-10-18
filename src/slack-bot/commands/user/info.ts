/**
 * /conf info <conference-id> command
 * Get detailed information about a specific conference
 */

import type { BlockKitMessage } from '@/types/slack';
import { getConferences } from '../../utils/conferenceCache';
import { getNextDeadline } from '@/utils/parser';
import { buildConferenceCard, buildErrorMessage } from '../../lib/messageBuilder';
import { withCommandHandler } from '../../lib/commandWrapper';

export async function handleInfo(userId: string, conferenceQuery: string): Promise<BlockKitMessage> {
  if (!conferenceQuery || conferenceQuery.trim() === '') {
    return buildErrorMessage(
      'Please provide a conference ID or name. Example: `/conf info cvpr25` or `/conf info CVPR`\n\nYou can find conference IDs in the deadline lists.'
    );
  }

  return withCommandHandler(
    'info',
    userId,
    async () => {
      const conferences = await getConferences();
      const normalizedQuery = conferenceQuery.toLowerCase().trim();

      // try exact ID match first
      let conference = conferences.find((c) => c.id === normalizedQuery);

      // fallback to fuzzy search by title or full name
      if (!conference) {
        const queryNoSpaces = normalizedQuery.replace(/\s+/g, '');
        conference = conferences.find((c) => {
          const titleMatch = c.title.toLowerCase().replace(/\s+/g, '');
          const fullNameMatch = c.full_name.toLowerCase().replace(/\s+/g, '');
          return titleMatch === queryNoSpaces || fullNameMatch.includes(queryNoSpaces);
        });
      }

      if (!conference) {
        return buildErrorMessage(
          `Conference "${conferenceQuery}" not found.\n\nUse \`/conf search ${conferenceQuery}\` to find similar conferences.`
        );
      }

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

      return buildConferenceCard(conference, deadline);
    },
    'Failed to fetch conference information. Please try again later.',
    { conferenceQuery }
  );
}
