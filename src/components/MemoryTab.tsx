'use client';

import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface MemoryFile {
  name: string;
  emoji: string;
  content: string;
  exists: boolean;
}

export function MemoryTab() {
  const [files, setFiles] = useState<MemoryFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/memory');
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
        if (!selected && data.length > 0) setSelected(data[0].name);
      }
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const active = files.find(f => f.name === selected);

  return (
    <div className="flex h-full gap-4">
      {/* Sidebar */}
      <div className="w-48 flex-shrink-0 space-y-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-mc-text-secondary uppercase tracking-wider">Core Files</span>
          <button onClick={load} className="text-mc-text-secondary hover:text-mc-text">
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
        {files.map(f => (
          <button
            key={f.name}
            onClick={() => setSelected(f.name)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
              selected === f.name
                ? 'bg-mc-accent/20 text-mc-accent border border-mc-accent/30'
                : 'text-mc-text-secondary hover:bg-mc-bg-tertiary hover:text-mc-text'
            }`}
          >
            <span>{f.emoji}</span>
            <span className="truncate">{f.name}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 bg-mc-bg border border-mc-border rounded-xl overflow-auto p-6">
        {loading ? (
          <div className="text-mc-text-secondary text-sm">Loading...</div>
        ) : active ? (
          <>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>{active.emoji}</span> {active.name}
            </h2>
            <pre className="text-sm text-mc-text-secondary whitespace-pre-wrap font-mono leading-relaxed">
              {active.content}
            </pre>
          </>
        ) : (
          <div className="text-mc-text-secondary text-sm">Select a file</div>
        )}
      </div>
    </div>
  );
}
