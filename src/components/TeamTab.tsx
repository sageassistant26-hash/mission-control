'use client';

const MISSION = "Build and ship AI-powered businesses that generate $10k/month in additional income by end of 2026 and $2.5M in assets within 5 years — creating financial freedom for Roberto and Alison, providing for their family, and freeing Roberto's focus and energy for The Society's life-changing work.";

interface AgentCard {
  emoji: string;
  name: string;
  title: string;
  description: string;
  tags: string[];
  status: 'active' | 'planned';
  model?: string;
}

const EMBER: AgentCard = {
  emoji: '🔥',
  name: 'Ember',
  title: 'Chief of Staff',
  description: 'Strategizes, builds, ships, and keeps the mission moving. The first point of contact between Roberto and the machine. Wakes up every session ready to work.',
  tags: ['Strategy', 'CTO', 'CFO', 'Marketing', 'Critical Thinking'],
  status: 'active',
  model: 'Claude Sonnet 4.6',
};

const FIRE_TEAM: AgentCard[] = [
  {
    emoji: '💻',
    name: 'Forge',
    title: 'Engineering',
    description: 'Builds and ships features. Picks tasks from the queue, commits to dev branch, and flags anything needing approval before proceeding.',
    tags: ['Code', 'Shipping', 'Dev Branch'],
    status: 'active',
    model: 'Claude Sonnet + Codex ACP',
  },
  {
    emoji: '⚡',
    name: 'Spark',
    title: 'Social & Content',
    description: 'Drafts content for @ClawMentor and @heyember. Never posts autonomously — all drafts queued for Ember review. Sandboxed from external content.',
    tags: ['@ClawMentor', '@heyember', 'Drafts Only'],
    status: 'active',
    model: 'Claude Sonnet',
  },
  {
    emoji: '⚡',
    name: 'Flash',
    title: 'Research & Intel',
    description: 'Scans OpenClaw ecosystem, ClawHub, GitHub, and AI agent market for opportunities, risks, and timing signals. Outputs structured digests for Ember\'s strategy review.',
    tags: ['Web Search', 'Market Intel', 'Risk Radar'],
    status: 'active',
    model: 'DeepSeek V3',
  },
  {
    emoji: '🔦',
    name: 'Beacon',
    title: 'Ops & Monitoring',
    description: 'Watches system health, cron jobs, service uptime, and agent activity. Alerts on anomalies before they become crises.',
    tags: ['Uptime', 'Alerts', 'Health'],
    status: 'active',
    model: 'DeepSeek V3',
  },
  {
    emoji: '🩹',
    name: 'Patch',
    title: 'OpenClaw Evolution / Product Prototype',
    description: 'Maintains and evolves OpenClaw skills, workspace tooling, and prototype product flows. The agent that improves the agents.',
    tags: ['Skills', 'Workspace', 'Product'],
    status: 'active',
    model: 'Claude Sonnet',
  },
  {
    emoji: '🔥',
    name: 'Furnace',
    title: 'Finance & Analytics',
    description: 'Tracks expenses, revenue, and projections. Keeps the mission financially grounded with real numbers and honest forecasts.',
    tags: ['Revenue', 'Expenses', 'Projections'],
    status: 'active',
    model: 'DeepSeek V3',
  },
  {
    emoji: '🔥',
    name: 'Torch',
    title: 'Outreach & CRM',
    description: 'Manages prospect lists, drafts outreach, and tracks relationship status. All sends require Roberto approval — Torch drafts, humans decide.',
    tags: ['Outreach', 'CRM', 'Drafts Only'],
    status: 'active',
    model: 'Claude Sonnet',
  },
  {
    emoji: '🏠',
    name: 'Hearth',
    title: 'Personal Finance',
    description: 'Tracks household finances, IVF costs, savings goals, and the path to $2.5M in assets. Keeps the human mission funded.',
    tags: ['Household', 'Savings', 'Goals'],
    status: 'active',
    model: 'Claude Sonnet',
  },
  {
    emoji: '📈',
    name: 'Fuego',
    title: 'Trading & Markets',
    description: 'Market research, portfolio tracking, and trading signal analysis. Watches macro shifts and asset allocation opportunities.',
    tags: ['Markets', 'Portfolio', 'Macro'],
    status: 'planned',
    model: 'TBD / Planned',
  },
];

