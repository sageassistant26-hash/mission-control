/**
 * reseed-tasks.ts
 * Deletes all existing tasks and inserts real current tasks.
 * Run AFTER reseed-agents.ts: npx tsx scripts/reseed-tasks.ts
 */

import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'mission-control.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
// Disable FK enforcement for bulk seed operations
db.pragma('foreign_keys = OFF');

const WORKSPACE_ID = 'default';
const BUSINESS_ID = 'default';
const now = new Date().toISOString();

// Load agent IDs from reseed-agents run
const agentIdsPath = path.join(process.cwd(), 'scripts/.agent-ids.json');
let agentMap: Record<string, string> = {};
if (fs.existsSync(agentIdsPath)) {
  agentMap = JSON.parse(fs.readFileSync(agentIdsPath, 'utf-8'));
} else {
  // Fall back to querying DB
  const agents = db.prepare('SELECT name, id FROM agents').all() as { name: string; id: string }[];
  for (const a of agents) agentMap[a.name] = a.id;
}

const emberId = agentMap['Ember 🔥'] || null;
const forgeId = agentMap['Forge 💻'] || null;
const scoutId = agentMap['Scout 🔬'] || null;
const sparkId = agentMap['Spark ⚡'] || null;

console.log('🗑️  Clearing existing tasks and related data...');
db.prepare('DELETE FROM task_deliverables').run();
db.prepare('DELETE FROM task_activities').run();
db.prepare('DELETE FROM planning_questions').run();
db.prepare('DELETE FROM planning_specs').run();
db.prepare('DELETE FROM tasks').run();

console.log('✅ Cleared. Inserting real tasks...\n');

interface TaskInput {
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_agent_id: string | null;
}

const tasks: TaskInput[] = [
  // ── IN PROGRESS (Ember) ──
  {
    title: 'Deploy clawmentor.ai to Vercel',
    description: 'Roberto needs to import blank-canvas to Vercel, point DNS. Ember guides.',
    status: 'in_progress',
    priority: 'high',
    assigned_agent_id: emberId,
  },
  {
    title: 'Supabase setup',
    description: 'Create project, run SQL schema, add env vars to Vercel.',
    status: 'in_progress',
    priority: 'high',
    assigned_agent_id: emberId,
  },
  {
    title: 'Mission Control overhaul',
    description: 'Fix tasks board, agents, planning tab, live feed. (This one — in progress now)',
    status: 'live_activity',
    priority: 'high',
    assigned_agent_id: emberId,
  },

  // ── BACKLOG — Claw Mentor Phase 0 ──
  {
    title: 'Claw Mentor app repo setup',
    description: 'Create claw-mentor-app GitHub repo, scaffold structure.',
    status: 'backlog',
    priority: 'high',
    assigned_agent_id: forgeId,
  },
  {
    title: 'Analysis engine v1',
    description: 'User pastes AGENTS.md, gets compatibility report.',
    status: 'backlog',
    priority: 'high',
    assigned_agent_id: forgeId,
  },
  {
    title: 'User dashboard + Stripe integration',
    description: 'Web UI for subscribers, payment flow.',
    status: 'backlog',
    priority: 'normal',
    assigned_agent_id: null,
  },
  {
    title: 'Tech With Tim outreach',
    description: 'DM draft ready in mentor-playbook.md. Wait for working demo first.',
    status: 'backlog',
    priority: 'normal',
    assigned_agent_id: null,
  },
  {
    title: 'Create @ClawMentor X account',
    description: 'Then run week 1 content calendar.',
    status: 'backlog',
    priority: 'normal',
    assigned_agent_id: sparkId,
  },
  {
    title: 'Raise Formula audit',
    description: 'Review funnel performance, decide pause vs continue.',
    status: 'backlog',
    priority: 'low',
    assigned_agent_id: null,
  },
  {
    title: 'Update roadmap.md with accelerated timeline',
    description: 'Day 10/17/35 targets.',
    status: 'backlog',
    priority: 'normal',
    assigned_agent_id: emberId,
  },

  // ── RECURRING ──
  {
    title: 'Morning Brief — 7:30 AM',
    description: 'Ember delivers daily brief to Roberto via Telegram.',
    status: 'recurring',
    priority: 'normal',
    assigned_agent_id: emberId,
  },
  {
    title: 'Scout Intel Run — 3:00 AM',
    description: 'Daily ecosystem scan.',
    status: 'recurring',
    priority: 'normal',
    assigned_agent_id: scoutId,
  },
  {
    title: 'Forge Build Session — 1:00 AM',
    description: 'Nightly coding on claw-mentor-app.',
    status: 'recurring',
    priority: 'normal',
    assigned_agent_id: forgeId,
  },
  {
    title: 'Spark Content Drafts — 9:00 AM',
    description: 'Daily social content drafts for review.',
    status: 'recurring',
    priority: 'normal',
    assigned_agent_id: sparkId,
  },
];

const insert = db.prepare(`
  INSERT INTO tasks (id, title, description, status, priority, assigned_agent_id, workspace_id, business_id, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const task of tasks) {
  insert.run(
    uuidv4(),
    task.title,
    task.description,
    task.status,
    task.priority,
    task.assigned_agent_id,
    WORKSPACE_ID,
    BUSINESS_ID,
    now,
    now
  );
  console.log(`  ✓ [${task.status}] ${task.title}`);
}

// Seed a few fresh live feed events
console.log('\n📡 Seeding fresh live feed events...');
db.prepare('DELETE FROM events').run();

const events = [
  { type: 'system', agent_id: emberId, message: 'Mission Control overhaul initiated by Ember 🔥' },
  { type: 'agent_joined', agent_id: emberId, message: 'Ember 🔥 is online — Chief of Staff session active' },
  { type: 'task_status_changed', agent_id: emberId, message: 'Task "Mission Control overhaul" → 🔥 LIVE ACTIVITY' },
  { type: 'agent_joined', agent_id: forgeId, message: 'Forge 💻 added to team — scheduled for 1 AM build sessions' },
  { type: 'agent_joined', agent_id: scoutId, message: 'Scout 🔬 added — daily intel at 3 AM' },
  { type: 'agent_joined', agent_id: sparkId, message: 'Spark ⚡ added — content drafts at 9 AM' },
  { type: 'task_created', agent_id: emberId, message: 'Phase 0 tasks loaded — Claw Mentor launch in progress' },
  { type: 'system', agent_id: null, message: 'Mission Control ready. Let\'s ship.' },
];

const insertEvent = db.prepare(`
  INSERT INTO events (id, type, agent_id, message, created_at)
  VALUES (?, ?, ?, ?, ?)
`);

for (const event of events) {
  insertEvent.run(uuidv4(), event.type, event.agent_id, event.message, now);
}

console.log(`  ✓ ${events.length} events seeded`);
console.log('\n🎉 Tasks reseeded successfully!');
console.log(`   ${tasks.length} tasks · ${events.length} live feed events`);

db.close();
