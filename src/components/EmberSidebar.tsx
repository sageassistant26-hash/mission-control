'use client';

import { CheckSquare, CheckCircle, Brain, BookOpen, Calendar, Users, TrendingUp, GitBranch, List } from 'lucide-react';

export type NavSection = 'tasks' | 'plan' | 'approvals' | 'schedule' | 'memory' | 'docs' | 'team' | 'waitlist';

interface NavItem {
  id: NavSection;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" /> },
  { id: 'plan', label: 'Plan', icon: <GitBranch className="w-4 h-4" /> },
  { id: 'approvals', label: 'Approvals', icon: <CheckCircle className="w-4 h-4" /> },
  { id: 'schedule', label: 'Schedule', icon: <Calendar className="w-4 h-4" /> },
  { id: 'memory', label: 'Memory', icon: <Brain className="w-4 h-4" /> },
  { id: 'docs', label: 'Docs', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'team', label: 'Team', icon: <Users className="w-4 h-4" /> },
  { id: 'waitlist', label: 'Waitlist', icon: <List className="w-4 h-4" /> },
];

// Revenue goal progress
const REVENUE_GOAL = 10000;
const REVENUE_CURRENT = 0;
const REVENUE_PCT = Math.round((REVENUE_CURRENT / REVENUE_GOAL) * 100);

interface EmberSidebarProps {
  active: NavSection;
  onSelect: (id: NavSection) => void;
}

export function EmberSidebar({ active, onSelect }: EmberSidebarProps) {
  return (
    <div className="w-52 flex-shrink-0 h-full flex flex-col bg-mc-bg-secondary border-r border-mc-border">
      {/* Logo */}
      <div className="p-5 border-b border-mc-border">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🔥</span>
          <div>
            <div className="font-bold text-sm leading-none">Ember HQ</div>
            <div className="text-xs text-mc-text-secondary mt-0.5">with Roberto</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              active === item.id
                ? 'bg-mc-accent/15 text-mc-accent border border-mc-accent/20'
                : 'text-mc-text-secondary hover:bg-mc-bg-tertiary hover:text-mc-text'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Revenue Tracker */}
      <div className="p-4 border-t border-mc-border">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-3 h-3 text-mc-accent-green" />
          <span className="text-xs font-semibold text-mc-text-secondary uppercase tracking-wider">Revenue Goal</span>
        </div>
        <div className="flex justify-between items-baseline mb-1.5">
          <span className="text-xs text-mc-text-secondary">${REVENUE_CURRENT.toLocaleString()}/mo</span>
          <span className="text-xs text-mc-text-secondary">${REVENUE_GOAL.toLocaleString()}/mo</span>
        </div>
        <div className="h-1.5 bg-mc-bg-tertiary rounded-full overflow-hidden">
          <div
            className="h-full bg-mc-accent-green rounded-full transition-all"
            style={{ width: `${Math.max(REVENUE_PCT, 2)}%` }}
          />
        </div>
        <div className="text-xs text-mc-text-secondary mt-1.5 text-center">{REVENUE_PCT}% of $10k/mo goal</div>
      </div>

      {/* Heartbeat */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-mc-bg-tertiary rounded-lg">
          <span className="w-2 h-2 rounded-full bg-mc-accent-green animate-pulse flex-shrink-0" />
          <span className="text-xs text-mc-text-secondary truncate">Ember is online</span>
        </div>
      </div>
    </div>
  );
}
