import { NextResponse } from 'next/server';

/**
 * OAuth Installation Endpoint
 *
 * This endpoint initiates the Slack OAuth flow by redirecting users to Slack's
 * authorization page. Users will be prompted to install the bot in their workspace.
 */
export async function GET(request: Request) {
  const clientId = process.env.SLACK_CLIENT_ID;
  const redirectUri = process.env.SLACK_REDIRECT_URI || `${process.env.APP_URL}/api/slack/oauth/callback`;

  if (!clientId) {
    return NextResponse.json(
      { error: 'Slack client ID not configured' },
      { status: 500 }
    );
  }

  // Scopes required for the bot
  const scopes = [
    'chat:write',
    'chat:write.public',
    'commands',
    'users:read',
    'users:read.email',
    'app_mentions:read',
    'im:read',
    'channels:read',
  ].join(',');

  // Build the Slack OAuth authorization URL
  const slackAuthUrl = new URL('https://slack.com/oauth/v2/authorize');
  slackAuthUrl.searchParams.set('client_id', clientId);
  slackAuthUrl.searchParams.set('scope', scopes);
  slackAuthUrl.searchParams.set('redirect_uri', redirectUri);

  // Optional: Add state parameter for CSRF protection
  const url = new URL(request.url);
  const state = url.searchParams.get('state');
  if (state) {
    slackAuthUrl.searchParams.set('state', state);
  }

  // Redirect to Slack's authorization page
  return NextResponse.redirect(slackAuthUrl.toString());
}
