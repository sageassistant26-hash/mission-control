'use client';

import { CheckCircle, Clock, Rocket, Target, AlertTriangle, Flame, Zap, TrendingUp } from 'lucide-react';

interface Phase {
  number: number;
  title: string;
  subtitle: string;
  target: string;
  targetDate: string;
  status: 'active' | 'next' | 'planned';
  statusLabel: string;
  statusEmoji: string;
  deliverables: string[];
  milestone: string;
  color: string;
  borderColor: string;
  bgColor: string;
  badgeBg: string;
  badgeText: string;
}

const PHASES: Phase[] = [
  {
    number: 0,
    title: 'MVP: Prove the Concept',
    subtitle: 'Phase 0',
    target: 'Day 10',
    targetDate: 'March 1, 2026',
    status: 'active',
    statusLabel: 'ACTIVE NOW',
    statusEmoji: '🔥',
    deliverables: [
      'Landing page live on clawmentor.ai',
      'Supabase waitlist capture',
      'Analysis engine v1 — paste AGENTS.md → get compatibility report',
      'First mentor agreement (Tech With Tim)',
      'Manual rollback workflow documented',
    ],
    milestone: '10 waitlist signups + 1 mentor agreement',
    color: 'text-orange-400',
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-500/5',
    badgeBg: 'bg-orange-500/20',
    badgeText: 'text-orange-400',
  },
  {
    number: 1,
    title: 'The Core Loop',
    subtitle: 'Phase 1',
    target: 'Day 17',
    targetDate: 'March 8, 2026',
    status: 'next',
    statusLabel: 'UP NEXT',
    statusEmoji: '⏳',
    deliverables: [
      'Mentor subscription — install/update flow',
      'Compatibility scanner (automated)',
      'User dashboard',
      'Stripe payments integrated',
      'Real rollback (local snapshot)',
    ],
    milestone: '$500 MRR — first paying subscribers',
    color: 'text-yellow-400',
    borderColor: 'border-yellow-500/50',
    bgColor: 'bg-yellow-500/5',
    badgeBg: 'bg-yellow-500/20',
    badgeText: 'text-yellow-400',
  },
  {
    number: 2,
    title: 'Scale',
    subtitle: 'Phase 2',
    target: 'Day 35',
    targetDate: 'March 26, 2026',
    status: 'planned',
    statusLabel: 'PLANNED',
    statusEmoji: '🔮',
    deliverables: [
      '3 mentors live',
      'Skool community integration',
      'Affiliate dashboard',
      'Marketing content engine (Spark)',
      '$2k MRR',
    ],
    milestone: '$2,000 MRR',
    color: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/5',
    badgeBg: 'bg-blue-500/20',
    badgeText: 'text-blue-400',
  },
  {
    number: 3,
    title: 'Moat',
    subtitle: 'Phase 3',
    target: '~Q2 2026',
    targetDate: 'Q2 2026',
    status: 'planned',
    statusLabel: 'PLANNED',
    statusEmoji: '🔮',
    deliverables: [
      '10 mentors live',
      '$10k MRR',
      'Agent-aware compatibility (beyond config files)',
      'Exit positioning begins',
    ],
    milestone: '$10k MRR = mission achieved',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/5',
    badgeBg: 'bg-purple-500/20',
    badgeText: 'text-purple-400',
  },
];

const RISKS = [
  {
    icon: <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />,
    title: 'OpenAI builds native safety layer',
    detail: '6–12 month runway → Phase 0 is non-negotiable. Ship now.',
    severity: 'high',
  },
  {
    icon: <TrendingUp className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />,
    title: 'Mentor retention depends on subscriber growth',
    detail: 'Focus on creator marketing early. No subscribers = no mentors.',
    severity: 'medium',
  },
  {
    icon: <Zap className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />,
    title: 'ClawHavoc makes users security-conscious',
    detail: 'Our positioning is perfect — safety-first AI agents via trusted mentors.',
    severity: 'opportunity',
  },
];

