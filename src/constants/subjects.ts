/**
 * Unified Subject Configuration
 * Single source of truth for all subject-related constants
 */

export interface SubjectConfig {
  code: string;
  label: string;
  emoji: string;
  colors: {
    bg: string;
    color: string;
    border: string;
  };
}

/**
 * Subject color palettes (Tailwind-inspired)
 * Define once and reference in SUBJECTS configuration
 */
const SUBJECT_COLOR_PALETTES = {
  blue: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },      // ML
  purple: { bg: '#faf5ff', color: '#9333ea', border: '#e9d5ff' },    // CV
  green: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },     // NLP
  orange: { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },    // DM
  red: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },       // SP
  pink: { bg: '#fdf2f8', color: '#db2777', border: '#fbcfe8' },      // HCI
  cyan: { bg: '#ecfeff', color: '#0891b2', border: '#a5f3fc' },      // RO
  teal: { bg: '#f0fdfa', color: '#0d9488', border: '#99f6e4' },      // SEC
  indigo: { bg: '#eef2ff', color: '#4f46e5', border: '#c7d2fe' },    // PRIV
  yellow: { bg: '#fefce8', color: '#a16207', border: '#fef08a' },    // CONF
  lime: { bg: '#f7fee7', color: '#65a30d', border: '#d9f99d' },      // SHOP
  violet: { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' },    // CG
  fuchsia: { bg: '#fdf4ff', color: '#c026d3', border: '#f5d0fe' },   // KR
  rose: { bg: '#fff1f2', color: '#e11d48', border: '#fecdd3' },      // AP
} as const;

/**
 * Complete subject configuration mapping
 */
export const SUBJECTS: Record<string, SubjectConfig> = {
  ML: {
    code: 'ML',
    label: 'Machine Learning',
    emoji: '🤖',
    colors: SUBJECT_COLOR_PALETTES.blue,
  },
  CV: {
    code: 'CV',
    label: 'Computer Vision',
    emoji: '👁️',
    colors: SUBJECT_COLOR_PALETTES.purple,
  },
  NLP: {
    code: 'NLP',
    label: 'Natural Language Processing',
    emoji: '💬',
    colors: SUBJECT_COLOR_PALETTES.green,
  },
  DM: {
    code: 'DM',
    label: 'Data Mining',
    emoji: '📊',
    colors: SUBJECT_COLOR_PALETTES.orange,
  },
  SP: {
    code: 'SP',
    label: 'Signal Processing',
    emoji: '📡',
    colors: SUBJECT_COLOR_PALETTES.red,
  },
  HCI: {
    code: 'HCI',
    label: 'Human-Computer Interaction',
    emoji: '🖱️',
    colors: SUBJECT_COLOR_PALETTES.pink,
  },
  RO: {
    code: 'RO',
    label: 'Robotics',
    emoji: '🦾',
    colors: SUBJECT_COLOR_PALETTES.cyan,
  },
  SEC: {
    code: 'SEC',
    label: 'Security',
    emoji: '🔒',
    colors: SUBJECT_COLOR_PALETTES.teal,
  },
  PRIV: {
    code: 'PRIV',
    label: 'Privacy',
    emoji: '🔐',
    colors: SUBJECT_COLOR_PALETTES.indigo,
  },
  CONF: {
    code: 'CONF',
    label: 'General Conference',
    emoji: '🎤',
    colors: SUBJECT_COLOR_PALETTES.yellow,
  },
  SHOP: {
    code: 'SHOP',
    label: 'Workshop',
    emoji: '🛠️',
    colors: SUBJECT_COLOR_PALETTES.lime,
  },
  CG: {
    code: 'CG',
    label: 'Computer Graphics',
    emoji: '🎨',
    colors: SUBJECT_COLOR_PALETTES.violet,
  },
  KR: {
    code: 'KR',
    label: 'Knowledge Representation',
    emoji: '🧠',
    colors: SUBJECT_COLOR_PALETTES.fuchsia,
  },
  AP: {
    code: 'AP',
    label: 'Applications',
    emoji: '⚙️',
    colors: SUBJECT_COLOR_PALETTES.rose,
  },
  AI: {
    code: 'AI',
    label: 'Artificial Intelligence',
    emoji: '🧠',
    colors: SUBJECT_COLOR_PALETTES.indigo,
  },
  'Global Health': {
    code: 'Global Health',
    label: 'Global Health',
    emoji: '🏥',
    colors: SUBJECT_COLOR_PALETTES.cyan,
  },
  'Med-Imaging': {
    code: 'Med-Imaging',
    label: 'Medical Imaging',
    emoji: '🔬',
    colors: SUBJECT_COLOR_PALETTES.teal,
  },
} as const;

/**
 * Derived exports for backward compatibility
 */
export const SUBJECT_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(SUBJECTS).map(([k, v]) => [k, v.label])
);

export const SUBJECT_COLORS: Record<string, { bg: string; color: string; border: string }> =
  Object.fromEntries(Object.entries(SUBJECTS).map(([k, v]) => [k, v.colors]));

export const SUBJECT_EMOJIS: Record<string, string> = Object.fromEntries(
  Object.entries(SUBJECTS).map(([k, v]) => [k, v.emoji])
);

/**
 * Get all subject codes
 */
export const SUBJECT_CODES = Object.keys(SUBJECTS) as Array<keyof typeof SUBJECTS>;
