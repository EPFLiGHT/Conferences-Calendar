import { NextRequest, NextResponse } from 'next/server';
import { parseConferences } from '@/utils/parser';
import { conferenceToICSEvents, createICSContent } from '@/utils/ics';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/calendar/[conferenceId]
 * Download ICS calendar file for a specific conference
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { conferenceId: string } }
): Promise<NextResponse> {
  try {
    const { conferenceId } = params;

    // Fetch and parse conference data
    const baseUrl = process.env.CONFERENCES_DATA_URL;
    const yamlUrl = `${baseUrl}/data/conferences.yaml`;

    const response = await fetch(yamlUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch conference data' },
        { status: 500 }
      );
    }

    const yamlText = await response.text();
    const conferences = parseConferences(yamlText);

    // Find the specific conference
    const conference = conferences.find((c) => c.id === conferenceId);

    if (!conference) {
      return NextResponse.json(
        { error: `Conference not found: ${conferenceId}` },
        { status: 404 }
      );
    }

    // Generate ICS content
    const events = conferenceToICSEvents(conference);
    if (events.length === 0) {
      return NextResponse.json(
        { error: 'No calendar events available for this conference' },
        { status: 404 }
      );
    }

    const icsContent = createICSContent(events);

    // Return ICS file
    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${conferenceId}-deadlines.ics"`,
      },
    });
  } catch (error) {
    console.error('Error generating calendar:', error);
    return NextResponse.json(
      { error: 'Failed to generate calendar file' },
      { status: 500 }
    );
  }
}
