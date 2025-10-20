import { NextResponse } from 'next/server';
import { withSlackMiddleware, SlackRequestType } from '@/slack-bot/lib/middleware';
import { acknowledgeResponse } from '@/slack-bot/lib/responses';
import type { SlackInteractionPayload } from '@/types/slack-payloads';
import { getConferenceDetailsById } from '@/slack-bot/lib/conferenceHelpers';
import {
  buildErrorMessage,
  buildSuccessMessage,
  buildSettingsPanel,
} from '@/slack-bot/lib/messageBuilder';
import {
  enableNotifications,
  disableNotifications,
} from '@/slack-bot/lib/userPreferences';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Helper function to send response to Slack with timeout
 */
async function sendToResponseUrl(
  responseUrl: string,
  payload: unknown
): Promise<void> {
  const TIMEOUT_MS = 3000; // 3 second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    await fetch(responseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
  } catch (err) {
    clearTimeout(timeoutId);
    const isTimeout = err instanceof Error && err.name === 'AbortError';
    console.error(
      '[Slack] Failed to send via response_url:',
      isTimeout ? 'Request timeout' : err
    );
    throw err;
  }
}

/**
 * Handle block actions (button clicks, select menus, etc.)
 */
async function handleBlockActions(
  payload: SlackInteractionPayload
): Promise<NextResponse> {
  const actionId = payload.actions?.[0]?.action_id;
  const actionValue = payload.actions?.[0]?.value;
  const userId = payload.user.id;
  const responseUrl = payload.response_url;
  console.log('Block action:', actionId, 'value:', actionValue, 'userId:', userId);

  // Handle details button click
  if (actionId?.startsWith('details_')) {
    const conferenceId = actionValue;
    console.log('[Details] Conference ID:', conferenceId);

    if (!conferenceId) {
      console.error('[Details] Missing conference ID');
      const errorMsg = buildErrorMessage('Invalid conference ID');

      // Send error via response_url if available
      if (responseUrl) {
        await sendToResponseUrl(responseUrl, {
          ...errorMsg,
          response_type: 'in_channel',
          replace_original: false,
        }).catch(() => {/* Error already logged */});
        return new NextResponse('', { status: 200 });
      }

      return NextResponse.json({
        ...errorMsg,
        response_type: 'in_channel',
        replace_original: false,
      });
    }

    try {
      console.log('[Details] Fetching details for:', conferenceId);
      const message = await getConferenceDetailsById(conferenceId);
      console.log('[Details] Message generated:', JSON.stringify(message).substring(0, 200));

      const responsePayload = {
        ...message,
        response_type: 'in_channel',
        replace_original: false,
      };

      console.log('[Details] Sending response with', responsePayload.blocks?.length || 0, 'blocks');

      // Use response_url for delayed response (more reliable for ephemeral messages)
      if (responseUrl) {
        console.log('[Details] Using response_url:', responseUrl);
        await sendToResponseUrl(responseUrl, responsePayload).catch(() => {/* Error already logged */});

        // Acknowledge the interaction immediately
        return new NextResponse('', { status: 200 });
      }

      // Fallback to direct response
      return NextResponse.json(responsePayload);
    } catch (error) {
      console.error('[Details] Error fetching conference details:', error);
      const errorMsg = buildErrorMessage('Failed to fetch conference details. Please try again.');

      if (responseUrl) {
        await sendToResponseUrl(responseUrl, {
          ...errorMsg,
          response_type: 'in_channel',
          replace_original: false,
        }).catch(() => {/* Error already logged */});
        return new NextResponse('', { status: 200 });
      }

      return NextResponse.json({
        ...errorMsg,
        response_type: 'in_channel',
        replace_original: false,
      });
    }
  }

  // Handle enable notifications button
  if (actionId === 'enable_notifications') {
    try {
      const prefs = await enableNotifications(userId);
      const message = buildSettingsPanel(prefs);
      const responsePayload = {
        ...message,
        response_type: 'in_channel',
        replace_original: true,
      };

      if (responseUrl) {
        await sendToResponseUrl(responseUrl, responsePayload).catch(() => {/* Error already logged */});
        return new NextResponse('', { status: 200 });
      }

      return NextResponse.json(responsePayload);
    } catch (error) {
      console.error('Error enabling notifications:', error);
      const errorMsg = buildErrorMessage('Failed to enable notifications. Please try again.');
      const responsePayload = {
        ...errorMsg,
        response_type: 'in_channel',
        replace_original: false,
      };

      if (responseUrl) {
        await sendToResponseUrl(responseUrl, responsePayload).catch(() => {/* Error already logged */});
        return new NextResponse('', { status: 200 });
      }

      return NextResponse.json(responsePayload);
    }
  }

  // Handle disable notifications button
  if (actionId === 'disable_notifications') {
    try {
      const prefs = await disableNotifications(userId);
      const message = buildSettingsPanel(prefs);
      const responsePayload = {
        ...message,
        response_type: 'in_channel',
        replace_original: true,
      };

      if (responseUrl) {
        await sendToResponseUrl(responseUrl, responsePayload).catch(() => {/* Error already logged */});
        return new NextResponse('', { status: 200 });
      }

      return NextResponse.json(responsePayload);
    } catch (error) {
      console.error('Error disabling notifications:', error);
      const errorMsg = buildErrorMessage('Failed to disable notifications. Please try again.');
      const responsePayload = {
        ...errorMsg,
        response_type: 'in_channel',
        replace_original: false,
      };

      if (responseUrl) {
        await sendToResponseUrl(responseUrl, responsePayload).catch(() => {/* Error already logged */});
        return new NextResponse('', { status: 200 });
      }

      return NextResponse.json(responsePayload);
    }
  }

  // Handle calendar button click
  if (actionId?.startsWith('calendar_')) {
    const conferenceId = actionValue;
    // Use public production URL for calendar links
    // Priority: APP_URL (custom domain) > VERCEL_PROJECT_PRODUCTION_URL (vercel.app domain) > localhost
    const baseUrl = process.env.APP_URL
      || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null)
      || 'http://localhost:3000';
    const calendarUrl = `${baseUrl}/api/calendar/${conferenceId}`;

    const message = buildSuccessMessage(
      `To add this conference to your calendar, visit:\n${calendarUrl}\n\nThis will download an ICS file that you can import into your calendar app.`
    );

    const responsePayload = {
      ...message,
      response_type: 'in_channel',
      replace_original: false,
    };

    // Use response_url for delayed response (more reliable for ephemeral messages)
    if (responseUrl) {
      console.log('[Calendar] Using response_url for conference:', conferenceId);
      await sendToResponseUrl(responseUrl, responsePayload).catch(() => {/* Error already logged */});

      // Acknowledge the interaction immediately
      return new NextResponse('', { status: 200 });
    }

    // Fallback to direct response
    return NextResponse.json(responsePayload);
  }

  // Handle edit subjects button
  // TODO: Implement modal for editing subjects
  // This requires opening a Slack modal (views.open API call) with checkboxes for each subject
  // The modal submission would be handled in handleViewSubmission below
  if (actionId === 'edit_subjects') {
    const message = buildErrorMessage(
      'Subject editing is coming soon! For now, use the web interface to manage your subject preferences.'
    );
    const responsePayload = {
      ...message,
      response_type: 'in_channel',
      replace_original: false,
    };

    if (responseUrl) {
      await sendToResponseUrl(responseUrl, responsePayload).catch(() => {/* Error already logged */});
      return new NextResponse('', { status: 200 });
    }

    return NextResponse.json(responsePayload);
  }

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

  // Future feature: Handle modal submissions
  // Potential modals to implement:
  // - 'edit_subjects_modal': Allow users to select/deselect subject preferences
  //   via checkboxes in a Slack modal (triggered by edit_subjects button)
  // - 'edit_reminder_days_modal': Customize reminder day preferences
  // - 'edit_timezone_modal': Select timezone from a dropdown
  //
  // Implementation requires:
  // 1. Creating modal views using Slack Block Kit
  // 2. Opening modals via Slack Web API (views.open) in handleBlockActions
  // 3. Parsing modal state values here and updating user preferences
  // 4. Requires SLACK_BOT_TOKEN to be configured for API calls

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
