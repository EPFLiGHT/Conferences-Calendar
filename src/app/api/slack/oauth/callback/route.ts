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
    return new NextResponse(
      `<html><body><h1>Installation Cancelled</h1><p>You denied the installation request.</p></body></html>`,
      { headers: { 'Content-Type': 'text/html' }, status: 400 }
    );
  }

  if (!code) {
    return new NextResponse(
      `<html><body><h1>Error</h1><p>No authorization code received.</p></body></html>`,
      { headers: { 'Content-Type': 'text/html' }, status: 400 }
    );
  }

  const clientId = process.env.SLACK_CLIENT_ID;
  const clientSecret = process.env.SLACK_CLIENT_SECRET;
  const redirectUri = process.env.SLACK_REDIRECT_URI || `${process.env.APP_URL}/api/slack/oauth/callback`;

  if (!clientId || !clientSecret) {
    return new NextResponse(
      `<html><body><h1>Configuration Error</h1><p>Slack OAuth credentials not configured.</p></body></html>`,
      { headers: { 'Content-Type': 'text/html' }, status: 500 }
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
      return new NextResponse(
        `<html><body><h1>Installation Failed</h1><p>Error: ${data.error || 'Unknown error'}</p></body></html>`,
        { headers: { 'Content-Type': 'text/html' }, status: 400 }
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

    // Success page
    return new NextResponse(
      `<html>
        <head>
          <title>Installation Successful</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              padding: 3rem;
              border-radius: 12px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              text-align: center;
              max-width: 500px;
            }
            h1 {
              color: #2c2d30;
              margin-bottom: 1rem;
            }
            p {
              color: #666;
              line-height: 1.6;
            }
            .emoji {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
            .team-name {
              font-weight: bold;
              color: #667eea;
            }
            .button {
              display: inline-block;
              margin-top: 1.5rem;
              padding: 12px 24px;
              background: #667eea;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 500;
              transition: background 0.2s;
            }
            .button:hover {
              background: #5568d3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="emoji">🎉</div>
            <h1>Installation Successful!</h1>
            <p>
              The Conferences Calendar Bot has been successfully installed to
              <span class="team-name">${teamName}</span>.
            </p>
            <p>
              Try it out by typing <code>/conf-help</code> in any channel!
            </p>
            <a href="slack://open" class="button">Open Slack</a>
          </div>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error) {
    console.error('OAuth callback error:', error);
    return new NextResponse(
      `<html><body><h1>Error</h1><p>An unexpected error occurred during installation.</p></body></html>`,
      { headers: { 'Content-Type': 'text/html' }, status: 500 }
    );
  }
}
