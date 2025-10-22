# Conference Deadlines

A clean website for tracking research conference deadlines and important dates. Built with Next.js and designed for the academic community.

A project by [LiGHT Lab](https://github.com/EPFLiGHT)

## Features

- 📅 **Interactive Calendar View** - Full-featured calendar with month, week, and list views
- ⏱️ **Live Countdowns** - Real-time countdown to upcoming deadlines with timezone awareness
- 🌍 **Timezone Support** - Automatic conversion to your local timezone for all deadlines
- 🔍 **Advanced Search & Filtering** - Find conferences by name, year, or subject area
- 📊 **Multi-Sort Options** - Sort by upcoming deadline, H-index, or start date
- 📥 **ICS Export** - Export individual or all filtered events to your calendar app
- 📄 **Pagination** - Navigate through conferences with clean pagination (12 per page)
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- 🎯 **Modal Details** - Click any conference for detailed information in a modal
- 🚀 **Fast Performance** - Optimized with React hooks and memoization
- 🤖 **Slack Bot Integration** - Get deadline notifications and search conferences directly in Slack

## Quick Start

We use **pnpm** to manage packages for faster installation and better disk efficiency.

### Installation

```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev

# Run validation
pnpm validate

# Build for production
pnpm build
```

## Conference Data

Conference information is stored in `public/data/conferences.yaml`. Each conference entry follows this schema:

```yaml
- title: ShortName              # Short conference name (e.g., NeurIPS, CVPR)
  year: 2025                     # Conference year
  id: shortname25                # Unique ID: lowercase title + last 2 digits of year
  full_name: Full Conference Name
  link: https://conference-website.com
  deadline: 2025-05-21 20:00     # Submission deadline (YYYY-MM-DD HH:MM)
  abstract_deadline: 2025-05-14 20:00  # Optional: Abstract deadline
  timezone: America/Los_Angeles  # IANA timezone (e.g., UTC, America/New_York)
  place: City, Country           # Conference location
  date: May 21-25, 2025          # Human-readable date range
  start: 2025-05-21              # Conference start date (YYYY-MM-DD)
  end: 2025-05-25                # Conference end date (YYYY-MM-DD)
  paperslink: https://...        # Optional: Link to accepted papers
  pwclink: https://...           # Optional: Papers with Code link
  hindex: 150.0                  # Optional: h5-index from Google Scholar Metrics
  sub: ML                        # Subject area (e.g., ML, CV, NLP, SP)
  note: Premier ML conference    # Optional: Additional notes
```

### Required Fields
- `title` - Short conference name
- `year` - Conference year
- `id` - Unique identifier (format: `lowercasetitle` + last 2 digits of year)
- `timezone` - Valid [IANA timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) ([find timezones here](https://momentjs.com/timezone/))

### Optional Fields

All other fields are optional. If omitted:

- `full_name` - defaults to the `title` value
- `place` and `date` - display as "TBA" (To Be Announced)
- `hindex` - defaults to 0
- `sub` - defaults to "General"
- `note` - defaults to empty
- `link`, `deadline`, `abstract_deadline`, `start`, `end`, `paperslink`, `pwclink` - not displayed if missing

**Note:** The `hindex` field refers to the h5-index from [Google Scholar Metrics](https://scholar.google.com/citations?view_op=top_venues&vq=eng).

### Subject Tags

The `sub` field categorizes conferences by research area. Available tags:

- **ML** - Machine Learning
- **CV** - Computer Vision
- **NLP** - Natural Language Processing
- **DM** - Data Mining
- **SP** - Signal Processing
- **HCI** - Human-Computer Interaction
- **RO** - Robotics
- **SEC** - Security
- **PRIV** - Privacy
- **CONF** - General Conference
- **SHOP** - Workshop
- **CG** - Computer Graphics
- **KR** - Knowledge Representation
- **AP** - Applications

## Project Structure

```
Conferences-Calendar/
├── public/
│   ├── data/
│   │   └── conferences.yaml   # Conference data source
│   ├── icons/
│   │   └── favicon.svg        # Favicon
│   ├── light-logo.svg         # Lab logo
│   ├── light-banner.png       # Social sharing banner
│   └── CNAME                  # GitHub Pages custom domain
├── src/
│   ├── app/                   # Next.js app router
│   │   ├── api/               # API routes
│   │   │   ├── slack/         # Slack bot endpoints
│   │   │   │   ├── commands/route.ts       # Slash command handler
│   │   │   │   ├── interactions/route.ts   # Button/menu handler
│   │   │   │   ├── events/route.ts         # Event handler
│   │   │   │   └── cron/
│   │   │   │       └── daily-check/route.ts  # Daily notifications
│   │   │   └── calendar/
│   │   │       └── [conferenceId]/route.ts  # ICS export API
│   │   ├── calendar/          # Calendar route
│   │   │   └── page.tsx
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── slack-bot/             # Slack bot logic
│   │   ├── commands/user/     # User command implementations
│   │   │   ├── upcoming.ts
│   │   │   ├── search.ts
│   │   │   ├── subject.ts
│   │   │   ├── info.ts
│   │   │   ├── subscribe.ts
│   │   │   ├── unsubscribe.ts
│   │   │   ├── settings.ts
│   │   │   └── help.ts
│   │   ├── lib/               # Core bot utilities
│   │   │   ├── middleware.ts         # Request handling
│   │   │   ├── commandWrapper.ts     # Command wrapper
│   │   │   ├── responses.ts          # Response builders
│   │   │   ├── messageBuilder.ts     # Block Kit formatter
│   │   │   ├── userPreferences.ts    # KV database wrapper
│   │   │   ├── slackVerify.ts        # Request verification
│   │   │   └── conferenceHelpers.ts  # Conference utilities
│   │   ├── utils/
│   │   │   ├── logger.ts            # Structured logging
│   │   │   └── conferenceCache.ts   # Conference caching
│   │   └── config/
│   │       └── constants.ts         # Configuration
│   ├── components/            # Shared UI building blocks
│   ├── hooks/                 # Reusable state & routing hooks
│   ├── styles/                # Component-level style configs
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Data parsing & ICS helpers
│   └── theme.ts               # Chakra UI theme setup
├── scripts/
│   └── validate.js            # YAML validation script
├── .env.example               # Environment variables template
├── next.config.mjs            # Next.js configuration
├── vercel.json                # Vercel deployment config
└── package.json
```

## Tech Stack

- **Framework:** Next.js 15 + React 19
- **UI Library:** Chakra UI v3
- **Calendar:** FullCalendar
- **Timezone:** Luxon
- **YAML Parsing:** js-yaml
- **Package Manager:** pnpm
- **Deployment:** GitHub Pages (frontend), Vercel (API + Slack bot)
- **Database:** Vercel KV (Redis) for Slack bot user preferences
- **Integrations:** Slack API for bot functionality

## Slack Bot

Want to get conference deadline notifications directly in Slack? Check out the [Slack Bot Setup Guide](SLACK_BOT_README.md) for detailed instructions on setting up the bot for your workspace.

## Contributing

We welcome contributions to improve the conference deadlines database! Here's how you can help:

### Adding or Updating Conferences

**Option 1: Submit an Issue (Easiest)**

Not familiar with Git? No problem! Simply [open an issue](https://github.com/EPFLiGHT/Conferences-Calendar/issues/new/choose) using our conference addition template. Provide the conference details, and we'll add it for you.

**Option 2: Submit a Pull Request**

1. **Fork the repository** and create a new branch
2. **Edit only the YAML file**: `public/data/conferences.yaml`
3. Follow the conference data schema outlined above
4. **Validate your changes** by running:
   ```bash
   pnpm validate
   ```
5. **Submit a pull request** with a clear description of the conferences added/updated

### Important Guidelines

- ⚠️ **Only modify** `public/data/conferences.yaml` - do not change any code files
- ✅ Ensure all required fields (`title`, `year`, `id`, `timezone`) are included
- ✅ Use valid [IANA timezone identifiers](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
- ✅ Follow the naming convention for `id`: lowercase title + last 2 digits of year (e.g., `neurips25`)
- ✅ Double-check dates and deadlines for accuracy
- ✅ Run validation before submitting your PR

### Reporting Issues

If you find incorrect information or bugs, please [open an issue](https://github.com/EPFLiGHT/Conferences-Calendar/issues) with details.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Maintainer

This project is maintained by [Omar Ziyad Azgaoui](https://github.com/AZOGOAT).

For questions or suggestions, contact: [omar.azgaoui@epfl.ch](mailto:omar.azgaoui@epfl.ch)

---

Made with ❤️ by [LiGHT Lab](https://github.com/EPFLiGHT)
