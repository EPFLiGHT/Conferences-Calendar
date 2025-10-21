import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Simple test endpoint to verify API routes are working
 */
export async function GET() {
  return NextResponse.json({
    status: 'OK',
    message: 'OAuth routes are accessible',
    timestamp: new Date().toISOString(),
    env: {
      hasClientId: !!process.env.SLACK_CLIENT_ID,
      hasClientSecret: !!process.env.SLACK_CLIENT_SECRET,
      hasAppUrl: !!process.env.APP_URL,
      nodeEnv: process.env.NODE_ENV
    }
  });
}
