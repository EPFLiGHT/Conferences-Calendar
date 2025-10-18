import { NextResponse } from 'next/server';
import { withSlackMiddleware, SlackRequestType } from '@/slack-bot/lib/middleware';
import { acknowledgeResponse } from '@/slack-bot/lib/responses';
import type { SlackEventPayload } from '@/types/slack-payloads';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Handle Slack Event API callbacks
 */
async function handleSlackEvent(
  payload: SlackEventPayload
): Promise<NextResponse> {
  // Slack sends this when setting up the Events API
  if (payload.type === 'url_verification') {
    return NextResponse.json({ challenge: payload.challenge });
  }

  if (payload.type === 'event_callback' && payload.event) {
    console.log('Received event:', payload.event.type);

    // Future feature: Handle Slack events
    // Potential events to implement:
    // - app_mention: Respond when bot is @mentioned in a channel
    // - message: Respond to DMs or specific message patterns
    // - app_home_opened: Show custom home tab with personalized deadlines
    // These would require additional Slack OAuth scopes and event subscriptions
    // to be configured in the Slack App settings

    return acknowledgeResponse();
  }

  return acknowledgeResponse();
}

export const POST = withSlackMiddleware<SlackEventPayload>({
  requestType: SlackRequestType.JSON,
  handler: handleSlackEvent,
});
