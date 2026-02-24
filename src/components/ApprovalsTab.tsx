'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, RefreshCw, GitBranch, FileText, Globe } from 'lucide-react';

interface ApprovalItem {
  id: string;
  title: string;
  description: string;
  type: 'deploy' | 'merge' | 'post' | 'decision';
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  url?: string;
  docs?: string[];
  branch?: string;
  resolvedAt?: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  deploy: <Globe className="w-4 h-4" />,
  merge: <GitBranch className="w-4 h-4" />,
  post: <FileText className="w-4 h-4" />,
  decision: <Clock className="w-4 h-4" />,
};

const typeColors: Record<string, string> = {
  deploy: 'text-red-400 bg-red-400/10',
  merge: 'text-blue-400 bg-blue-400/10',
  post: 'text-purple-400 bg-purple-400/10',
  decision: 'text-yellow-400 bg-yellow-400/10',
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function ApprovalsTab() {
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [docContent, setDocContent] = useState<Record<string, string>>({});
  const [docLoading, setDocLoading] = useState<string | null>(null);

  const loadDoc = async (docPath: string) => {
    if (docContent[docPath]) {
      setExpandedDoc(expandedDoc === docPath ? null : docPath);
      return;
    }
    setDocLoading(docPath);
    setExpandedDoc(docPath);
    try {
      const res = await fetch('/api/docs');
      if (res.ok) {
        const docs = await res.json();
        const match = docs.find((d: { name: string; path: string; content: string }) =>
          d.path === docPath || d.name === docPath || d.path.endsWith(docPath) || d.name.endsWith(docPath.replace(/.*\/projects\//, ''))
        );
        if (match) {
          setDocContent(prev => ({ ...prev, [docPath]: match.content }));
        } else {
          setDocContent(prev => ({ ...prev, [docPath]: '(Document not found in workspace)' }));
        }
      }
    } catch {
      setDocContent(prev => ({ ...prev, [docPath]: '(Failed to load document)' }));
    }
    setDocLoading(null);
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/approvals');
      const data = await res.json();
      setItems(data.items || []);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const act = async (id: string, action: 'approve' | 'reject') => {
    setActing(id);
    await fetch('/api/approvals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    await load();
    setActing(null);
  };

  const pending = items.filter(i => i.status === 'pending');
  const resolved = items.filter(i => i.status !== 'pending');

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Pending Approvals</h2>
          <p className="text-sm text-mc-text-secondary">Nothing deploys to production without your sign-off</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 text-xs rounded-full font-medium ${pending.length > 0 ? 'bg-yellow-400/10 text-yellow-400' : 'bg-mc-bg-tertiary text-mc-text-secondary'}`}>
            {pending.length} pending
          </span>
          <button onClick={load} className="p-1.5 rounded hover:bg-mc-bg-tertiary text-mc-text-secondary hover:text-mc-text-primary transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-mc-text-secondary text-sm">Loading...</div>
      ) : pending.length === 0 && resolved.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-mc-accent-green/10 flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-mc-accent-green" />
          </div>
          <h3 className="font-medium mb-2">All clear</h3>
          <p className="text-mc-text-secondary text-sm max-w-xs">
            When Forge has code ready to merge or deploy, or Spark has posts to publish, they&apos;ll show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <div className="space-y-3">
              {pending.map(item => (
                <div key={item.id} className="bg-mc-bg-secondary border border-yellow-400/20 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${typeColors[item.type]}`}>
                        {typeIcons[item.type]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{item.title}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[item.type]}`}>
                            {item.type}
                          </span>
                        </div>
                        <p className="text-mc-text-secondary text-sm mb-2 leading-relaxed">{item.description}</p>
                        <div className="flex items-center gap-3 text-xs text-mc-text-secondary">
                          <span>by {item.requestedBy}</span>
                          <span>·</span>
                          <span>{timeAgo(item.requestedAt)}</span>
                          {item.branch && <><span>·</span><span className="font-mono">{item.branch}</span></>}
                          {item.url && !item.docs && <><span>·</span><a href={item.url} target="_blank" rel="noopener noreferrer" className="text-mc-accent hover:underline">View →</a></>}
                        </div>
                        {item.docs && item.docs.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.docs.map(doc => (
                              <button
                                key={doc}
                                onClick={() => loadDoc(doc)}
                                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                                  expandedDoc === doc
                                    ? 'bg-mc-accent/10 border-mc-accent/30 text-mc-accent'
                                    : 'border-mc-border text-mc-text-secondary hover:text-mc-text hover:border-mc-text-secondary'
                                }`}
                              >
                                📄 {doc.split('/').pop()}
                                {docLoading === doc && ' ⏳'}
                              </button>
                            ))}
                          </div>
                        )}
                        {expandedDoc && item.docs?.includes(expandedDoc) && docContent[expandedDoc] && (
                          <div className="mt-3 max-h-96 overflow-y-auto rounded-lg bg-mc-bg-primary border border-mc-border p-4">
                            <pre className="text-xs text-mc-text-secondary whitespace-pre-wrap font-mono leading-relaxed">{docContent[expandedDoc]}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => act(item.id, 'reject')}
                        disabled={acting === item.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-400/30 text-red-400 hover:bg-red-400/10 text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                      <button
                        onClick={() => act(item.id, 'approve')}
                        disabled={acting === item.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mc-accent-green/10 border border-mc-accent-green/30 text-mc-accent-green hover:bg-mc-accent-green/20 text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {resolved.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-mc-text-secondary uppercase tracking-wider mb-3">Recently Resolved</h3>
              <div className="space-y-2">
                {resolved.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3 bg-mc-bg-secondary rounded-xl opacity-60">
                    <span className={`p-1 rounded ${item.status === 'approved' ? 'text-mc-accent-green' : 'text-red-400'}`}>
                      {item.status === 'approved' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </span>
                    <span className="text-sm flex-1">{item.title}</span>
                    <span className="text-xs text-mc-text-secondary">{item.resolvedAt ? timeAgo(item.resolvedAt) : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
