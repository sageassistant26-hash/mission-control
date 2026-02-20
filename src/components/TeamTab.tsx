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

const SUB_AGENTS: AgentCard[] = [
  {
    emoji: '🔬',
    name: 'Scout',
    title: 'Intel & Research Agent',
    description: 'Runs at 3 AM daily. Scans OpenClaw ecosystem, ClawHub, GitHub, and AI agent market for opportunities, risks, and timing signals. Outputs a structured digest for Ember\'s morning strategy review.',
    tags: ['Web Search', 'Market Intel', 'Risk Radar'],
    status: 'active',
    model: 'DeepSeek V3 (openrouter)',
  },
  {
    emoji: '💻',
    name: 'Forge',
    title: 'Coding Agent',
    description: 'Runs at 1 AM nightly. Picks the top task from the Forge queue and ships it — commits to dev branch, logs what was built, flags anything that needs approval before proceeding.',
    tags: ['Code', 'Shipping', 'Dev Branch'],
    status: 'active',
    model: 'Claude Sonnet 4.6',
  },
  {
    emoji: '⚡',
    name: 'Spark',
    title: 'Social Media Agent',
    description: 'Runs at 9 AM daily. Drafts content for @ClawMentor and @heyember. Never posts autonomously — all drafts queued for Ember review. Sandboxed from external content to prevent prompt injection.',
    tags: ['@ClawMentor', '@heyember', 'Drafts Only'],
    status: 'active',
    model: 'Gemini Flash Lite (openrouter)',
  },
  {
    emoji: '✍️',
    name: 'Quill',
    title: 'Content Agent',
    description: 'Long-form copy, landing pages, email sequences. Writes with voice and converts.',
    tags: ['Copy', 'Conversion', 'Voice'],
    status: 'planned',
    model: 'Claude Sonnet 4.6',
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
  return (
    <div className="max-w-4xl space-y-8">

      {/* Mission Quote Banner */}
      <div className="bg-gradient-to-r from-mc-accent/10 via-mc-accent-purple/5 to-mc-accent/10 border border-mc-accent/20 rounded-2xl p-6 text-center">
        <div className="text-mc-accent/60 text-xl mb-3">&ldquo;</div>
        <p className="text-mc-text text-sm leading-relaxed italic max-w-2xl mx-auto">{MISSION}</p>
      </div>

      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Meet the Team</h2>
        <p className="text-mc-text-secondary text-sm">Ember + future agents, each with a real role and a real purpose.</p>
        <p className="text-mc-text-secondary text-xs mt-1">We wanted to see what happens when AI doesn&apos;t just answer questions — but actually runs a business.</p>
      </div>

      {/* Roberto — The Human */}
      <div className="flex items-center justify-center gap-4 py-2">
        <div className="flex-1 h-px bg-mc-border" />
        <div className="flex items-center gap-3 bg-mc-bg-secondary border border-mc-border rounded-xl px-5 py-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mc-accent to-mc-accent-purple flex items-center justify-center font-bold text-white">R</div>
          <div>
            <div className="font-semibold text-sm">Roberto Chavarria</div>
            <div className="text-xs text-mc-text-secondary">Founder · The Human · Sets the direction</div>
          </div>
        </div>
        <div className="flex-1 h-px bg-mc-border" />
      </div>

      {/* Connector */}
      <div className="flex justify-center">
        <div className="w-px h-8 bg-mc-border" />
      </div>

      {/* Ember — Chief of Staff (full width) */}
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

      {/* Input/Output Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-mc-border" />
        <div className="flex gap-6 text-xs text-mc-text-secondary font-medium tracking-widest uppercase">
          <span className="flex items-center gap-1">↓ Input Signal</span>
          <span className="flex items-center gap-1">Output Action ↓</span>
        </div>
        <div className="flex-1 h-px bg-mc-border" />
      </div>

      {/* Sub-agents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SUB_AGENTS.filter(a => a.status === 'active').map((agent, i) => (
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
              <div className="text-xs text-mc-text-secondary font-mono mt-3">{agent.model}</div>
            )}
          </div>
        ))}
      </div>
      {/* Planned agents */}
      {SUB_AGENTS.some(a => a.status === 'planned') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-50">
          {SUB_AGENTS.filter(a => a.status === 'planned').map((agent, i) => (
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
                <div className="text-xs text-mc-text-secondary font-mono mt-3">{agent.model}</div>
              )}
            </div>
          ))}
        </div>
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
