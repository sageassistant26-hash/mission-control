import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const APPROVALS_FILE = path.join(
  process.env.HOME || '/Users/sage',
  '.openclaw/workspace/approvals-queue.json'
);

export async function GET() {
  try {
    const raw = await readFile(APPROVALS_FILE, 'utf-8');
    const items = JSON.parse(raw);
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req: Request) {
  try {
    const { id, action } = await req.json(); // action: 'approve' | 'reject'
    const raw = await readFile(APPROVALS_FILE, 'utf-8');
    const items = JSON.parse(raw);
    const updated = items.map((item: { id: string; status: string; resolvedAt?: string }) =>
      item.id === id
        ? { ...item, status: action === 'approve' ? 'approved' : 'rejected', resolvedAt: new Date().toISOString() }
        : item
    );
    await writeFile(APPROVALS_FILE, JSON.stringify(updated, null, 2));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
