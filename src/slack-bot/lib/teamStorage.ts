/**
 * Team Token Storage
 *
 * Manages storage and retrieval of Slack workspace tokens in Vercel KV.
 * Supports multiple workspace installations with OAuth.
 */

import { kv } from '@vercel/kv';

interface TeamMetadata {
  teamName: string;
  botUserId: string;
  installedAt: string;
  scope: string;
  appId: string;
}

/**
 * Store a bot token for a specific team
 */
export async function storeTeamToken(teamId: string, botToken: string): Promise<void> {
  const key = `slack:team:${teamId}:token`;
  await kv.set(key, botToken);
  console.log(`✅ Stored token for team: ${teamId}`);
}

/**
 * Retrieve a bot token for a specific team
 */
export async function getTeamToken(teamId: string): Promise<string | null> {
  const key = `slack:team:${teamId}:token`;
  const token = await kv.get<string>(key);

  if (!token) {
    console.warn(`⚠️  No token found for team: ${teamId}`);
    return null;
  }

  return token;
}

/**
 * Store metadata about a team installation
 */
export async function storeTeamMetadata(
  teamId: string,
  metadata: TeamMetadata
): Promise<void> {
  const key = `slack:team:${teamId}:metadata`;
  await kv.set(key, JSON.stringify(metadata));
  console.log(`✅ Stored metadata for team: ${teamId}`);
}

/**
 * Retrieve metadata about a team installation
 */
export async function getTeamMetadata(teamId: string): Promise<TeamMetadata | null> {
  const key = `slack:team:${teamId}:metadata`;
  const metadata = await kv.get<string>(key);

  if (!metadata) {
    return null;
  }

  return JSON.parse(metadata);
}

/**
 * Remove all data for a team (when app is uninstalled)
 */
export async function removeTeamData(teamId: string): Promise<void> {
  const tokenKey = `slack:team:${teamId}:token`;
  const metadataKey = `slack:team:${teamId}:metadata`;

  await Promise.all([
    kv.del(tokenKey),
    kv.del(metadataKey),
  ]);

  console.log(`🗑️  Removed all data for team: ${teamId}`);
}

/**
 * List all installed teams (for admin purposes)
 */
export async function listInstalledTeams(): Promise<string[]> {
  const keys = await kv.keys('slack:team:*:metadata');
  return keys.map(key => {
    const match = key.match(/slack:team:([^:]+):metadata/);
    return match ? match[1] : '';
  }).filter(Boolean);
}

/**
 * Fallback to environment variable token (for backward compatibility)
 * This allows the bot to work with both OAuth and legacy single-token mode
 */
export async function getTokenWithFallback(teamId?: string): Promise<string> {
  // If we have a team ID, try to get the OAuth token
  if (teamId) {
    const oauthToken = await getTeamToken(teamId);
    if (oauthToken) {
      return oauthToken;
    }
    console.warn(`⚠️  No OAuth token for team ${teamId}, falling back to env var`);
  }

  // Fallback to environment variable (legacy mode)
  const envToken = process.env.SLACK_BOT_TOKEN;
  if (!envToken) {
    throw new Error(
      'No Slack token available. Either configure SLACK_BOT_TOKEN or complete OAuth installation.'
    );
  }

  return envToken;
}
