'use client';

import { useEffect, useState } from 'react';
import { Users, Download, RefreshCw, AlertCircle } from 'lucide-react';

interface WaitlistRow {
  id: string;
  email: string;
  source: string | null;
  metadata: string | null;
  created_at: string;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function sourceBadge(source: string | null) {
  if (!source) return null;
  const colors: Record<string, string> = {
    'mentor-page-notify': 'bg-orange-400/10 text-orange-400',
    'mentor-page': 'bg-orange-400/10 text-orange-400',
    'for-mentors-page': 'bg-blue-400/10 text-blue-400',
    'landing-page': 'bg-purple-400/10 text-purple-400',
  };
  const color = colors[source] ?? 'bg-zinc-400/10 text-zinc-400';
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>
      {source}
    </span>
  );
}

export function WaitlistTab() {
  const [rows, setRows] = useState<WaitlistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [lastLoaded, setLastLoaded] = useState<Date | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/waitlist');
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to load waitlist');
        if (data.hint) setHint(data.hint);
        setRows([]);
      } else {
        setRows(data.rows ?? []);
        setLastLoaded(new Date());
      }
    } catch {
      setError('Network error — is Mission Control running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const downloadCSV = () => {
    window.open('/api/waitlist?format=csv', '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-400" />
            Mentor Interest Waitlist
          </h2>
          <p className="text-sm text-mc-text-secondary mt-0.5">
            People who clicked &ldquo;Notify me when live&rdquo; on the mentors page
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-mc-text-secondary">
            {rows.length} {rows.length === 1 ? 'entry' : 'entries'}
            {lastLoaded && ` · ${timeAgo(lastLoaded.toISOString())}`}
          </span>
          <button
            onClick={load}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-white/5 text-mc-text-secondary hover:text-white transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={downloadCSV}
            disabled={rows.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-mc-text-secondary hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
        </div>
      </div>

      {/* Error / not configured state */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium">{error}</p>
            {hint && (
              <p className="text-xs text-red-400/70 mt-1 font-mono">{hint}</p>
            )}
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !error && (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-white/[0.03] rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && rows.length === 0 && (
        <div className="text-center py-12 text-mc-text-secondary">
          <Users className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No waitlist entries yet.</p>
          <p className="text-xs mt-1 opacity-60">
            Entries appear when someone clicks &ldquo;Notify me when live&rdquo; on the mentors page.
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && rows.length > 0 && (
        <div className="border border-white/[0.06] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="text-left px-4 py-2.5 font-medium text-mc-text-secondary">Email</th>
                <th className="text-left px-4 py-2.5 font-medium text-mc-text-secondary">Source</th>
                <th className="text-left px-4 py-2.5 font-medium text-mc-text-secondary">Interest</th>
                <th className="text-right px-4 py-2.5 font-medium text-mc-text-secondary">Joined</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-white/[0.04] last:border-0 ${
                    i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'
                  }`}
                >
                  <td className="px-4 py-3 text-white font-mono text-xs">{row.email}</td>
                  <td className="px-4 py-3">{sourceBadge(row.source)}</td>
                  <td className="px-4 py-3 text-mc-text-secondary text-xs max-w-xs truncate">
                    {row.metadata || '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-mc-text-secondary text-xs whitespace-nowrap">
                    {timeAgo(row.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
