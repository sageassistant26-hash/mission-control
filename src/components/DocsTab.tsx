'use client';

import { useEffect, useState } from 'react';
import { FileText, RefreshCw } from 'lucide-react';

interface Doc {
  name: string;
  path: string;
  content: string;
}

export function DocsTab() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/docs');
      if (res.ok) {
        const data = await res.json();
        setDocs(data);
        if (data.length > 0 && !selected) setSelected(data[0].name);
      }
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const active = docs.find(d => d.name === selected);

  return (
    <div className="flex h-full gap-4">
      <div className="w-56 flex-shrink-0 space-y-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-mc-text-secondary uppercase tracking-wider">Project Docs</span>
          <button onClick={load} className="text-mc-text-secondary hover:text-mc-text">
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
        {loading ? (
          <div className="text-mc-text-secondary text-sm px-2">Loading...</div>
        ) : docs.length === 0 ? (
          <div className="text-mc-text-secondary text-sm px-2">No docs yet</div>
        ) : (
          docs.map(d => (
            <button
              key={d.name}
              onClick={() => setSelected(d.name)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                selected === d.name
                  ? 'bg-mc-accent/20 text-mc-accent border border-mc-accent/30'
                  : 'text-mc-text-secondary hover:bg-mc-bg-tertiary hover:text-mc-text'
              }`}
            >
              <FileText className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{d.name}</span>
            </button>
          ))
        )}
      </div>

      <div className="flex-1 bg-mc-bg border border-mc-border rounded-xl overflow-auto p-6">
        {active ? (
          <>
            <h2 className="text-lg font-semibold mb-4">📄 {active.name}</h2>
            <pre className="text-sm text-mc-text-secondary whitespace-pre-wrap font-mono leading-relaxed">
              {active.content}
            </pre>
          </>
        ) : (
          <div className="text-mc-text-secondary text-sm">Select a document</div>
        )}
      </div>
    </div>
  );
}
