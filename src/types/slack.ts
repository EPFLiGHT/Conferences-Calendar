/**
 * Slack Bot Type Definitions
 */

/**
 * Slack slash command payload
 */
export interface SlackCommand {
  token: string;
  team_id: string;
  team_domain: string;
  channel_id: string;
  channel_name: string;
  user_id: string;
  user_name: string;
  command: string; // e.g., "/conf"
  text: string; // e.g., "upcoming" or "search CVPR"
  api_app_id: string;
  is_enterprise_install: string;
  response_url: string;
  trigger_id: string;
}

/**
 * Slack interaction payload (button clicks, menu selections)
 */
export interface SlackInteraction {
  type: string; // "block_actions", "view_submission", etc.
  user: {
    id: string;
    username: string;
    name: string;
    team_id: string;
  };
  api_app_id: string;
  token: string;
  container: {
    type: string;
    message_ts: string;
    channel_id: string;
    is_ephemeral: boolean;
  };
  trigger_id: string;
  team: {
    id: string;
    domain: string;
  };
  channel: {
    id: string;
    name: string;
  };
  message: {
    type: string;
    subtype?: string;
    text: string;
    ts: string;
    bot_id?: string;
  };
  response_url: string;
  actions: Array<{
    action_id: string;
    block_id: string;
    text: {
      type: string;
      text: string;
      emoji: boolean;
    };
    value?: string;
    type: string;
    action_ts: string;
  }>;
}

/**
 * User preferences stored in Vercel KV
 */
export interface UserPreferences {
  slackUserId: string;
  teamId?: string; // Slack workspace/team ID (for multi-workspace support)
  notificationsEnabled: boolean;
  timezone: string; // IANA timezone (from Slack profile or manually set)
  reminderDays: number[]; // Days before deadline to notify (e.g., [30, 7, 3])
  subjects: string[]; // Subscribed subjects (e.g., ['ML', 'CV', 'SEC'])
  lastNotified: string; // ISO timestamp of last notification sent
  createdAt: string; // ISO timestamp when preferences created
  updatedAt: string; // ISO timestamp when preferences last updated
}

/**
 * Slack Block Kit message structure
 */
export interface BlockKitMessage {
  blocks: BlockElement[];
  text?: string; // Fallback text for notifications
  response_type?: 'ephemeral' | 'in_channel'; // Message visibility
}

/**
 * Block Kit element types
 */
export type BlockElement =
  | HeaderBlock
  | SectionBlock
  | DividerBlock
  | ActionsBlock
  | ContextBlock;

export interface HeaderBlock {
  type: 'header';
  text: {
    type: 'plain_text';
    text: string;
    emoji?: boolean;
  };
  block_id?: string;
}

export interface SectionBlock {
  type: 'section';
  text?: {
    type: 'mrkdwn' | 'plain_text';
    text: string;
  };
  fields?: Array<{
    type: 'mrkdwn' | 'plain_text';
    text: string;
  }>;
  accessory?: BlockAccessory;
  block_id?: string;
}

export interface DividerBlock {
  type: 'divider';
  block_id?: string;
}

export interface ActionsBlock {
  type: 'actions';
  elements: Array<ButtonElement | SelectMenuElement>;
  block_id?: string;
}

export interface ContextBlock {
  type: 'context';
  elements: Array<{
    type: 'mrkdwn' | 'plain_text' | 'image';
    text?: string;
    image_url?: string;
    alt_text?: string;
  }>;
  block_id?: string;
}

export interface ButtonElement {
  type: 'button';
  text: {
    type: 'plain_text';
    text: string;
    emoji?: boolean;
  };
  action_id: string;
  url?: string; // For link buttons
  value?: string; // For action buttons
  style?: 'primary' | 'danger';
}

export interface SelectMenuElement {
  type: 'static_select' | 'multi_static_select';
  placeholder: {
    type: 'plain_text';
    text: string;
    emoji?: boolean;
  };
  action_id: string;
  options: Array<{
    text: {
      type: 'plain_text';
      text: string;
      emoji?: boolean;
    };
    value: string;
  }>;
}

export type BlockAccessory = ButtonElement | SelectMenuElement;

/**
 * Notification urgency levels
 */
export enum NotificationUrgency {
  CRITICAL = 'critical', // 24 hours or less
  URGENT = 'urgent', // 3 days or less
  UPCOMING = 'upcoming', // 7 days or less
}

/**
 * Command response types
 */
export interface CommandResponse {
  success: boolean;
  message?: BlockKitMessage;
  error?: string;
}

/**
 * Cron job result
 */
export interface CronJobResult {
  success: boolean;
  notificationsSent: number;
  errors: string[];
  timestamp: string;
}
