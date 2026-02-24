'use client';

import { useEffect, useState, useMemo } from 'react';
import { FileText, RefreshCw, Search, FolderOpen, FolderClosed, ChevronRight, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Doc {
  name: string;
  path: string;
  content: string;
  section: string;
}

interface FolderNode {
  label: string;
  docs: Doc[];
  subfolders: Record<string, FolderNode>;
}

const SECTION_LABELS: Record<string, string> = {
  workspace: 'Workspace',
  projects: 'Projects',
  'ember-mentor-package': 'Ember Mentor Package',
};

function buildTree(docs: Doc[]): Record<string, FolderNode> {
  const tree: Record<string, FolderNode> = {};

  for (const doc of docs) {
    const section = doc.section;
    if (!tree[section]) {
      tree[section] = { label: SECTION_LABELS[section] || section, docs: [], subfolders: {} };
    }
    const node = tree[section];

    if (section === 'projects') {
      const parts = doc.name.split('/');
      if (parts.length > 1) {
        const folder = parts[0];
        if (!node.subfolders[folder]) {
          node.subfolders[folder] = { label: folder, docs: [], subfolders: {} };
        }
        node.subfolders[folder].docs.push(doc);
      } else {
        node.docs.push(doc);
      }
    } else {
      node.docs.push(doc);
    }
  }

  return tree;
}

function DocItem({ doc, selected, onSelect }: { doc: Doc; selected: boolean; onSelect: () => void }) {
  const displayName = doc.name.includes('/') ? doc.name.split('/').pop()! : doc.name;
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
        selected
          ? 'bg-mc-accent/20 text-mc-accent border border-mc-accent/30'
          : 'text-mc-text-secondary hover:bg-mc-bg-tertiary hover:text-mc-text'
      }`}
    >
      <FileText className="w-3 h-3 flex-shrink-0" />
      <span className="truncate">{displayName}</span>
    </button>
  );
}

function FolderGroup({
  label,
  docs,
  subfolders,
  selected,
  onSelect,
  defaultOpen,
}: {
  label: string;
  docs: Doc[];
  subfolders: Record<string, FolderNode>;
  selected: string | null;
  onSelect: (name: string) => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-mc-text-secondary hover:text-mc-text hover:bg-mc-bg-tertiary transition-colors flex items-center gap-1.5"
      >
        {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        {open ? <FolderOpen className="w-3.5 h-3.5" /> : <FolderClosed className="w-3.5 h-3.5" />}
        <span>{label}</span>
      </button>
      {open && (
        <div className="ml-2 mt-0.5 space-y-0.5">
          {docs.map((d) => (
            <DocItem key={d.name} doc={d} selected={selected === d.name} onSelect={() => onSelect(d.name)} />
          ))}
          {Object.entries(subfolders).map(([key, folder]) => (
            <FolderGroup
              key={key}
              label={folder.label}
              docs={folder.docs}
              subfolders={folder.subfolders}
              selected={selected}
              onSelect={onSelect}
              defaultOpen={false}
            />
          ))}
        </div>
      )}
    </div>
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
    return docs.filter((d) => d.name.toLowerCase().includes(q));
  }, [docs, search]);

  const tree = useMemo(() => buildTree(filtered), [filtered]);
  const active = docs.find((d) => d.name === selected);

  return (
    <div className="flex h-full gap-4">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-mc-text-secondary uppercase tracking-wider">Project Docs</span>
          <button onClick={load} className="text-mc-text-secondary hover:text-mc-text">
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-mc-text-secondary" />
          <input
            type="text"
            placeholder="Search docs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg bg-mc-bg border border-mc-border text-mc-text placeholder:text-mc-text-secondary focus:outline-none focus:border-mc-accent/50"
          />
        </div>

        {/* Doc list */}
        <div className="flex-1 overflow-y-auto space-y-1">
          {loading ? (
            <div className="text-mc-text-secondary text-sm px-2">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-mc-text-secondary text-sm px-2">{search ? 'No matches' : 'No docs yet'}</div>
          ) : (
            Object.entries(tree).map(([key, node]) => (
              <FolderGroup
                key={key}
                label={node.label}
                docs={node.docs}
                subfolders={node.subfolders}
                selected={selected}
                onSelect={setSelected}
                defaultOpen={true}
              />
            ))
          )}
        </div>
      </div>

      {/* Content pane */}
      <div className="flex-1 bg-mc-bg border border-mc-border rounded-xl overflow-auto p-6">
        {active ? (
          <>
            <h2 className="text-lg font-semibold mb-4">{active.name}</h2>
            <div className="prose prose-invert max-w-none">
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
