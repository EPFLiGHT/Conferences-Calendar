# Conference Slack Bot Setup Guide

A Slack bot that tracks academic conference deadlines and sends timely notifications to team members.

**Workspace:** https://light-laboratory.slack.com/
**Production Site:** https://conferences.light-laboratory.org/

## Features

- **Slash Commands**: Search conferences, view deadlines, subscribe to notifications
- **Smart Notifications**: Customizable reminders (30, 7, 3 days before deadlines)
- **Subject Filtering**: Subscribe to specific research areas (ML, CV, NLP, SEC, etc.)
- **Interactive Messages**: Rich cards with conference details and action buttons
- **Timezone-Aware**: Deadlines displayed in user's local timezone
- **Multi-Workspace**: Install to any Slack workspace via OAuth (NEW!)

## Installation Options

You have two options for installing this bot:

### Option 1: OAuth Installation (Recommended for Multiple Workspaces)

**Use this if you want:**
- Anyone to install your bot to their workspace
- Support for multiple Slack workspaces
- Easy distribution via "Add to Slack" button

👉 **See [OAUTH_SETUP.md](./OAUTH_SETUP.md) for complete OAuth setup instructions**

**Quick Link:** Visit `https://your-app.vercel.app/slack-install` for the installation page

### Option 2: Manual Installation (Single Workspace)

**Use this if you want:**
- A quick setup for one workspace only
- Simple configuration without OAuth complexity

👉 **Follow the "Quick Start" section below**

---

## Quick Start (Manual Installation)

### 1. Create Slack App

