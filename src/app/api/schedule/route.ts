import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CRON_FILE = path.join(process.env.HOME || '/Users/sage', '.openclaw/cron/jobs.json');

export async function GET() {
  try {
    const raw = fs.readFileSync(CRON_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return NextResponse.json(data.jobs || []);
  } catch {
    return NextResponse.json([]);
  }
}