function TagPill({ label, color = 'default' }: { label: string; color?: string }) {
  const colors: Record<string, string> = {
    default: 'bg-mc-bg-tertiary border-mc-border text-mc-text-secondary',
    blue: 'bg-blue-900/30 border-blue-500/30 text-blue-300',
    purple: 'bg-purple-900/30 border-purple-500/30 text-purple-300',
    green: 'bg-green-900/30 border-green-500/30 text-green-300',
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs border font-medium ${colors[color] || colors.default}`}>
      {label}
    </span>
  );
}

export function TeamTab() {
  const activeAgents = FIRE_TEAM.filter(a => a.status === 'active');
  const plannedAgents = FIRE_TEAM.filter(a => a.status === 'planned');

  return (
    <div className="max-w-4xl space-y-8">

      {/* Mission Quote Banner */}
      <div className="bg-gradient-to-r from-mc-accent/10 via-mc-accent-purple/5 to-mc-accent/10 border border-mc-accent/20 rounded-2xl p-6 text-center">
        <div className="text-mc-accent/60 text-xl mb-3">&ldquo;</div>
        <p className="text-mc-text text-sm leading-relaxed italic max-w-2xl mx-auto">{MISSION}</p>
      </div>

      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">🔥 The Fire Team</h2>
        <p className="text-mc-text-secondary text-sm">A crew of specialized AI agents, each with a real role and a real purpose — built to run a business.</p>
      </div>

      {/* Roberto — The Human */}
      <div className="flex items-center justify-center gap-4 py-2">
        <div className="flex-1 h-px bg-mc-border" />
        <div className="flex items-center gap-3 bg-mc-bg-secondary border border-mc-border rounded-xl px-5 py-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mc-accent to-mc-accent-purple flex items-center justify-center text-lg">
            👤
          </div>
          <div>
            <div className="font-semibold text-sm">Roberto Chavarria</div>
            <div className="text-xs text-mc-text-secondary">Founder · The Human · Sets the direction</div>
          </div>
        </div>
        <div className="flex-1 h-px bg-mc-border" />
      </div>

      {/* Connector: Roberto → Ember */}
      <div className="flex justify-center">
        <div className="w-px h-8 bg-mc-border" />
      </div>

      {/* Ember — Chief of Staff */}
      <div className="bg-mc-bg-secondary border border-mc-accent/30 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center text-2xl">
              {EMBER.emoji}
            </div>
            <div>
              <div className="font-bold text-lg flex items-center gap-2">
                {EMBER.name}
                <span className="w-2 h-2 rounded-full bg-mc-accent-green" />
              </div>
              <div className="text-sm text-mc-text-secondary">{EMBER.title}</div>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 bg-mc-accent-green/10 border border-mc-accent-green/30 text-mc-accent-green rounded-full font-medium">
            Online
          </span>
        </div>
        <p className="text-sm text-mc-text-secondary mb-4 leading-relaxed">{EMBER.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {EMBER.tags.map((tag, i) => (
            <TagPill key={tag} label={tag} color={['blue', 'purple', 'green', 'blue', 'purple'][i % 5]} />
          ))}
        </div>
        <div className="text-xs text-mc-text-secondary font-mono">Model: {EMBER.model}</div>
      </div>

      {/* Connector: Ember → Fire Team */}
      <div className="flex flex-col items-center">
        <div className="w-px h-6 bg-mc-border" />
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 h-px bg-mc-border" />
          <span className="text-xs text-mc-text-secondary font-medium tracking-widest uppercase whitespace-nowrap">Reports to Ember</span>
          <div className="flex-1 h-px bg-mc-border" />
        </div>
        <div className="w-px h-4 bg-mc-border" />
      </div>

      {/* Active Fire Team — 2-col grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeAgents.map((agent, i) => (
          <div key={agent.name} className="bg-mc-bg-secondary border border-mc-accent/20 rounded-xl p-5 hover:border-mc-accent/40 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-mc-bg-tertiary border border-mc-border flex items-center justify-center text-lg">
                {agent.emoji}
              </div>
              <span className="text-xs px-2 py-0.5 bg-mc-accent-green/10 border border-mc-accent-green/30 text-mc-accent-green rounded-full font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-mc-accent-green inline-block" />
                Active
              </span>
            </div>
            <div className="font-semibold text-sm mb-0.5">{agent.name}</div>
            <div className="text-xs text-mc-text-secondary mb-3">{agent.title}</div>
            <p className="text-xs text-mc-text-secondary leading-relaxed mb-3">{agent.description}</p>
            <div className="flex flex-wrap gap-1">
              {agent.tags.map((tag, j) => (
                <TagPill key={tag} label={tag} color={['blue', 'purple', 'green'][j % 3]} />
              ))}
            </div>
            {agent.model && (
              <div className="text-xs text-mc-text-secondary font-mono mt-3">Model: {agent.model}</div>
            )}
          </div>
        ))}
      </div>

      {/* Planned agents */}
      {plannedAgents.length > 0 && (
        <>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-mc-border" />
            <span className="text-xs text-mc-text-secondary font-medium tracking-widest uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-mc-text-secondary" />
              Coming Soon
            </span>
            <div className="flex-1 h-px bg-mc-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-50">
            {plannedAgents.map((agent) => (
              <div key={agent.name} className="bg-mc-bg-secondary border border-mc-border rounded-xl p-5 hover:opacity-70 transition-opacity">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-mc-bg-tertiary border border-mc-border flex items-center justify-center text-lg">
                    {agent.emoji}
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-mc-bg-tertiary border border-mc-border text-mc-text-secondary rounded-full">
                    Planned
                  </span>
                </div>
                <div className="font-semibold text-sm mb-0.5">{agent.name}</div>
                <div className="text-xs text-mc-text-secondary mb-3">{agent.title}</div>
                <p className="text-xs text-mc-text-secondary leading-relaxed mb-3">{agent.description}</p>
                <div className="flex flex-wrap gap-1">
                  {agent.tags.map((tag, j) => (
                    <TagPill key={tag} label={tag} color={['blue', 'purple', 'green'][j % 3]} />
                  ))}
                </div>
                {agent.model && (
                  <div className="text-xs text-mc-text-secondary font-mono mt-3">Model: {agent.model}</div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Meta Layer */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-mc-border" />
        <span className="text-xs text-mc-text-secondary font-medium tracking-widest uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-mc-text-secondary" />
          Meta Layer
        </span>
        <div className="flex-1 h-px bg-mc-border" />
      </div>

      <div className="bg-mc-bg-secondary border border-dashed border-mc-border rounded-xl p-5 text-center opacity-50">
        <div className="text-2xl mb-2">🧬</div>
        <div className="font-semibold text-sm mb-1">Future Orchestration</div>
        <div className="text-xs text-mc-text-secondary">As the team grows, Ember shifts to COO mode — managing, delegating, coordinating. We build that together.</div>
      </div>

    </div>
  );
}
