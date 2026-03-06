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
    title: 'Foundation — Ship & Charge',
    subtitle: 'Phase 0 · NOW',
    target: 'Feb 28',
    targetDate: 'February 28, 2026',
    status: 'active',
    statusLabel: 'ACTIVE NOW',
    statusEmoji: '🔥',
    deliverables: [
      '✅ clawmentor.ai landing page + waitlist live',
      '✅ app.clawmentor.ai — auth, mentor browse, dashboard',
      '✅ Stripe payments live (all 3 tiers)',
      '✅ Supabase DB + magic link auth (ClawMentor branded email)',
      '⏳ Onboarding survey wizard (Forge, Feb 21)',
      '✅ Ember mentor package + meta-skill (mentor-package-skill.md) — PRIVATE pending Roberto approval',
      '⏳ Compatibility analysis engine (DeepSeek V3)',
      '⏳ Report card UI + apply/rollback flow',
      '⏳ First mentor outreach: Tech With Tim DM sent',
    ],
    milestone: 'First paying subscriber through full loop',
    color: 'text-orange-400',
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-500/5',
    badgeBg: 'bg-orange-500/20',
    badgeText: 'text-orange-400',
  },
  {
    number: 1,
    title: 'Mentor + Mentee Skills Live',
    subtitle: 'Phase 1',
    target: 'March 10',
    targetDate: 'March 10, 2026',
    status: 'next',
    statusLabel: 'UP NEXT',
    statusEmoji: '⏳',
    deliverables: [
      'Mentee SKILL.md — in-chat OpenClaw integration',
      'User can receive report + apply from within OpenClaw chat',
      '1 real mentor live (Tim or Ember)',
      'In-chat: "New update from Ember 🔥 — Apply? [yes/no]"',
      'Affiliate dashboard v1',
      '$500–$1k MRR (first real paying subscribers)',
    ],
    milestone: '$1,000 MRR + mentee skill publicly installable',
    color: 'text-yellow-400',
    borderColor: 'border-yellow-500/50',
    bgColor: 'bg-yellow-500/5',
    badgeBg: 'bg-yellow-500/20',
    badgeText: 'text-yellow-400',
  },
  {
    number: 2,
    title: '$3k Net Profit — March Target',
    subtitle: 'Phase 2',
    target: 'March 31',
    targetDate: 'March 31, 2026',
    status: 'planned',
    statusLabel: 'TARGET DATE',
    statusEmoji: '🎯',
    deliverables: [
      '3+ mentors live (Tim, Alex Finn + 1 more)',
      'X content flywheel running (Spark + @ClawMentor)',
      'Referral/affiliate program active',
      'Self-improving mentor skill in production',
      '"Zero to OpenClaw" free course as top-of-funnel',
      '$3,000/month NET PROFIT after all expenses',
    ],
    milestone: '🎯 $3,000/month net profit — March 31 deadline',
    color: 'text-green-400',
    borderColor: 'border-green-500/50',
    bgColor: 'bg-green-500/5',
    badgeBg: 'bg-green-500/20',
    badgeText: 'text-green-400',
  },
  {
    number: 3,
    title: 'Moat & Exit Positioning',
    subtitle: 'Phase 3',
    target: 'Q3 2026',
    targetDate: 'Q3 2026',
    status: 'planned',
    statusLabel: 'PLANNED',
    statusEmoji: '🔮',
    deliverables: [
      '10+ mentors, self-improving packages',
      '$10k MRR → toward $500k ARR',
      'Agent-aware compatibility (beyond config files)',
      'Mentor agents continuously improving their own packages',
      'Exit positioning: OpenAI, Anthropic, Kajabi, Skool',
    ],
    milestone: '$10k MRR → $500k ARR → exit at $2.5–5M',
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
            Current phase: <span className="text-orange-400 font-semibold">Phase 0 — Foundation</span>
            <span className="ml-2 text-green-400 font-semibold">· Target: $3k net profit by March 31</span>
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
