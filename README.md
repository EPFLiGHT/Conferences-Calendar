# Conference Deadlines

A clean, static website for tracking research conference deadlines and important dates. Built with React and designed for the academic community.

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

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run validation
npm run validate

# Run tests
npm test

# Build for production
npm run build
```


## How to Add a Conference

We welcome contributions! To add a new conference:

### 1. Fork and Clone

```bash
git clone https://github.com/LiGHT-Lab/Conferences-Calendar.git
cd Conferences-Calendar
```

### 2. Edit `public/data/conferences.yaml`

Add your conference following this schema:

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

#### Required Fields
- `title` - Short conference name
- `year` - Conference year
- `id` - Unique identifier (format: `lowercasetitle` + last 2 digits of year)
- `timezone` - Valid [IANA timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

#### Optional Fields
All other fields are optional. If omitted, they will display as "TBA" (To Be Announced).

#### Field Guidelines

**Timezones:** Use valid IANA timezone names:
- `UTC` - Coordinated Universal Time
- `America/New_York` - US Eastern Time
- `America/Los_Angeles` - US Pacific Time
- `Europe/London` - UK
- `Asia/Seoul` - South Korea
- `Asia/Tokyo` - Japan

**Date Formats:**
- `deadline` and `abstract_deadline`: `YYYY-MM-DD HH:MM` (24-hour format)
- `start` and `end`: `YYYY-MM-DD`
- `date`: Human-readable (e.g., "June 10-17, 2025")

**Subject Areas (sub):**
Common values: `ML`, `CV`, `NLP`, `SP`, `AI`, `HCI`, `Systems`, `Security`, `Theory`, `General`

### 3. Validate Your Changes

```bash
npm run validate
```

This will check:
- Required fields are present
- Unique conference IDs
- Valid IANA timezones
- Correct date formats
- No duplicate entries

### 4. Test Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to preview your changes.

### 5. Submit a Pull Request

```bash
git add public/data/conferences.yaml
git commit -m "Add [Conference Name] [Year]"
git push origin main
```

Then create a pull request on GitHub.

## Issue Templates

Use our issue templates to:
- 🎯 [Add a Conference](https://github.com/LiGHT-Lab/Conferences-Calendar/issues/new?template=add-conference.md)
- 🐛 [Report a Bug](https://github.com/LiGHT-Lab/Conferences-Calendar/issues/new)
- 💡 [Request a Feature](https://github.com/LiGHT-Lab/Conferences-Calendar/issues/new)

## Project Structure

```
Conferences-Calendar/
├── public/
│   └── data/
│       └── conferences.yaml   # Conference data
├── src/
│   ├── components/            # React components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── ConferenceCard.jsx
│   │   ├── ConferenceModal.jsx
│   │   ├── Countdown.jsx
│   │   ├── Filters.jsx
│   │   └── Search.jsx
│   ├── pages/
│   │   ├── Home.jsx           # Home page with cards
│   │   └── CalendarPage.jsx   # Calendar view
│   ├── utils/
│   │   ├── parser.js          # YAML parsing & validation
│   │   └── ics.js             # ICS export utilities
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── scripts/
│   └── validate.js            # Validation script
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD pipeline
└── package.json
```

## Tech Stack

- **Framework:** React 18 + Vite
- **Routing:** React Router
- **Calendar:** FullCalendar
- **Timezone:** Luxon
- **YAML Parsing:** js-yaml
- **Testing:** Vitest
- **Deployment:** GitHub Pages

## Contributing

We appreciate all contributions! Please:

1. Follow the conference data schema
2. Run `npm run validate` before submitting
3. Test locally with `npm run dev`
4. Write clear commit messages
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Maintainers

This project is maintained by [LiGHT Lab](https://github.com/LiGHT-Lab).

## Support

- 📖 [Documentation](https://github.com/LiGHT-Lab/Conferences-Calendar/wiki)
- 🐛 [Report Issues](https://github.com/LiGHT-Lab/Conferences-Calendar/issues)
- 💬 [Discussions](https://github.com/LiGHT-Lab/Conferences-Calendar/discussions)

---

Made with ❤️ by the LiGHT Lab community
