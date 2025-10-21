import { NextResponse } from 'next/server';
import { storeTeamToken, storeTeamMetadata } from '@/slack-bot/lib/teamStorage';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * OAuth Callback Endpoint
 *
 * Slack redirects here after user authorizes the app.
 * We exchange the authorization code for tokens and store them.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  // Handle user denial
  if (error) {
    return NextResponse.json(
      { error: 'Installation cancelled', message: 'You denied the installation request.' },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code', message: 'No authorization code received.' },
      { status: 400 }
    );
  }

  const clientId = process.env.SLACK_CLIENT_ID;
  const clientSecret = process.env.SLACK_CLIENT_SECRET;
  const redirectUri = process.env.SLACK_REDIRECT_URI || `${process.env.APP_URL}/api/slack/oauth/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'Configuration error', message: 'Slack OAuth credentials not configured.' },
      { status: 500 }
    );
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await tokenResponse.json();

    if (!data.ok) {
      console.error('OAuth token exchange failed:', data);
      return NextResponse.json(
        { error: 'Installation failed', message: data.error || 'Unknown error' },
        { status: 400 }
      );
    }

    // Extract team and token information
    const teamId = data.team.id;
    const teamName = data.team.name;
    const botToken = data.access_token;
    const botUserId = data.bot_user_id;

    // Store the bot token for this team
    await storeTeamToken(teamId, botToken);

    // Store team metadata
    await storeTeamMetadata(teamId, {
      teamName,
      botUserId,
      installedAt: new Date().toISOString(),
      scope: data.scope,
      appId: data.app_id,
    });

    console.log(`✅ Bot installed successfully for team: ${teamName} (${teamId})`);

    // Redirect to success page with team name
    const successUrl = new URL('/slack-install/success', request.url);
    successUrl.searchParams.set('team', teamName);

    return NextResponse.redirect(successUrl.toString());
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.json(
      { error: 'Installation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
