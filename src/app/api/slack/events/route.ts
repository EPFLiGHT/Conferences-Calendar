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
  // Handle URL verification challenge
  if (payload.type === 'url_verification') {
    return NextResponse.json({ challenge: payload.challenge });
  }

  // Handle event callbacks
  if (payload.type === 'event_callback' && payload.event) {
    // Process events asynchronously to respond quickly
    // You can add event handlers here (e.g., app mentions, messages)
    console.log('Received event:', payload.event.type);

    // TODO: Add event handlers for:
    // - app_mention: when the bot is mentioned
    // - message: when messages are sent in channels the bot is in
    // - Add more event types as needed

    // Return 200 immediately to acknowledge receipt
    return acknowledgeResponse();
  }

  // Acknowledge any other event types
  return acknowledgeResponse();
}

export const POST = withSlackMiddleware<SlackEventPayload>({
  requestType: SlackRequestType.JSON,
  handler: handleSlackEvent,
});
