# Contributing to Conference Deadlines

Thank you for your interest in contributing to Conference Deadlines! This document provides guidelines for contributing to the project.

## How to Contribute

### Adding a Conference

The easiest way to contribute is by adding a conference to our database:

1. **Fork the repository** and clone it locally
2. **Edit `public/data/conferences.yaml`** following the schema below
3. **Run validation** with `npm run validate`
4. **Test locally** with `npm run dev`
5. **Submit a pull request**

### Conference Data Schema

```yaml
- title: ShortName              # Required: Short conference name
  year: 2025                     # Required: Conference year
  id: shortname25                # Required: Unique ID (lowercase + year)
  full_name: Full Conference Name
  link: https://conference-website.com
  deadline: 2025-05-21 20:00     # Format: YYYY-MM-DD HH:MM
  abstract_deadline: 2025-05-14 20:00
  timezone: America/Los_Angeles  # Required: IANA timezone
  place: City, Country
  date: May 21-25, 2025
  start: 2025-05-21              # Format: YYYY-MM-DD
  end: 2025-05-25                # Format: YYYY-MM-DD
  paperslink: https://...
  pwclink: https://...
  hindex: 150.0
  sub: ML                        # Subject area
  note: Additional notes
```

### Required Fields

- `title` - Short conference name (e.g., NeurIPS, CVPR)
- `year` - Conference year as a number
- `id` - Unique identifier (lowercase title + last 2 digits of year)
- `timezone` - Valid IANA timezone name

### Validation Rules

Our validation script checks:

1. **Required fields** are present
2. **Unique IDs** - no duplicates
3. **Valid timezones** - must be IANA standard
4. **Date formats**:
   - Deadlines: `YYYY-MM-DD HH:MM`
   - Dates: `YYYY-MM-DD`
5. **Data consistency**:
   - Start date before end date
   - Abstract deadline before submission deadline
6. **URL formats** for links

### Testing Your Changes

Before submitting:

```bash
# Install dependencies
npm install

# Run validation
npm run validate

# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Code Contributions

### Setting Up Development Environment

```bash
git clone https://github.com/LiGHT-Lab/Conferences-Calendar.git
cd Conferences-Calendar
npm install
npm run dev
```

### Project Structure

- `/data` - Conference data in YAML
- `/src/components` - React components
- `/src/pages` - Page components
- `/src/utils` - Utility functions
- `/scripts` - Build and validation scripts
- `/.github` - GitHub Actions and templates

### Code Style

- Use functional React components with hooks
- Keep components focused and reusable
- Write clear, descriptive variable names
- Add comments for complex logic
- Use CSS modules or scoped styles

### Commit Messages

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add export to Google Calendar
fix: correct timezone conversion for UTC
docs: update contributing guidelines
```

## Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following the guidelines above
3. **Run tests** and validation
4. **Update documentation** if needed
5. **Submit a PR** with a clear description

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Conference addition
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update

## Testing
- [ ] Validation passes
- [ ] Tests pass
- [ ] Tested locally

## Screenshots (if applicable)
Add screenshots for UI changes
```

## Reporting Issues

When reporting issues:

1. **Use the issue template** if available
2. **Provide clear title** and description
3. **Include steps to reproduce** for bugs
4. **Add screenshots** for UI issues
5. **Specify environment** (browser, OS)

## Feature Requests

We welcome feature requests! Please:

1. **Check existing issues** first
2. **Describe the feature** clearly
3. **Explain the use case**
4. **Propose implementation** if you have ideas

## Questions?

- 📖 Check the [README](README.md)
- 🐛 [Open an issue](https://github.com/LiGHT-Lab/Conferences-Calendar/issues)
- 💬 [Start a discussion](https://github.com/LiGHT-Lab/Conferences-Calendar/discussions)

## Code of Conduct

This project follows a Code of Conduct. By participating, you agree to:

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Conference Deadlines! 🎉
