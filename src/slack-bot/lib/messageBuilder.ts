/**
 * Slack Block Kit Message Builder
 * Creates rich formatted messages for Slack
 */

import type { Conference, DeadlineInfo } from '@/types/conference';
import type { BlockKitMessage, UserPreferences } from '@/types/slack';
import { getDaysUntilDeadline } from '@/utils/conferenceQueries';
import { SUBJECT_LABELS, SUBJECT_EMOJIS } from '@/constants/subjects';
import {
  URGENCY_EMOJIS,
  URGENCY_CONFIG,
  COMMAND_DESCRIPTIONS,
} from '../config/constants';

/**
 * Build a conference card with deadline information
 */
export function buildConferenceCard(
  conference: Conference,
  deadline: DeadlineInfo
): BlockKitMessage {
  const daysLeft = getDaysUntilDeadline(deadline);
  const urgencyEmoji = getUrgencyEmoji(daysLeft);
  const subjects = Array.isArray(conference.sub) ? conference.sub : [conference.sub];
  const subjectText = subjects
    .map((s) => `${SUBJECT_EMOJIS[s] || '📌'} ${SUBJECT_LABELS[s] || s}`)
    .join(', ');

  const blocks: any[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${urgencyEmoji} ${conference.title} ${conference.year}`,
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${conference.full_name}*\n📍 ${conference.place}\n📆 ${conference.date}`,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*${deadline.label}*\n${deadline.localDatetime.toFormat(
            'MMM dd, yyyy HH:mm'
          )} (${deadline.datetime.zoneName})`,
        },
        {
          type: 'mrkdwn',
          text: `*Time Remaining*\n⏰ ${formatTimeRemaining(daysLeft)}`,
        },
        {
          type: 'mrkdwn',
          text: `*Subject(s)*\n${subjectText}`,
        },
        ...(conference.hindex
          ? [
              {
                type: 'mrkdwn',
                text: `*H-Index*\n📊 ${conference.hindex}`,
              },
            ]
          : []),
      ],
    },
  ];

  if (conference.note) {
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `ℹ️ ${conference.note}`,
        },
      ],
    });
  }

  const actionElements: any[] = [];

  if (conference.link) {
    actionElements.push({
      type: 'button',
      text: {
        type: 'plain_text',
        text: '🌐 View Website',
        emoji: true,
      },
      url: conference.link,
    });
  }

  actionElements.push({
    type: 'button',
    text: {
      type: 'plain_text',
      text: '📅 Add to Calendar',
      emoji: true,
    },
    action_id: `calendar_${conference.id}`,
    value: conference.id,
  });

  if (conference.paperslink) {
    actionElements.push({
      type: 'button',
      text: {
        type: 'plain_text',
        text: '📄 Papers',
        emoji: true,
      },
      url: conference.paperslink,
    });
  }

  if (actionElements.length > 0) {
    blocks.push({
      type: 'actions',
      elements: actionElements,
    });
  }

  return {
    blocks,
    text: `${conference.title} ${conference.year} - ${deadline.label}: ${daysLeft} days left`,
  };
}

/**
 * Build a list of upcoming deadlines
 */
export function buildDeadlineList(
  deadlines: Array<{ conference: Conference; deadline: DeadlineInfo }>
): BlockKitMessage {
  const blocks: any[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: '📅 Upcoming Conference Deadlines',
        emoji: true,
      },
    },
  ];

  if (deadlines.length === 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '✨ No upcoming deadlines found. Check back later!',
      },
    });

    return { blocks, text: 'No upcoming deadlines' };
  }

  deadlines.forEach(({ conference, deadline }, index) => {
    const daysLeft = getDaysUntilDeadline(deadline);
    const urgencyEmoji = getUrgencyEmoji(daysLeft);
    const subjects = Array.isArray(conference.sub) ? conference.sub : [conference.sub];
    const subjectEmojis = subjects.map((s) => SUBJECT_EMOJIS[s] || '📌').join(' ');

    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${urgencyEmoji} *${conference.title} ${conference.year}* ${subjectEmojis}\n${deadline.label}: ${deadline.localDatetime.toFormat('MMM dd, HH:mm')} • ⏰ ${formatTimeRemaining(daysLeft)}`,
      },
      accessory: {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'Details',
          emoji: true,
        },
        action_id: `details_${conference.id}`,
        value: conference.id,
      },
    });

    if (index < deadlines.length - 1) {
      blocks.push({ type: 'divider' });
    }
  });

  return {
    blocks,
    text: `${deadlines.length} upcoming deadlines`,
  };
}

/**
 * Build help message with all commands
 */
export function buildHelpMessage(): BlockKitMessage {
  const blocks: any[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: '📚 ConferenceBot Help',
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Track academic conference deadlines and get notified before important dates!',
      },
    },
    { type: 'divider' },
  ];

  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: '*Available Commands:*',
    },
  });

  Object.entries(COMMAND_DESCRIPTIONS).forEach(([cmd, desc]) => {
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `• \`/conf ${cmd}\`\n  ${desc}`,
      },
    });
  });

  blocks.push(
    { type: 'divider' },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Examples:*\n• `/conf upcoming` - See next 5 deadlines\n• `/conf search CVPR` - Find CVPR conferences\n• `/conf subject ML` - Filter by Machine Learning\n• `/conf subscribe` - Start receiving notifications',
      },
    }
  );

  return {
    blocks,
    text: 'ConferenceBot Help - Track academic conference deadlines',
  };
}

