# Quick Start Guide

## Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Open http://localhost:5173

# Run validation
npm run validate

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
Conferences-Calendar/
├── data/
│   └── conferences.yaml          # Conference data source
├── src/
│   ├── components/               # Reusable React components
│   │   ├── Header.jsx           # Main header with navigation
│   │   ├── Footer.jsx           # Site footer
│   │   ├── ConferenceCard.jsx   # Conference display card
│   │   ├── ConferenceModal.jsx  # Detailed conference info
│   │   ├── Countdown.jsx        # Live deadline countdown
│   │   ├── Filters.jsx          # Filter controls
│   │   └── Search.jsx           # Search component
│   ├── pages/
│   │   ├── Home.jsx             # Home page with card grid
│   │   └── CalendarPage.jsx    # Calendar view
│   ├── utils/
│   │   ├── parser.js            # YAML parsing & validation
│   │   ├── ics.js               # ICS export utilities
│   │   ├── parser.test.js       # Parser tests
│   │   └── ics.test.js          # ICS tests
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # App entry point
│   └── index.css                # Global styles
├── scripts/
│   └── validate.js              # Conference data validator
├── .github/
│   ├── workflows/
│   │   └── deploy.yml           # CI/CD pipeline
│   └── ISSUE_TEMPLATE/
│       └── add-conference.md    # Issue template
├── public/                      # Static assets
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies & scripts
└── README.md                   # Main documentation
```

## Key Features

### Home Page (`/`)
- Responsive card grid of conferences
- Live countdown to deadlines
- Search by name
- Filter by year and subject
- Sort by deadline, H-index, or start date
- Click cards for detailed modal

### Calendar Page (`/calendar`)
- FullCalendar integration
- Month, week, and list views
- Timezone-aware events
- Export to ICS
- URL parameter sync for sharing
- Event details popup

## Adding a Conference

1. Edit `public/data/conferences.yaml`
2. Follow the schema:

```yaml
- title: ConfName
  year: 2025
  id: confname25
  timezone: America/New_York
  deadline: 2025-06-01 23:59
  # ... other fields
```

3. Run `npm run validate`
4. Test with `npm run dev`
5. Submit PR

## Development Tips

### Hot Module Replacement
Vite provides fast HMR - changes appear instantly in the browser.

### Validation
Always run validation before committing:
```bash
npm run validate
```

### Testing
Run tests during development:
```bash
npm test
# or for watch mode
npm test -- --watch
```

### Build Optimization
The build may show warnings about chunk size. This is normal for calendar libraries.

## Environment Variables

No environment variables are required - this is a fully static site.

## Deployment

### GitHub Pages (Automatic)
Push to `main` branch - GitHub Actions automatically builds and deploys.

### Manual Deployment
```bash
npm run build
# Deploy the `dist` folder to any static host
```

## Common Tasks

### Update Dependencies
```bash
npm update
```

### Check for Outdated Packages
```bash
npm outdated
```

### Fix Lint Issues
The project uses Vite's default ESLint config.

## Troubleshooting

### Port 5173 is already in use
```bash
npm run dev -- --port 3000
```

### Build fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Validation fails
Check the error messages - they specify exactly what's wrong with the YAML data.

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [FullCalendar Documentation](https://fullcalendar.io/)
- [Luxon Documentation](https://moment.github.io/luxon/)
- [IANA Timezone Database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

## Getting Help

- 📖 Read the [README](README.md)
- 💬 Check [Discussions](https://github.com/LiGHT-Lab/Conferences-Calendar/discussions)
- 🐛 Report [Issues](https://github.com/LiGHT-Lab/Conferences-Calendar/issues)