function StatusBadge({ phase }: { phase: Phase }) {
  if (phase.status === 'active') {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/20 border border-orange-500/40 rounded-full">
        <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
        <span className="text-xs font-bold text-orange-400 tracking-wider">{phase.statusLabel}</span>
      </div>
    );
  }
  if (phase.status === 'next') {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
        <Clock className="w-3.5 h-3.5 text-yellow-400" />
        <span className="text-xs font-bold text-yellow-400 tracking-wider">{phase.statusLabel}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
      <span className="text-xs">{phase.statusEmoji}</span>
      <span className="text-xs font-bold text-mc-text-secondary tracking-wider">{phase.statusLabel}</span>
    </div>
  );
}

export function PlanningTab() {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-full bg-[#0A0A0A] text-white p-6 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Rocket className="w-6 h-6 text-[#F97316]" />
            <h1 className="text-2xl font-bold tracking-tight">Claw Mentor — Project Plan</h1>
          </div>
          <p className="text-mc-text-secondary text-sm">
            Current phase: <span className="text-orange-400 font-semibold">Phase 0 — MVP: Prove the Concept</span>
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-mc-text-secondary">Today</div>
          <div className="text-sm font-medium text-mc-text">{dateStr}</div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-orange-500 via-yellow-500/30 to-purple-500/20 hidden md:block" />

        <div className="space-y-4">
          {PHASES.map((phase, idx) => (
            <div key={phase.number} className="relative">
              {/* Phase dot (desktop) */}
              <div className={`absolute left-4 top-8 w-4 h-4 rounded-full border-2 ${phase.borderColor} ${
                phase.status === 'active' ? 'bg-orange-500 shadow-lg shadow-orange-500/50' :
                phase.status === 'next' ? 'bg-yellow-500/30' :
                'bg-mc-bg-secondary'
              } hidden md:block z-10`} />

              {/* Card */}
              <div className={`md:ml-14 border rounded-xl p-5 ${phase.bgColor} ${phase.borderColor} border transition-all hover:shadow-lg`}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-mc-text-secondary uppercase tracking-widest">
                        {phase.subtitle}
                      </span>
                      <span className="text-xs text-mc-text-secondary">·</span>
                      <span className="text-xs text-mc-text-secondary">{phase.target} = {phase.targetDate}</span>
                    </div>
                    <h3 className={`text-lg font-bold ${phase.color}`}>{phase.title}</h3>
                  </div>
                  <StatusBadge phase={phase} />
                </div>

                {/* Deliverables */}
                <div className="space-y-2 mb-4">
                  {phase.deliverables.map((d, i) => (
                    <div key={i} className="flex items-start gap-2">
                      {phase.status === 'active' ? (
                        <CheckCircle className="w-3.5 h-3.5 text-orange-500/60 flex-shrink-0 mt-0.5" />
                      ) : (
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          phase.status === 'next' ? 'bg-yellow-500/40' : 'bg-white/20'
                        }`} />
                      )}
                      <span className="text-sm text-mc-text-secondary">{d}</span>
                    </div>
                  ))}
                </div>

                {/* Milestone */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${phase.badgeBg} border ${phase.borderColor}`}>
                  <Target className={`w-3.5 h-3.5 ${phase.color} flex-shrink-0`} />
                  <span className={`text-xs font-semibold ${phase.color}`}>
                    Milestone: {phase.milestone}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Risks */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-[#F97316]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-mc-text-secondary">Key Risks</h2>
        </div>
        <div className="space-y-3">
          {RISKS.map((risk, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-4 rounded-xl border ${
                risk.severity === 'high' ? 'bg-red-500/5 border-red-500/20' :
                risk.severity === 'medium' ? 'bg-yellow-500/5 border-yellow-500/20' :
                'bg-green-500/5 border-green-500/20'
              }`}
            >
              {risk.icon}
              <div>
                <div className="text-sm font-semibold mb-0.5">{risk.title}</div>
                <div className="text-xs text-mc-text-secondary">{risk.detail}</div>
              </div>
              {risk.severity === 'opportunity' && (
                <span className="ml-auto text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full font-medium flex-shrink-0">
                  ✓ Our Edge
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="text-xs text-mc-text-secondary/50 text-center pb-4">
        Updated by Ember · Mission Control Overhaul · {dateStr}
      </div>
    </div>
  );
}
