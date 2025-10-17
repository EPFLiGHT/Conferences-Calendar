import { NextRequest, NextResponse } from 'next/server';
import { verifySlackRequest } from './slackVerify';

/**
 * Types for Slack request handlers
 */
export type SlackRequestHandler<T = unknown> = (
  parsedBody: T,
  request: NextRequest
) => Promise<NextResponse> | NextResponse;

export type SlackAuthConfig = {
  requireAuth?: boolean;
  authSecret?: string;
};

/**
 * Configuration for different Slack request types
 */
export enum SlackRequestType {
  FORM_URLENCODED = 'form', // Slash commands, interactions
  JSON = 'json',             // Events API
  CRON = 'cron',            // Cron jobs (no Slack verification)
}

/**
 * Middleware options
 */
export interface MiddlewareOptions<T> {
  requestType: SlackRequestType;
  handler: SlackRequestHandler<T>;
  authConfig?: SlackAuthConfig;
}

/**
 * Parse request body based on content type
 */
async function parseRequestBody(
  body: string,
  requestType: SlackRequestType
): Promise<unknown> {
  switch (requestType) {
    case SlackRequestType.FORM_URLENCODED: {
      const params = new URLSearchParams(body);
      const payload = params.get('payload');

      // If there's a payload field, it's an interaction (JSON-encoded)
      if (payload) {
        return JSON.parse(payload);
      }

      // Otherwise, it's a slash command (form fields)
      return Object.fromEntries(params.entries());
    }

    case SlackRequestType.JSON:
      return JSON.parse(body);

    case SlackRequestType.CRON:
      return {}; // Cron jobs don't have a body to parse

    default:
      throw new Error(`Unsupported request type: ${requestType}`);
  }
}

/**
 * Verify cron request authentication
 */
function verifyCronAuth(
  headers: Headers,
  authConfig?: SlackAuthConfig
): boolean {
  if (!authConfig?.requireAuth) {
    return true;
  }

  const authHeader = headers.get('authorization');
  const cronSecret = authConfig.authSecret || process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return false;
  }

  return true;
}

/**
 * Main middleware wrapper for Slack API routes
 * Handles verification, parsing, error handling, and response formatting
 */
export function withSlackMiddleware<T>(
  options: MiddlewareOptions<T>
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const body = await request.text();

      // Handle cron authentication separately
      if (options.requestType === SlackRequestType.CRON) {
        const isAuthorized = verifyCronAuth(request.headers, options.authConfig);
        if (!isAuthorized) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          );
        }

        return await options.handler({} as T, request);
      }

      // Verify Slack request signature for non-cron requests
      const isValid = await verifySlackRequest(request.headers, body);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }

      // Parse the request body
      const parsedBody = await parseRequestBody(body, options.requestType);

      // Call the handler with parsed body
      return await options.handler(parsedBody as T, request);
    } catch (error) {
      console.error('Error in Slack middleware:', error);

      // Differentiate between parsing errors and handler errors
      if (error instanceof SyntaxError) {
        return NextResponse.json(
          { error: 'Invalid request format' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
