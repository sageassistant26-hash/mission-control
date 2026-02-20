/**
 * reseed-agents.ts
 * Deletes all existing agents and inserts real team agents.
 * Run: npx tsx scripts/reseed-agents.ts
 */

import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'mission-control.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
// Disable FK enforcement for bulk seed operations
db.pragma('foreign_keys = OFF');

const WORKSPACE_ID = 'default';
const now = new Date().toISOString();

console.log('🗑️  Clearing existing agents...');

// Delete in order to avoid FK violations
db.prepare('DELETE FROM openclaw_sessions').run();
db.prepare('DELETE FROM task_activities').run();
db.prepare('DELETE FROM conversation_participants').run();
db.prepare('DELETE FROM messages').run();
db.prepare('DELETE FROM conversations').run();
// Unassign tasks before deleting agents
db.prepare('UPDATE tasks SET assigned_agent_id = NULL, created_by_agent_id = NULL').run();
db.prepare('DELETE FROM agents').run();

console.log('✅ Cleared. Inserting real agents...');

const agents = [
  {
    id: uuidv4(),
    name: 'Roberto Chavarria',
    role: 'Founder',
    description: 'The human. Sets the direction, makes the calls.',
    avatar_emoji: '👤',
    status: 'active',
    is_master: 0,
    model: null,
  },
  {
    id: uuidv4(),
    name: 'Ember 🔥',
    role: 'Chief of Staff',
    description: 'Strategizes, builds, ships. Main session — always on.',
    avatar_emoji: '🔥',
    status: 'active',
    is_master: 1,
    model: 'claude-sonnet-4-6',
  },
  {
    id: uuidv4(),
    name: 'Forge 💻',
    role: 'Coding Agent',
    description: 'Nightly coding at 1 AM. Builds Claw Mentor. Uses Codex for actual code.',
    avatar_emoji: '💻',
    status: 'scheduled',
    is_master: 0,
    model: 'deepseek-v3 (via openrouter)',
  },
  {
    id: uuidv4(),
    name: 'Scout 🔬',
    role: 'Intel Agent',
    description: 'Daily intel at 3 AM. Scans OpenClaw ecosystem, competitors, risks.',
    avatar_emoji: '🔬',
    status: 'scheduled',
    is_master: 0,
    model: 'deepseek-v3 (via openrouter)',
  },
  {
    id: uuidv4(),
    name: 'Spark ⚡',
    role: 'Social Media Agent',
    description: 'Daily content drafts at 9 AM. Drafts only, never posts.',
    avatar_emoji: '⚡',
    status: 'scheduled',
    is_master: 0,
    model: 'gemini-flash-lite (via openrouter)',
  },
];

const insert = db.prepare(`
  INSERT INTO agents (id, name, role, description, avatar_emoji, status, is_master, workspace_id, model, source, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'local', ?, ?)
`);

for (const agent of agents) {
  insert.run(
    agent.id,
    agent.name,
    agent.role,
    agent.description,
    agent.avatar_emoji,
    agent.status,
    agent.is_master,
    WORKSPACE_ID,
    agent.model,
    now,
    now
  );
  console.log(`  ✓ ${agent.avatar_emoji} ${agent.name} — ${agent.role} [${agent.status}]`);
}

// Save agent IDs for use by reseed-tasks
import fs from 'fs';
const agentMap: Record<string, string> = {};
for (const a of agents) {
  agentMap[a.name] = a.id;
}
fs.writeFileSync(path.join(process.cwd(), 'scripts/.agent-ids.json'), JSON.stringify(agentMap, null, 2));

console.log('\n🎉 Agents reseeded successfully!');
console.log(`   Agent IDs saved to scripts/.agent-ids.json for task seeding`);

db.close();
