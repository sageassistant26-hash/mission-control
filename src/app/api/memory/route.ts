import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const WORKSPACE = '/Users/sage/.openclaw/workspace';

const FILES = [
  { name: 'IDENTITY.md', emoji: '🔥' },
  { name: 'SOUL.md', emoji: '🧠' },
  { name: 'USER.md', emoji: '👤' },
  { name: 'MEMORY.md', emoji: '💾' },
];

export async function GET() {
  const results = FILES.map(({ name, emoji }) => {
    const filePath = path.join(WORKSPACE, name);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return { name, emoji, content, exists: true };
    } catch {
      return { name, emoji, content: '_File not found._', exists: false };
    }
  });
  return NextResponse.json(results);
}
