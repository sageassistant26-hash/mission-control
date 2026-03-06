import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { exec } from 'child_process';
import path from 'path';

const APPROVALS_FILE = path.join(
  process.env.HOME || '/Users/sage',
  '.openclaw/workspace/approvals-queue.json'
);

function readQueue(raw: string) {
  const parsed = JSON.parse(raw);
  // Handle both formats: { queue: [...] } or [...]
  if (Array.isArray(parsed)) return parsed;
  if (parsed.queue && Array.isArray(parsed.queue)) return parsed.queue;
  return [];
}

function writeQueue(items: unknown[]) {
  return JSON.stringify({ version: 1, queue: items }, null, 2);
}

export async function GET() {
  try {
    const raw = await readFile(APPROVALS_FILE, 'utf-8');
    const items = readQueue(raw);
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req: Request) {
  try {
    const { id, action } = await req.json(); // action: 'approve' | 'reject'
    const raw = await readFile(APPROVALS_FILE, 'utf-8');
    const items = readQueue(raw);
    
    let matchedTitle = '';
    const updated = items.map((item: { id: string; title?: string; status: string; resolvedAt?: string }) => {
      if (item.id === id) {
        matchedTitle = item.title || item.id;
        return { ...item, status: action === 'approve' ? 'approved' : 'rejected', resolvedAt: new Date().toISOString() };
      }
      return item;
    });
    
    await writeFile(APPROVALS_FILE, writeQueue(updated));

    // Notify Ember via openclaw system event
    if (matchedTitle) {
      const status = action === 'approve' ? 'APPROVED' : 'REJECTED';
      const msg = `Mission Control: Roberto ${status} "${matchedTitle}"`;
      exec(`openclaw system event --text "${msg.replace(/"/g, '\\"')}" --mode now`, (err) => {
        if (err) console.error('Failed to notify agent:', err.message);
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
