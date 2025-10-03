# Conference Deadlines

A clean website for tracking research conference deadlines and important dates. Built with Next.js and designed for the academic community.

A project by [LiGHT Lab](https://github.com/EPFLiGHT)

## Features

- 📅 **Calendar View** - Visualize all conferences and deadlines in a calendar
- ⏱️ **Live Countdowns** - Real-time countdown to upcoming deadlines
- 🌍 **Timezone Support** - Automatic conversion to your local timezone
- 🔍 **Search & Filter** - Find conferences by name, year, or subject
- 📊 **Sorting** - Sort by deadline, H-index, or conference date
- 📥 **ICS Export** - Export events to your calendar app
- 📱 **Responsive Design** - Works great on desktop and mobile

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
  hindex: 150.0                  # Optional: H-index score
  sub: ML                        # Subject area (e.g., ML, CV, NLP, SP)
  note: Premier ML conference    # Optional: Additional notes
```

### Required Fields
- `title` - Short conference name
- `year` - Conference year
- `id` - Unique identifier (format: `lowercasetitle` + last 2 digits of year)
- `timezone` - Valid [IANA timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

### Optional Fields
All other fields are optional. If omitted, they will display as "TBA" (To Be Announced).

## Project Structure

```
Conferences-Calendar/
├── public/
│   └── data/
│       └── conferences.yaml   # Conference data
├── src/
│   ├── components/            # React components
│   ├── pages/                 # Page components
│   ├── utils/                 # Utilities
│   └── styles/                # CSS styles
├── scripts/
│   └── validate.js            # Validation script
└── package.json
```

## Tech Stack

- **Framework:** Next.js 15 + React 19
- **UI Library:** Chakra UI v3
- **Calendar:** FullCalendar
- **Timezone:** Luxon
- **YAML Parsing:** js-yaml
- **Package Manager:** pnpm
- **Deployment:** GitHub Pages

## License

MIT License - see [LICENSE](LICENSE) for details.

## Maintainers

This project is maintained by [LiGHT Lab](https://github.com/LiGHT-Lab).

---

Made with ❤️ by LiGHT Lab