1. Go to [https://api.slack.com/apps](https://api.slack.com/apps) → "Create New App" → "From scratch"
2. Name: `LiGHT Conferences` (recommended) or your choice
3. Select workspace: `light-laboratory` (https://light-laboratory.slack.com/)

### 2. Configure Bot Permissions

Go to **OAuth & Permissions** → **Bot Token Scopes**, add:

```
chat:write           # Send messages
chat:write.public    # Send messages to channels bot isn't in
commands             # Receive slash commands
users:read           # View user information
users:read.email     # View user email (optional)
```

### 3. Install App to Workspace

1. Go to **OAuth & Permissions** → Click "Install to Workspace"
2. Authorize the app
3. Copy the **Bot User OAuth Token** (starts with `xoxb-`)

### 4. Get Signing Secret

1. Go to **Basic Information** → **App Credentials**
2. Copy the **Signing Secret**

### 5. Configure Slash Commands

Go to **Slash Commands** → **Create New Command**:

- **Command**: `/conf`
- **Request URL**: `https://your-project.vercel.app/api/slack/commands`
- **Short Description**: Track conference deadlines
- **Usage Hint**: `upcoming | search <query> | subscribe`

### 6. Configure Interactivity

Go to **Interactivity & Shortcuts**:

- Enable Interactivity: **ON**
- **Request URL**: `https://your-project.vercel.app/api/slack/interactions`

### 7. Configure Event Subscriptions (Optional)

Go to **Event Subscriptions**:

- Enable Events: **ON**
- **Request URL**: `https://your-project.vercel.app/api/slack/events`
- Subscribe to bot events:
  - `app_mention` - When users @mention the bot
  - `message.im` - Direct messages to bot

## Deployment

### Setup Vercel Project

1. **Import Repository to Vercel**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Add Environment Variables**

   In Vercel Dashboard → Your Project → Settings → Environment Variables:

   ```
   SLACK_BOT_TOKEN=xoxb-your-token-here
   SLACK_SIGNING_SECRET=your-secret-here
   CONFERENCES_DATA_URL=https://conferences.light-laboratory.org
   APP_URL=https://your-project.vercel.app
   CRON_SECRET=your-random-secret (optional but recommended)
   ```

   **Important Notes:**
   - `CONFERENCES_DATA_URL` - Base URL where your YAML file is hosted (code appends `/data/conferences.yaml`)
   - `APP_URL` - Your public Vercel deployment URL (used for generating calendar download links)
   - `CRON_SECRET` - Random string for authenticating cron jobs

3. **Create Vercel KV Database**

   - In Vercel Dashboard → Storage → Create Database
   - Choose "KV" (Redis)
   - Name it `conferences-slack-bot-kv`
   - Link to your project (Vercel auto-injects credentials)

4. **Deploy**

   - Vercel will auto-deploy on git push
   - API routes will be available at: `https://your-project.vercel.app/api/slack/*`

### Update Slack App URLs

After deployment, update these URLs in your Slack app config:

1. **Slash Commands** → `/conf` → Request URL:
   ```
   https://your-project.vercel.app/api/slack/commands
   ```

2. **Interactivity** → Request URL:
   ```
   https://your-project.vercel.app/api/slack/interactions
   ```

3. **Event Subscriptions** → Request URL (optional):
   ```
   https://your-project.vercel.app/api/slack/events
   ```

## Available Commands

### User Commands

- `/conf upcoming` - Show next 5 upcoming deadlines
- `/conf search <query>` - Search conferences by name (e.g., `/conf search CVPR`)
- `/conf subject <code>` - Filter by subject (e.g., `/conf subject ML`)
- `/conf info <id>` - Get detailed info about specific conference
- `/conf subscribe` - Enable deadline notifications
- `/conf unsubscribe` - Disable notifications
- `/conf settings` - View/edit your preferences
- `/conf help` - Show all commands

### Subject Codes

- `ML` - Machine Learning
- `CV` - Computer Vision
- `NLP` - Natural Language Processing
- `SEC` - Security
- `DM` - Data Mining
- `HCI` - Human-Computer Interaction
- `RO` - Robotics
- `PRIV` - Privacy
- And more... (use `/conf subject` to see all)

## Notification System

### How It Works

1. Users run `/conf subscribe` to enable notifications
2. Bot sends DMs at 9 AM daily (configurable in `vercel.json`)
3. Notifications sent based on user preferences:
   - Default: 30, 7, 3 days before deadlines
   - Filtered by subscribed subjects (if configured)
   - Timezone-aware (uses Slack user timezone)

### Customizing Notifications

Users can customize via `/conf settings`:
- Enable/disable notifications
- Choose reminder days (3, 7, 14, 30, etc.)
- Subscribe to specific subjects only

## Development

### Local Development

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Create `.env.local`:**

   ```bash
   cp .env.example .env.local
   # Fill in your Slack credentials and configuration
   ```

   Required variables for local development:
   - `SLACK_BOT_TOKEN` - Your bot token from Slack
   - `SLACK_SIGNING_SECRET` - Your signing secret from Slack
   - `CONFERENCES_DATA_URL` - URL to fetch conference data (can use `http://localhost:3000` for local testing)
   - `APP_URL` - Your app URL (use `http://localhost:3000` for local, change to Vercel URL for production)
   - `CRON_SECRET` - Random string for cron authentication
   - Vercel KV credentials (get from Vercel dashboard or Upstash)

3. **Run development server:**
   ```bash
   pnpm dev
   ```

4. **Expose local server to Slack (using ngrok):**
   ```bash
   ngrok http 3000
   ```
   Update Slack app URLs to use ngrok URL: `https://abc123.ngrok.io/api/slack/commands`

### Testing Commands

Test commands locally by sending POST requests:

```bash
curl -X POST http://localhost:3000/api/slack/commands \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "command=/conf&text=upcoming&user_id=U123456"
```

## Architecture

### Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Runtime**: Node.js 20 (Vercel Serverless Functions)
- **Database**: Vercel KV (Redis) for user preferences
- **Deployment**: Vercel
- **Data Source**: YAML file from GitHub Pages

### File Structure

```
app/api/slack/              # API Routes (Next.js 13+)
├── commands/route.ts       # Slash command handler
├── interactions/route.ts   # Button/menu handler
├── events/route.ts         # Event handler (mentions, DMs)
└── cron/
    └── daily-check/route.ts  # Daily notification job

src/slack-bot/              # Bot logic
├── commands/user/          # Command implementations
│   ├── upcoming.ts
│   ├── search.ts
│   ├── subscribe.ts
│   └── ...
├── lib/
│   ├── middleware.ts       # Centralized request handling
│   ├── responses.ts        # Standard response builders
│   ├── messageBuilder.ts   # Block Kit message formatter
│   ├── userPreferences.ts  # KV database wrapper
│   └── slackVerify.ts      # Request verification
├── utils/
│   ├── logger.ts           # Structured logging
│   └── conferenceCache.ts  # Conference data caching
└── config/
    └── constants.ts        # Configuration constants

src/utils/                  # Shared utilities
├── parser.ts               # YAML parsing (shared with frontend)
├── conferenceQueries.ts    # Conference filtering/searching
└── subjects.ts             # Subject labels

src/types/
├── conference.ts           # Conference types (shared)
├── slack.ts                # Slack-specific types
└── slack-payloads.ts       # Type-safe Slack API payloads
```

### How It Works

1. **User runs `/conf upcoming`** in Slack
2. Slack sends POST to `/api/slack/commands`
3. API route verifies signature and parses command
4. Routes to appropriate handler (`handleUpcoming`)
5. Handler fetches conferences from cache/YAML
6. Filters and formats data using shared utilities
7. Builds Block Kit message with rich formatting
8. Returns JSON response to Slack
9. Slack displays formatted message to user

### Data Flow

```
User → Slack → Vercel API Route → Command Handler
                                         ↓
                                   Fetch Conferences
                                   (Cache or YAML)
                                         ↓
                                   Filter & Format
                                   (Shared utilities)
                                         ↓
                                   Build Message
                                   (Block Kit)
                                         ↓
                         ← JSON Response ←
     Slack ← Display Message ←
```

## Troubleshooting

### Common Issues

**1. "Invalid signature" error**
- Verify `SLACK_SIGNING_SECRET` is correct
- Ensure environment variables are set in Vercel

**2. Commands not responding**
- Check Vercel logs: `vercel logs`
- Verify Request URLs in Slack app config match deployment URL
- Test endpoint: `curl https://your-project.vercel.app/api/slack/commands`

**3. Notifications not sending**
- Check cron job execution in Vercel logs
- Verify `SLACK_BOT_TOKEN` has `chat:write` permission
- Ensure users have subscribed: `/conf subscribe`

**4. "Failed to fetch conferences" error**
- Verify `CONFERENCES_DATA_URL` is set correctly
- Check YAML file is accessible at the URL
- Test URL: `curl https://your-domain.com/data/conferences.yaml`

**5. Calendar links not working**
- Verify `APP_URL` is set to your public Vercel URL (not localhost)
- Ensure it doesn't have a trailing slash
- Example: `https://your-project.vercel.app`

### Viewing Logs

Vercel logs (production):
```bash
vercel logs --follow
```

Slack app event logs:
- Go to [api.slack.com/apps](https://api.slack.com/apps)
- Select your app → Event Subscriptions → View Logs

## Cost

**Free tier includes:**
- Vercel: 100 GB bandwidth, 100 serverless executions/day, 1 cron job
- Vercel KV: 256MB storage, 30K commands/month
- Slack: Free for standard workspace features

**Perfect for small to medium teams (<100 users)**

## Support

For issues or questions:
1. Check Vercel logs: `vercel logs`
2. Check Slack app logs: api.slack.com/apps → Your App → Logs
3. Review this README and troubleshooting section

## License

See main project LICENSE file.
