import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PROJECTS_DIR = '/Users/sage/.openclaw/workspace/projects';

function walkMd(dir: string, base = ''): { name: string; path: string; content: string }[] {
  const results: { name: string; path: string; content: string }[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMd(full, rel));
    } else if (entry.name.endsWith('.md')) {
      results.push({ name: rel, path: full, content: fs.readFileSync(full, 'utf-8') });
    }
  }
  return results;
}

export async function GET() {
  const docs = walkMd(PROJECTS_DIR);
  return NextResponse.json(docs);
}
