'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, FileText, Twitter, CheckCircle } from 'lucide-react';

interface DraftFile {
  filename: string;
  date: string;
  content: string;
}

export function ContentTab() {
  const [drafts, setDrafts] = useState<DraftFile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/memory?path=projects/social');
      const data = await res.json();
      setDrafts(data.files || []);
    } catch { setDrafts([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Content & Drafts</h2>
          <p className="text-sm text-mc-text-secondary">Spark&apos;s daily post drafts — review before publishing</p>
        </div>
        <button onClick={load} className="p-1.5 rounded hover:bg-mc-bg-tertiary text-mc-text-secondary hover:text-mc-text-primary transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-mc-text-secondary text-sm">Loading drafts...</div>
      ) : drafts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-mc-bg-tertiary flex items-center justify-center mb-4">
            <Twitter className="w-8 h-8 text-mc-text-secondary" />
          </div>
          <h3 className="font-medium mb-2">No drafts yet</h3>
          <p className="text-mc-text-secondary text-sm max-w-xs">
            Spark runs daily at 9 AM and saves draft posts here for your review. Check back after Spark&apos;s first run.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map(draft => (
            <div key={draft.filename} className="bg-mc-bg-secondary border border-mc-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-mc-text-secondary" />
                <span className="text-sm font-medium">{draft.filename}</span>
                <span className="text-xs text-mc-text-secondary ml-auto">{draft.date}</span>
              </div>
              <pre className="text-sm text-mc-text-secondary whitespace-pre-wrap leading-relaxed font-sans">{draft.content}</pre>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-mc-border">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-mc-accent/10 border border-mc-accent/30 text-mc-accent rounded-lg text-xs font-medium hover:bg-mc-accent/20 transition-colors">
                  <CheckCircle className="w-3 h-3" /> Mark Reviewed
                </button>
                <span className="text-xs text-mc-text-secondary">Move to Approvals to publish</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
