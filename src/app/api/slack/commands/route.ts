import { NextResponse } from 'next/server';
import { withSlackMiddleware, SlackRequestType } from '@/slack-bot/lib/middleware';
import { textResponse, badRequestResponse } from '@/slack-bot/lib/responses';
import type { SlackCommandPayload } from '@/types/slack-payloads';
import { handleHelp } from '@/slack-bot/commands/user/help';
import { handleUpcoming } from '@/slack-bot/commands/user/upcoming';
import { handleSearch } from '@/slack-bot/commands/user/search';
import { handleSubscribe } from '@/slack-bot/commands/user/subscribe';
import { handleUnsubscribe } from '@/slack-bot/commands/user/unsubscribe';
import { handleSettings } from '@/slack-bot/commands/user/settings';
import { handleSubject } from '@/slack-bot/commands/user/subject';
import { handleInfo } from '@/slack-bot/commands/user/info';
import { handleClear } from '@/slack-bot/commands/user/clear';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Command router - maps slash commands to their handlers
 */
const commandHandlers: Record<
  string,
  (userId: string, text: string) => Promise<unknown>
> = {
  '/conf-help': (userId) => handleHelp(userId),
  '/conf-upcoming': (userId) => handleUpcoming(userId),
  '/conf-search': (userId, text) => handleSearch(userId, text),
  '/conf-subscribe': (userId) => handleSubscribe(userId),
  '/conf-unsubscribe': (userId) => handleUnsubscribe(userId),
  '/conf-settings': (userId) => handleSettings(userId),
  '/conf-subject': (userId, text) => handleSubject(userId, text),
  '/conf-info': (userId, text) => handleInfo(userId, text),
  '/conf-clear': (userId) => handleClear(userId),
};

/**
 * POST handler for Slack slash commands
 */
async function handleSlashCommand(
  payload: SlackCommandPayload
): Promise<NextResponse> {
  const { command, text = '', user_id: userId } = payload;

  if (!userId) {
    return badRequestResponse('Missing user information');
  }

  const handler = commandHandlers[command];

  if (!handler) {
    return textResponse(
      `Unknown command: ${command}. Use \`/conf-help\` to see available commands.`
    );
  }

  try {
    const result = await handler(userId, text);
    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error handling command ${command}:`, error);
    return textResponse('An error occurred processing your command');
  }
}

export const POST = withSlackMiddleware<SlackCommandPayload>({
  requestType: SlackRequestType.FORM_URLENCODED,
  handler: handleSlashCommand,
});