/**
 * Build settings panel with user preferences
 */
export function buildSettingsPanel(prefs: UserPreferences): BlockKitMessage {
  const blocks: any[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: '⚙️ Your Notification Settings',
        emoji: true,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Status:*\n${prefs.notificationsEnabled ? '✅ Enabled' : '❌ Disabled'}`,
        },
        {
          type: 'mrkdwn',
          text: `*Timezone:*\n🌍 ${prefs.timezone}`,
        },
        {
          type: 'mrkdwn',
          text: `*Reminder Days:*\n📆 ${prefs.reminderDays.join(', ')} days before`,
        },
        {
          type: 'mrkdwn',
          text: `*Subscribed Subjects:*\n${
            prefs.subjects.length > 0
              ? prefs.subjects.map((s) => `${SUBJECT_EMOJIS[s] || '📌'} ${s}`).join(', ')
              : 'All subjects'
          }`,
        },
      ],
    },
    { type: 'divider' },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: prefs.notificationsEnabled ? 'Disable Notifications' : 'Enable Notifications',
            emoji: true,
          },
          action_id: prefs.notificationsEnabled ? 'disable_notifications' : 'enable_notifications',
          style: prefs.notificationsEnabled ? undefined : 'primary',
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Edit Subjects',
            emoji: true,
          },
          action_id: 'edit_subjects',
        },
      ],
    },
  ];

  return {
    blocks,
    text: `Notifications: ${prefs.notificationsEnabled ? 'Enabled' : 'Disabled'}`,
  };
}

/**
 * Build error message
 */
export function buildErrorMessage(error: string): BlockKitMessage {
  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `❌ *Error:* ${error}`,
        },
      },
    ],
    text: `Error: ${error}`,
  };
}

/**
 * Build success message
 */
export function buildSuccessMessage(message: string): BlockKitMessage {
  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `✅ ${message}`,
        },
      },
    ],
    text: message,
  };
}

/**
 * Get urgency emoji based on days left
 */
function getUrgencyEmoji(daysLeft: number): string {
  if (daysLeft <= URGENCY_CONFIG.CRITICAL_DAYS) return URGENCY_EMOJIS.critical;
  if (daysLeft <= URGENCY_CONFIG.URGENT_DAYS) return URGENCY_EMOJIS.urgent;
  if (daysLeft <= URGENCY_CONFIG.UPCOMING_DAYS) return URGENCY_EMOJIS.upcoming;
  return '📅';
}

/**
 * Build user deadline notification message
 * Personalized notification sent to users about upcoming deadlines
 */
export function buildUserDeadlineNotification(
  deadlines: Array<{ conference: Conference; deadline: DeadlineInfo }>
): BlockKitMessage {
  const blocks: any[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: '🔔 Deadline Reminder',
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `You have *${deadlines.length}* upcoming conference ${
          deadlines.length === 1 ? 'deadline' : 'deadlines'
        }:`,
      },
    },
    { type: 'divider' },
  ];

  deadlines.forEach(({ conference, deadline }, index) => {
    const daysLeft = getDaysUntilDeadline(deadline);
    const urgencyEmoji = getUrgencyEmoji(daysLeft);
    const subjects = Array.isArray(conference.sub) ? conference.sub : [conference.sub];
    const subjectEmojis = subjects.map((s) => SUBJECT_EMOJIS[s] || '📌').join(' ');

    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${urgencyEmoji} *${conference.title} ${conference.year}* ${subjectEmojis}\n` +
              `${deadline.label}: ${deadline.localDatetime.toFormat('MMM dd, HH:mm')} (${deadline.datetime.zoneName})\n` +
              `⏰ ${formatTimeRemaining(daysLeft)} remaining`,
      },
    });

    // Add action buttons for each conference
    const actionElements: any[] = [];

    if (conference.link) {
      actionElements.push({
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'View Website',
          emoji: true,
        },
        url: conference.link,
      });
    }

    actionElements.push({
      type: 'button',
      text: {
        type: 'plain_text',
        text: 'Add to Calendar',
        emoji: true,
      },
      action_id: `calendar_${conference.id}`,
      value: conference.id,
    });

    if (actionElements.length > 0) {
      blocks.push({
        type: 'actions',
        elements: actionElements,
      });
    }

    if (index < deadlines.length - 1) {
      blocks.push({ type: 'divider' });
    }
  });

  // Add footer with helpful info
  blocks.push(
    { type: 'divider' },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `💡 Use \`/conf settings\` to manage your notification preferences or \`/conf unsubscribe\` to stop receiving these reminders.`,
        },
      ],
    }
  );

  return {
    blocks,
    text: `Deadline Reminder: ${deadlines.length} upcoming ${
      deadlines.length === 1 ? 'deadline' : 'deadlines'
    }`,
  };
}

/**
 * Format time remaining in human-readable format
 */
function formatTimeRemaining(days: number): string {
  if (days < 0) return 'Expired';
  if (days === 0) return 'Today!';
  if (days === 1) return '1 day';
  if (days < 7) return `${days} days`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? '1 week' : `${weeks} weeks`;
  }
  const months = Math.floor(days / 30);
  return months === 1 ? '1 month' : `${months} months`;
}
