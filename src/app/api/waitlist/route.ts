// GET /api/waitlist
// Returns the mentor interest waitlist from Supabase.
// Read-only — for display in Mission Control's Waitlist tab.
//
// Requires in .env.local:
//   SUPABASE_URL=https://xxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
//
// Run in Supabase SQL editor first:
//   CREATE TABLE IF NOT EXISTS waitlist (
//     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//     email text UNIQUE NOT NULL,
//     source text,
//     notes text,
//     created_at timestamptz DEFAULT now()
//   );

import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format'); // 'csv' or null (default: json)

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json(
      {
        error: 'Supabase not configured',
        hint: 'Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to mission-control/.env.local',
      },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/waitlist?select=id,email,source,metadata,created_at&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.warn('[waitlist] Supabase error:', res.status, text);
      return NextResponse.json({ error: 'Supabase query failed', detail: text }, { status: 502 });
    }

    const rows = await res.json();

    // CSV download
    if (format === 'csv') {
      const headers = ['email', 'source', 'metadata', 'created_at'];
      const csv = [
        headers.join(','),
        ...rows.map((r: Record<string, unknown>) =>
          headers
            .map(h => {
              const v = String(r[h] ?? '');
              return v.includes(',') || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v;
            })
            .join(',')
        ),
      ].join('\n');

      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="mentor-waitlist-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    return NextResponse.json({ rows, count: rows.length });
  } catch (err) {
    console.error('[waitlist] exception:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
