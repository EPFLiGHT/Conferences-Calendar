import { NextResponse } from 'next/server';
import { withSlackMiddleware, SlackRequestType } from '@/slack-bot/lib/middleware';
import { acknowledgeResponse } from '@/slack-bot/lib/responses';
import type { SlackInteractionPayload } from '@/types/slack-payloads';

/**
 * Handle block actions (button clicks, select menus, etc.)
 */
async function handleBlockActions(
  payload: SlackInteractionPayload
): Promise<NextResponse> {
  const actionId = payload.actions?.[0]?.action_id;
  console.log('Block action:', actionId);

  // TODO: Add handlers for specific actions
  // Example:
  // if (actionId === 'subscribe_button') {
  //   await handleSubscribeAction(payload);
  // }

  return acknowledgeResponse();
}

/**
 * Handle modal submissions
 */
async function handleViewSubmission(
  payload: SlackInteractionPayload
): Promise<NextResponse> {
  const callbackId = payload.view?.callback_id;
  console.log('View submission:', callbackId);

  // TODO: Add handlers for specific modal submissions
  // Example:
  // if (callbackId === 'settings_modal') {
  //   await handleSettingsSubmission(payload);
  // }

  return acknowledgeResponse();
}

/**
 * Handle modal closures
 */
async function handleViewClosed(
  payload: SlackInteractionPayload
): Promise<NextResponse> {
  console.log('View closed:', payload.view?.callback_id);
  return acknowledgeResponse();
}

/**
 * Main interaction handler - routes to specific handlers based on type
 */
async function handleInteraction(
  payload: SlackInteractionPayload
): Promise<NextResponse> {
  // Route to appropriate handler based on interaction type
  switch (payload.type) {
    case 'block_actions':
      return handleBlockActions(payload);

    case 'view_submission':
      return handleViewSubmission(payload);

    case 'view_closed':
      return handleViewClosed(payload);

    case 'shortcut':
      console.log('Shortcut triggered:', payload);
      return acknowledgeResponse();

    default:
      console.log('Unknown interaction type:', payload.type);
      return acknowledgeResponse();
  }
}

export const POST = withSlackMiddleware<SlackInteractionPayload>({
  requestType: SlackRequestType.FORM_URLENCODED,
  handler: handleInteraction,
});
