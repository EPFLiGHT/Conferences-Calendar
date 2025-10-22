# OAuth Setup Guide

This guide explains how to configure your Slack bot for multi-workspace installation using OAuth 2.0.

## Overview

With OAuth enabled, your bot can be installed to **any Slack workspace** using an "Add to Slack" button. The bot will automatically manage tokens for multiple workspaces.

## Prerequisites

1. A deployed instance of your app (e.g., on Vercel)
2. Access to your Slack App configuration at [api.slack.com/apps](https://api.slack.com/apps)
3. Vercel KV (Redis) configured for token storage

---

## Step 1: Configure OAuth in Slack App Settings

### 1.1 Navigate to OAuth & Permissions

Go to [api.slack.com/apps](https://api.slack.com/apps) → Select your app → **OAuth & Permissions**

### 1.2 Add Redirect URL

Add this redirect URL:
```
https://your-app-domain.vercel.app/api/slack/oauth/callback
```

Replace `your-app-domain.vercel.app` with your actual deployment URL.

### 1.3 Configure Bot Token Scopes

Ensure you have these scopes enabled:
- `chat:write` - Send messages to conversations
- `chat:write.public` - Send messages to channels bot isn't in
- `commands` - Receive slash commands
- `users:read` - View basic user information
- `users:read.email` - View user email addresses
- `app_mentions:read` - View messages mentioning your app
- `im:read` - View DM messages
- `channels:read` - View channels

---

## Step 2: Get OAuth Credentials

### 2.1 Get Client ID and Client Secret

Navigate to **Basic Information** → **App Credentials**

Copy these values:
- **Client ID** (e.g., `1234567890.1234567890`)
- **Client Secret** (e.g., `abc123def456...`)

⚠️ **IMPORTANT**: Keep the Client Secret secure and never commit it to version control!

---

## Step 3: Update Environment Variables

Add these new environment variables to your deployment:

### On Vercel:

Go to your project → **Settings** → **Environment Variables** and add:

```bash
# OAuth Credentials
SLACK_CLIENT_ID=1234567890.1234567890
SLACK_CLIENT_SECRET=abc123def456ghi789jkl012mno345pqr678

# Redirect URI (optional - defaults to APP_URL/api/slack/oauth/callback)
SLACK_REDIRECT_URI=https://your-app-domain.vercel.app/api/slack/oauth/callback

# Existing variables (keep these)
SLACK_SIGNING_SECRET=your_signing_secret
CRON_SECRET=your_cron_secret
APP_URL=https://your-app-domain.vercel.app
CONFERENCES_DATA_URL=https://your-app-domain.vercel.app

# Channel reminders configuration
# Channels are automatically tracked when the bot is added to them
CHANNEL_REMINDER_DAYS=30,7,3

# Vercel KV (Required for multi-workspace token storage)
KV_URL=rediss://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
```

### Legacy Mode (Optional):

If you want to keep your existing single-workspace installation working alongside OAuth:
- Keep `SLACK_BOT_TOKEN` in your environment variables
- The bot will automatically fall back to this token for the original workspace

---

## Step 4: Enable App Distribution

### 4.1 Navigate to Manage Distribution

Go to **Manage Distribution** in your Slack App settings

### 4.2 Complete the Checklist

Ensure all items are checked:
- ✅ OAuth redirect URLs configured
- ✅ Bot user added
- ✅ Required scopes configured
- ✅ Short description provided
- ✅ App icon/logo uploaded

### 4.3 Activate Public Distribution

Click **"Activate Public Distribution"** or **"Distribute App"**

---

## Step 5: Create Installation Page (Optional)

You can create a custom landing page with an "Add to Slack" button.

### Example HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Install Conferences Calendar Bot</title>
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
  </style>
</head>
<body>
  <div class="container">
    <h1>📅 Conferences Calendar Bot</h1>
    <p>Never miss an important conference deadline again!</p>

    <a href="https://your-app-domain.vercel.app/api/slack/install">
      <img
        alt="Add to Slack"
        height="40"
        width="139"
        src="https://platform.slack-edge.com/img/add_to_slack.png"
        srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
      />
    </a>
  </div>
</body>
</html>
```

---

## Step 6: Test the Installation

### 6.1 Install to Your First Workspace

1. Navigate to: `https://your-app-domain.vercel.app/api/slack/install`
2. Click "Allow" to authorize the app
3. You should see a success page

### 6.2 Verify Installation

Check your server logs (Vercel → Deployments → Functions):
```
✅ Bot installed successfully for team: Your Team Name (T01234567)
✅ Stored token for team: T01234567
✅ Stored metadata for team: T01234567
```

### 6.3 Test Commands

In your Slack workspace, try:
```
/conf-help
/conf-subscribe
/conf-upcoming
```

### 6.4 Install to Additional Workspaces

Share the installation link with other workspaces:
```
https://your-app-domain.vercel.app/api/slack/install
```

---

## How It Works

### Token Storage

When a workspace installs your bot:
1. User clicks "Add to Slack"
2. Slack redirects to `/api/slack/install`
3. User authorizes the app
4. Slack redirects to `/api/slack/oauth/callback` with a code
5. Your app exchanges the code for an access token
6. Token is stored in Vercel KV:
   - Key: `slack:team:{teamId}:token`
   - Value: Bot token (e.g., `xoxb-...`)

### Request Routing

When a request comes in:
1. Middleware extracts `team_id` from the Slack payload
2. `slackClient.ts` fetches the correct token from Vercel KV
3. API calls use the workspace-specific token

### Fallback Mode

If no OAuth token is found:
- Falls back to `SLACK_BOT_TOKEN` environment variable
- Allows seamless migration from single-workspace to multi-workspace

---

## Troubleshooting

### "Invalid redirect_uri"
- Ensure the redirect URI in Slack App settings **exactly** matches your deployment URL
- Include the full path: `/api/slack/oauth/callback`

### "No token found for team"
- Check Vercel KV is properly configured
- Verify the team completed the OAuth flow
- Check server logs for token storage errors

### Commands not working after OAuth
- Ensure slash command URLs point to your deployment (not localhost)
- Verify request URL in Slack App settings matches your deployment
- Check signature verification is working (signing secret is correct)

### Multiple installations not working
- Ensure `teamId` is being extracted correctly (check logs)
- Verify Vercel KV is storing tokens with the correct keys
- Check `slackClient.ts` is fetching tokens per team

---

## Migration from Single-Workspace

If you're migrating from the legacy single-token mode:

### Step 1: Keep existing token
Leave `SLACK_BOT_TOKEN` in your environment variables

### Step 2: Add OAuth credentials
Add `SLACK_CLIENT_ID` and `SLACK_CLIENT_SECRET`

### Step 3: Deploy changes
Deploy the updated code

### Step 4: Existing workspace continues working
Your original workspace uses the `SLACK_BOT_TOKEN` fallback

### Step 5: Install via OAuth (optional)
Optionally, re-install via OAuth to migrate the original workspace to OAuth tokens

---

## Security Considerations

### Secrets Management
- Never commit `SLACK_CLIENT_SECRET` to version control
- Use Vercel's environment variables for all secrets
- Rotate secrets if compromised

### Request Verification
- All requests are verified using HMAC-SHA256 signatures
- Cron jobs require `CRON_SECRET` authentication
- OAuth state parameter can be added for CSRF protection

### Token Storage
- Tokens stored encrypted in Vercel KV (Redis)
- Access limited to your Vercel deployment
- Tokens isolated per workspace

---

## Next Steps

Once OAuth is configured:

1. **Share the installation link** with other workspaces
2. **Monitor installations** via server logs
3. **Track usage** across workspaces
4. **Handle app uninstalls** (TODO: implement uninstall webhook)

---

## Support

For issues or questions:
- Check Vercel logs: `vercel logs --follow`
- Check Slack App event logs: [api.slack.com/apps](https://api.slack.com/apps) → Your App → Event Subscriptions
- Review this documentation
