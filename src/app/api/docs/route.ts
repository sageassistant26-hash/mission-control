import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const WORKSPACE_ROOT = '/Users/sage/.openclaw/workspace';
const PROJECTS_DIR = path.join(WORKSPACE_ROOT, 'projects');

// Root-level workspace files to always include
const ROOT_FILES = [
  'SOUL.md',
  'AGENTS.md',
  'SECURITY.md',
  'SOCIAL_MEDIA_POLICY.md',
  'WORKFLOW_AUTO.md',
  'MEMORY.md',
  'HEARTBEAT.md',
];

function walkMd(dir: string, base = ''): { name: string; path: string; content: string; section: string }[] {
  const results: { name: string; path: string; content: string; section: string }[] = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMd(full, rel));
    } else if (entry.name.endsWith('.md')) {
      results.push({ name: rel, path: full, content: fs.readFileSync(full, 'utf-8'), section: 'projects' });
    }
  }
  return results;
}

export async function GET() {
  const docs: { name: string; path: string; content: string; section: string }[] = [];

  // Include important root workspace files first
  for (const file of ROOT_FILES) {
    const full = path.join(WORKSPACE_ROOT, file);
    if (fs.existsSync(full)) {
      docs.push({
        name: file,
        path: full,
        content: fs.readFileSync(full, 'utf-8'),
        section: 'workspace',
      });
    }
  }

  // Then include all project docs
  docs.push(...walkMd(PROJECTS_DIR));

  return NextResponse.json(docs);
}
