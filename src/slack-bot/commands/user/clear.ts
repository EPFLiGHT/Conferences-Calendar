/**
 * /conf clear command
 * Clear the conversation with the bot
 */

import type { BlockKitMessage } from '@/types/slack';
import { logger } from '../../utils/logger';

export async function handleClear(userId: string): Promise<BlockKitMessage> {
  logger.info('Handling clear command', { userId });

  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '🧹 *Conversation cleared!*\n\nYour chat history with ConferenceBot has been reset. Use `/conf help` to see available commands.',
        },
      },
    ],
    text: 'Conversation cleared',
    response_type: 'ephemeral',
  };
}
