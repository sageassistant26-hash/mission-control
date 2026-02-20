'use client';

import { Plus, FileText } from 'lucide-react';

export function ContentTab() {
  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Marketing Content</h2>
          <p className="text-sm text-mc-text-secondary">Content pieces for Claw Mentor and Raise Formula</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-mc-accent text-mc-bg rounded-lg font-medium hover:bg-mc-accent/90 text-sm">
          <Plus className="w-4 h-4" />
          New Content
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-mc-bg-tertiary flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-mc-text-secondary" />
        </div>
        <h3 className="font-medium mb-2">No content pieces yet</h3>
        <p className="text-mc-text-secondary text-sm max-w-xs">
          Landing page copy, social posts, email sequences, and other marketing content will appear here.
        </p>
      </div>
    </div>
  );
}
