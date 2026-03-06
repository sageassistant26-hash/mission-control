'use client';

import { useEffect, useState, useMemo } from 'react';
import { FileText, RefreshCw, Search, ChevronRight, ChevronDown, Folder } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Doc {
  name: string;
  path: string;
  content: string;
  section?: string;
}

interface FolderNode {
  name: string;
  docs: Doc[];
  subfolders: Record<string, FolderNode>;
}

function buildTree(docs: Doc[]): Record<string, FolderNode> {
  const tree: Record<string, FolderNode> = {};

  for (const doc of docs) {
    const section = doc.section || 'other';
    const parts = doc.name.split('/');

    // Top-level section
    if (!tree[section]) {
      tree[section] = { name: section, docs: [], subfolders: {} };
    }

    if (parts.length === 1) {
      tree[section].docs.push(doc);
    } else {
      // Subfolder within section
      const subfolder = parts.slice(0, -1).join('/');
      if (!tree[section].subfolders[subfolder]) {
        tree[section].subfolders[subfolder] = { name: subfolder, docs: [], subfolders: {} };
      }
      tree[section].subfolders[subfolder].docs.push(doc);
    }
  }

  return tree;
}

const SECTION_LABELS: Record<string, string> = {
  'workspace': '📁 Workspace',
  'projects': '📂 Projects',
  'ember-mentor-package': '📦 Ember Mentor Package',
};

function FolderSection({
  label,
  node,
  selected,
  onSelect,
  defaultOpen = false,
}: {
  label: string;
  node: FolderNode;
  selected: string | null;
  onSelect: (name: string) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const totalDocs = node.docs.length + Object.values(node.subfolders).reduce((a, f) => a + f.docs.length, 0);

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold text-mc-text-secondary uppercase tracking-wider hover:bg-mc-bg-tertiary flex items-center gap-1.5 transition-colors"
      >
        {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        <span>{label}</span>
        <span className="text-mc-text-secondary/50 font-normal normal-case ml-auto">{totalDocs}</span>
      </button>

      {open && (
        <div className="ml-2 mt-0.5 space-y-0.5">
          {/* Direct docs in this section */}
          {node.docs.map(d => (
            <DocButton key={d.name} doc={d} selected={selected} onSelect={onSelect} />
          ))}

          {/* Subfolders */}
          {Object.entries(node.subfolders)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, sub]) => (
              <SubFolder key={key} folder={sub} selected={selected} onSelect={onSelect} />
            ))}
        </div>
      )}
    </div>
  );
}

function SubFolder({
  folder,
  selected,
  onSelect,
}: {
  folder: FolderNode;
  selected: string | null;
  onSelect: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-2 py-1 rounded text-sm text-mc-text-secondary hover:bg-mc-bg-tertiary flex items-center gap-1.5 transition-colors"
      >
        {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        <Folder className="w-3 h-3" />
        <span className="truncate">{folder.name}</span>
        <span className="text-mc-text-secondary/40 text-xs ml-auto">{folder.docs.length}</span>
      </button>
      {open && (
        <div className="ml-4 mt-0.5 space-y-0.5">
          {folder.docs.map(d => (
            <DocButton key={d.name} doc={d} selected={selected} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

function DocButton({
  doc,
  selected,
  onSelect,
}: {
  doc: Doc;
  selected: string | null;
  onSelect: (name: string) => void;
}) {
  const displayName = doc.name.split('/').pop() || doc.name;

  return (
    <button
      onClick={() => onSelect(doc.name)}
      title={doc.name}
      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
        selected === doc.name
          ? 'bg-mc-accent/20 text-mc-accent border border-mc-accent/30'
          : 'text-mc-text-secondary hover:bg-mc-bg-tertiary hover:text-mc-text'
      }`}
    >
      <FileText className="w-3 h-3 flex-shrink-0" />
      <span className="truncate">{displayName}</span>
    </button>
  );
}

export function DocsTab() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState('');

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

  const filtered = useMemo(() => {
    if (!search.trim()) return docs;
    const q = search.toLowerCase();
    return docs.filter(d =>
      d.name.toLowerCase().includes(q) || d.content.toLowerCase().includes(q)
    );
  }, [docs, search]);

  const tree = useMemo(() => buildTree(filtered), [filtered]);
  const active = docs.find(d => d.name === selected);

  const sectionOrder = ['workspace', 'projects', 'ember-mentor-package'];

  return (
    <div className="flex h-full gap-4">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-mc-text-secondary uppercase tracking-wider">Documents</span>
          <button onClick={load} className="text-mc-text-secondary hover:text-mc-text">
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-mc-text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search docs..."
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-mc-bg border border-mc-border rounded-lg text-mc-text placeholder:text-mc-text-secondary/50 focus:outline-none focus:border-mc-accent/50"
          />
        </div>

        {/* Doc tree */}
        <div className="flex-1 overflow-y-auto space-y-1">
          {loading ? (
            <div className="text-mc-text-secondary text-sm px-2">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-mc-text-secondary text-sm px-2">
              {search ? 'No matches' : 'No docs yet'}
            </div>
          ) : (
            sectionOrder
              .filter(s => tree[s])
              .map(s => (
                <FolderSection
                  key={s}
                  label={SECTION_LABELS[s] || s}
                  node={tree[s]}
                  selected={selected}
                  onSelect={setSelected}
                  defaultOpen={s === 'workspace'}
                />
              ))
          )}
          {/* Any sections not in sectionOrder */}
          {Object.keys(tree)
            .filter(s => !sectionOrder.includes(s))
            .map(s => (
              <FolderSection
                key={s}
                label={SECTION_LABELS[s] || s}
                node={tree[s]}
                selected={selected}
                onSelect={setSelected}
              />
            ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-mc-bg border border-mc-border rounded-xl overflow-auto p-6">
        {active ? (
          <>
            <h2 className="text-lg font-semibold mb-4">📄 {active.name}</h2>
            <div className="prose prose-invert prose-sm max-w-none
              prose-headings:text-mc-text prose-p:text-mc-text-secondary
              prose-a:text-mc-accent prose-strong:text-mc-text
              prose-code:text-mc-accent prose-code:bg-mc-bg-tertiary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-mc-bg-tertiary prose-pre:border prose-pre:border-mc-border
              prose-td:text-mc-text-secondary prose-th:text-mc-text
              prose-li:text-mc-text-secondary prose-blockquote:text-mc-text-secondary prose-blockquote:border-mc-accent/50">
              <ReactMarkdown>{active.content}</ReactMarkdown>
            </div>
          </>
        ) : (
          <div className="text-mc-text-secondary text-sm">Select a document</div>
        )}
      </div>
    </div>
  );
}
