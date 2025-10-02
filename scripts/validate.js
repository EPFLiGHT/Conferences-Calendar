import fs from 'fs';
import yaml from 'js-yaml';
import { DateTime } from 'luxon';

const REQUIRED_FIELDS = ['title', 'year', 'id', 'timezone'];
const OPTIONAL_FIELDS = [
  'full_name', 'link', 'deadline', 'abstract_deadline',
  'place', 'date', 'start', 'end', 'paperslink', 'pwclink',
  'hindex', 'sub', 'note'
];
const ALL_FIELDS = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS];

let errorCount = 0;
let warningCount = 0;

function error(message) {
  console.error(`❌ ERROR: ${message}`);
  errorCount++;
}

function warning(message) {
  console.warn(`⚠️  WARNING: ${message}`);
  warningCount++;
}

function success(message) {
  console.log(`✅ ${message}`);
}

function validateConference(conf, index) {
  const confId = conf.id || `conference at index ${index}`;

  // Check required fields
  REQUIRED_FIELDS.forEach(field => {
    if (!conf[field]) {
      error(`${confId}: Missing required field '${field}'`);
    }
  });

  // Check for unknown fields
  Object.keys(conf).forEach(field => {
    if (!ALL_FIELDS.includes(field)) {
      warning(`${confId}: Unknown field '${field}'`);
    }
  });

  // Validate timezone
  if (conf.timezone) {
    try {
      DateTime.now().setZone(conf.timezone);
      // Additional check: try to create a date in this timezone
      const test = DateTime.fromISO('2024-01-01T00:00:00', { zone: conf.timezone });
      if (!test.isValid) {
        error(`${confId}: Invalid IANA timezone '${conf.timezone}'`);
      }
    } catch (e) {
      error(`${confId}: Could not validate timezone '${conf.timezone}'`);
    }
  }

  // Validate date formats
  const dateTimeFields = ['deadline', 'abstract_deadline'];
  dateTimeFields.forEach(field => {
    if (conf[field]) {
      // Check if it's a string first
      if (typeof conf[field] !== 'string') {
        error(`${confId}: Field '${field}' must be a string in format YYYY-MM-DD HH:MM`);
        return;
      }
      // Check format with regex
      if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(conf[field])) {
        error(`${confId}: Invalid datetime format for '${field}': ${conf[field]} (use YYYY-MM-DD HH:MM)`);
        return;
      }
      // Check if it's parseable (convert space to T for ISO parsing)
      const isoFormat = conf[field].replace(' ', 'T');
      const parsed = DateTime.fromISO(isoFormat);
      if (!parsed.isValid) {
        error(`${confId}: Invalid datetime for '${field}': ${conf[field]}`);
      }
    }
  });

  const dateFields = ['start', 'end'];
  dateFields.forEach(field => {
    if (conf[field]) {
      // Check if it's a string first
      if (typeof conf[field] !== 'string') {
        error(`${confId}: Field '${field}' must be a string in format YYYY-MM-DD`);
        return;
      }
      // Check format with regex
      if (!/^\d{4}-\d{2}-\d{2}$/.test(conf[field])) {
        error(`${confId}: Invalid date format for '${field}': ${conf[field]} (use YYYY-MM-DD)`);
        return;
      }
      // Check if it's parseable
      const parsed = DateTime.fromISO(conf[field]);
      if (!parsed.isValid) {
        error(`${confId}: Invalid date for '${field}': ${conf[field]}`);
      }
    }
  });

  // Validate year
  if (conf.year) {
    if (typeof conf.year !== 'number') {
      error(`${confId}: Year must be a number, got ${typeof conf.year}`);
    } else if (conf.year < 1900 || conf.year > 2100) {
      error(`${confId}: Year '${conf.year}' is out of reasonable range`);
    }
  }

  // Validate h-index
  if (conf.hindex !== undefined) {
    if (typeof conf.hindex !== 'number') {
      error(`${confId}: H-index must be a number, got ${typeof conf.hindex}`);
    } else if (conf.hindex < 0) {
      error(`${confId}: H-index cannot be negative`);
    }
  }

  // Validate ID format (should be lowercase alphanumeric + last 2 digits of year)
  if (conf.id && conf.year) {
    const expectedSuffix = String(conf.year).slice(-2);
    if (!conf.id.endsWith(expectedSuffix)) {
      warning(`${confId}: ID should end with '${expectedSuffix}' (last 2 digits of year ${conf.year})`);
    }
    if (conf.id !== conf.id.toLowerCase()) {
      warning(`${confId}: ID should be lowercase`);
    }
  }

  // Validate URLs
  const urlFields = ['link', 'paperslink', 'pwclink'];
  urlFields.forEach(field => {
    if (conf[field] && typeof conf[field] === 'string') {
      try {
        new URL(conf[field].startsWith('http') ? conf[field] : `https://${conf[field]}`);
      } catch (e) {
        warning(`${confId}: Invalid URL for '${field}': ${conf[field]}`);
      }
    }
  });

  // Check date consistency
  if (conf.start && conf.end) {
    const start = DateTime.fromISO(conf.start);
    const end = DateTime.fromISO(conf.end);
    if (start.isValid && end.isValid && start > end) {
      error(`${confId}: Start date is after end date`);
    }
  }

  // Check deadline consistency
  if (conf.abstract_deadline && conf.deadline) {
    const abstract = DateTime.fromISO(conf.abstract_deadline);
    const submission = DateTime.fromISO(conf.deadline);
    if (abstract.isValid && submission.isValid && abstract > submission) {
      warning(`${confId}: Abstract deadline is after submission deadline`);
    }
  }
}

function main() {
  console.log('🔍 Validating conferences.yaml...\n');

  try {
    // Read and parse YAML with schema that preserves strings
    const yamlContent = fs.readFileSync('public/data/conferences.yaml', 'utf8');
    const conferences = yaml.load(yamlContent, { schema: yaml.JSON_SCHEMA });

    if (!Array.isArray(conferences)) {
      error('YAML file must contain an array of conferences');
      process.exit(1);
    }

    success(`Found ${conferences.length} conferences to validate\n`);

    // Validate each conference
    conferences.forEach((conf, index) => {
      validateConference(conf, index);
    });

    // Check for duplicate IDs
    const ids = conferences.map(c => c.id).filter(Boolean);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    const uniqueDuplicates = [...new Set(duplicates)];

    if (uniqueDuplicates.length > 0) {
      uniqueDuplicates.forEach(id => {
        error(`Duplicate conference ID found: '${id}'`);
      });
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('Validation Summary:');
    console.log('='.repeat(50));

    if (errorCount === 0 && warningCount === 0) {
      console.log('✅ All checks passed! The conference data is valid.');
      process.exit(0);
    } else {
      if (errorCount > 0) {
        console.log(`❌ ${errorCount} error(s) found`);
      }
      if (warningCount > 0) {
        console.log(`⚠️  ${warningCount} warning(s) found`);
      }

      if (errorCount > 0) {
        console.log('\n❌ Validation failed. Please fix the errors above.');
        process.exit(1);
      } else {
        console.log('\n⚠️  Validation passed with warnings. Consider addressing them.');
        process.exit(0);
      }
    }
  } catch (error) {
    console.error('❌ Fatal error during validation:');
    console.error(error.message);
    process.exit(1);
  }
}

main();
