'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Zap, Clock } from 'lucide-react';

interface CronJob {
  jobId: string;
  name: string;
  description: string;
  enabled: boolean;
  schedule: { kind: string; expr: string; tz?: string };
  payload: { model?: string };
}

function parseCronTime(expr: string): { hour: number; minute: number; label: string } | null {
  // Handles "30 7 * * *" style daily crons
  const parts = expr.trim().split(/\s+/);
  if (parts.length < 5) return null;
  const minute = parseInt(parts[0]);
  const hour = parseInt(parts[1]);
  if (isNaN(hour) || isNaN(minute)) return null;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const m = minute.toString().padStart(2, '0');
  return { hour, minute, label: `${h}:${m} ${ampm}` };
}

function getNextRun(expr: string, tz: string = 'America/Denver'): string {
  const parsed = parseCronTime(expr);
  if (!parsed) return 'Unknown';
  const now = new Date();
  const next = new Date();
  next.setHours(parsed.hour, parsed.minute, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  const diffMs = next.getTime() - now.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  const diffM = Math.floor((diffMs % 3600000) / 60000);
  if (diffH === 0) return `In ${diffM}m`;
  if (diffH < 24) return `In ${diffH}h ${diffM}m`;
  return `Tomorrow at ${parsed.label}`;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const COLORS = [
  'bg-purple-900/50 border-purple-500/50 text-purple-300',
  'bg-yellow-900/50 border-yellow-500/50 text-yellow-300',
  'bg-blue-900/50 border-blue-500/50 text-blue-300',
  'bg-green-900/50 border-green-500/50 text-green-300',
];

export function ScheduleTab() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/schedule');
      if (res.ok) setJobs(await res.json());
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const dailyJobs = jobs.filter(j => j.enabled && j.schedule.kind === 'cron');

  return (
    <div className="space-y-6">
      {/* Always Running */}
      <div className="bg-mc-bg-secondary border border-mc-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-mc-accent-green" />
          <h3 className="font-semibold text-sm">Always Running</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 bg-mc-bg-tertiary border border-mc-border rounded-lg text-xs text-mc-text-secondary">
            heartbeat check • Every 30 min
          </span>
          <span className="px-3 py-1.5 bg-mc-bg-tertiary border border-mc-border rounded-lg text-xs text-mc-text-secondary">
            memory watch • On session start
          </span>
        </div>
      </div>

      {/* Weekly Calendar */}
      <div className="bg-mc-bg-secondary border border-mc-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Weekly Schedule</h3>
          <button onClick={load} className="text-mc-text-secondary hover:text-mc-text">
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {loading ? (
          <div className="text-mc-text-secondary text-sm">Loading...</div>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {DAYS.map(day => (
              <div key={day}>
                <div className="text-xs font-medium text-mc-text-secondary text-center mb-2">{day}</div>
                <div className="space-y-1">
                  {dailyJobs.map((job, i) => {
                    const parsed = parseCronTime(job.schedule.expr);
                    if (!parsed) return null;
                    const color = COLORS[i % COLORS.length];
                    return (
                      <div key={job.jobId} className={`px-2 py-1.5 rounded border text-xs ${color} truncate`}>
                        <div className="font-medium truncate">{job.name.toLowerCase().replace(' ', ' ')}</div>
                        <div className="opacity-70">{parsed.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next Up */}
      <div className="bg-mc-bg-secondary border border-mc-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-mc-accent" />
          <h3 className="font-semibold text-sm">Next Up</h3>
        </div>
        <div className="space-y-2">
          {[...dailyJobs]
            .sort((a, b) => {
              const pa = parseCronTime(a.schedule.expr);
              const pb = parseCronTime(b.schedule.expr);
              if (!pa || !pb) return 0;
              const nowH = new Date().getHours(), nowM = new Date().getMinutes();
              const aNext = pa.hour * 60 + pa.minute > nowH * 60 + nowM ? pa.hour * 60 + pa.minute : pa.hour * 60 + pa.minute + 1440;
              const bNext = pb.hour * 60 + pb.minute > nowH * 60 + nowM ? pb.hour * 60 + pb.minute : pb.hour * 60 + pb.minute + 1440;
              return aNext - bNext;
            })
            .map(job => {
              const parsed = parseCronTime(job.schedule.expr);
              if (!parsed) return null;
              return (
                <div key={job.jobId} className="flex items-center justify-between py-2 border-b border-mc-border last:border-0">
                  <div>
                    <span className="text-sm font-medium">{job.name}</span>
                    <span className="text-xs text-mc-text-secondary ml-2">{job.description}</span>
                  </div>
                  <span className="text-xs text-mc-accent font-medium">{getNextRun(job.schedule.expr)}</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
