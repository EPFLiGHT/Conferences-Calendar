/**
 * Slack Web API Client
 * Provides a singleton instance of the Slack Web API client
 */

import { WebClient } from '@slack/web-api';

let slackClient: WebClient | null = null;

/**
 * Get or create the Slack Web API client
 */
export function getSlackClient(): WebClient {
  if (!slackClient) {
    const token = process.env.SLACK_BOT_TOKEN;

    if (!token) {
      throw new Error(
        'SLACK_BOT_TOKEN is not configured. Please add it to your environment variables.'
      );
    }

    slackClient = new WebClient(token);
  }

  return slackClient;
}

/**
 * Post a message to a Slack channel
 */
export async function postToChannel(
  channelId: string,
  blocks: any[],
  text: string
): Promise<void> {
  const client = getSlackClient();

  await client.chat.postMessage({
    channel: channelId,
    blocks,
    text, // Fallback text for notifications
  });
}
