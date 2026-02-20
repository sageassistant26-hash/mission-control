'use client';

const MISSION = "Build and ship AI-powered businesses that generate $10k/month in additional income by end of 2026 and $2.5M in assets within 5 years — creating financial freedom for Roberto and Alison, providing for their family, and freeing Roberto's focus and energy for The Society's life-changing work.";

interface AgentCard {
  emoji: string;
  name: string;
  title: string;
  roles: string[];
  status: 'active' | 'planned';
  model?: string;
}

const AGENTS: AgentCard[] = [
  {
    emoji: '🔥',
    name: 'Ember',
    title: 'Chief of Staff / CTO',
    roles: ['Strategic Partner', 'CTO', 'CFO', 'Marketing Strategist', 'Critical Thinking Partner', 'Efficiency Advisor'],
    status: 'active',
    model: 'Claude Sonnet 4.6',
  },
  {
    emoji: '🔬',
    name: 'Researcher',
    title: 'Research Sub-Agent',
    roles: ['Web research', 'Competitive analysis', 'Market intelligence'],
    status: 'planned',
    model: 'DeepSeek V3',
  },
  {
    emoji: '💻',
    name: 'Coder',
    title: 'Coding Sub-Agent',
    roles: ['Feature development', 'Bug fixes', 'Code review'],
    status: 'planned',
    model: 'Codex / Claude Sonnet',
  },
  {
    emoji: '✍️',
    name: 'Writer',
    title: 'Content Sub-Agent',
    roles: ['Landing page copy', 'Emails', 'Social content', 'Marketing'],
    status: 'planned',
    model: 'Claude Sonnet 4.6',
  },
];

export function TeamTab() {
  return (
    <div className="space-y-8">
      {/* Mission Statement */}
      <div className="bg-gradient-to-r from-mc-accent/10 to-mc-accent-purple/10 border border-mc-accent/20 rounded-xl p-6">
        <div className="text-xs font-semibold text-mc-accent uppercase tracking-widest mb-3">Mission</div>
        <p className="text-mc-text leading-relaxed text-sm">{MISSION}</p>
      </div>

      {/* Roberto */}
      <div>
        <div className="text-xs font-semibold text-mc-text-secondary uppercase tracking-wider mb-3">Human</div>
        <div className="bg-mc-bg-secondary border border-mc-border rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-mc-accent to-mc-accent-purple flex items-center justify-center text-xl font-bold text-white">
            R
          </div>
          <div>
            <div className="font-semibold">Roberto Chavarria</div>
            <div className="text-sm text-mc-text-secondary">Founder · Director, The Society · Longmont, CO</div>
            <div className="flex flex-wrap gap-1 mt-2">
              {['The Society', 'Claw Mentor', 'Raise Formula', 'CCC', 'Human Institute'].map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-mc-bg-tertiary border border-mc-border rounded text-xs text-mc-text-secondary">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Agents */}
      <div>
        <div className="text-xs font-semibold text-mc-text-secondary uppercase tracking-wider mb-3">Agent Team</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AGENTS.map(agent => (
            <div key={agent.name} className={`bg-mc-bg-secondary border rounded-xl p-5 ${agent.status === 'active' ? 'border-mc-accent/30' : 'border-mc-border opacity-60'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{agent.emoji}</span>
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      {agent.name}
                      {agent.status === 'active' && (
                        <span className="w-2 h-2 rounded-full bg-mc-accent-green inline-block" />
                      )}
                    </div>
                    <div className="text-xs text-mc-text-secondary">{agent.title}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  agent.status === 'active'
                    ? 'bg-mc-accent-green/10 border-mc-accent-green/30 text-mc-accent-green'
                    : 'bg-mc-bg-tertiary border-mc-border text-mc-text-secondary'
                }`}>
                  {agent.status === 'active' ? 'Online' : 'Planned'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {agent.roles.map(role => (
                  <span key={role} className="px-2 py-0.5 bg-mc-bg-tertiary rounded text-xs text-mc-text-secondary border border-mc-border">{role}</span>
                ))}
              </div>
              {agent.model && (
                <div className="text-xs text-mc-text-secondary font-mono">{agent.model}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
