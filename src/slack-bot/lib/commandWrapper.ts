/**
 * Command Wrapper Utility
 * Provides standardized error handling and logging for Slack bot commands
 */

import type { BlockKitMessage } from '@/types/slack';
import { logger } from '../utils/logger';
import { buildErrorMessage } from './messageBuilder';

/**
 * Wraps command handlers with error handling and logging
 */
export async function withCommandHandler<T>(
  commandName: string,
  userId: string,
  handler: () => Promise<T>,
  errorMessage: string,
  meta?: Record<string, any>
): Promise<T | BlockKitMessage> {
  try {
    logger.info(`Handling ${commandName} command`, { userId, ...meta });
    return await handler();
  } catch (error) {
    logger.error(`Error in ${commandName} command`, error, { userId, ...meta });
    return buildErrorMessage(errorMessage);
  }
}
