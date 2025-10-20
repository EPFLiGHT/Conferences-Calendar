import { NextResponse } from 'next/server';

/**
 * Standard response builders for consistent API responses
 */

export interface SlackResponse {
  ok?: boolean;
  text?: string;
  error?: string;
  [key: string]: unknown;
}

/**
 * Create a success response
 */
export function successResponse(
  data: SlackResponse = {},
  status = 200
): NextResponse {
  return NextResponse.json(data, { status });
}

/**
 * Create an error response
 */
export function errorResponse(
  message: string,
  status = 500
): NextResponse {
  return NextResponse.json(
    { error: message },
    { status }
  );
}

/**
 * Create a Slack-formatted text response
 */
export function textResponse(
  text: string,
  responseType: 'ephemeral' | 'in_channel' = 'in_channel'
): NextResponse {
  return NextResponse.json({
    text,
    response_type: responseType,
  });
}

/**
 * Create an unauthorized response
 */
export function unauthorizedResponse(
  message = 'Unauthorized'
): NextResponse {
  return errorResponse(message, 401);
}

/**
 * Create a bad request response
 */
export function badRequestResponse(
  message = 'Bad request'
): NextResponse {
  return errorResponse(message, 400);
}

/**
 * Create a not found response
 */
export function notFoundResponse(
  message = 'Not found'
): NextResponse {
  return errorResponse(message, 404);
}

/**
 * Acknowledge Slack request immediately (for async processing)
 */
export function acknowledgeResponse(): NextResponse {
  return NextResponse.json({ ok: true });
}
