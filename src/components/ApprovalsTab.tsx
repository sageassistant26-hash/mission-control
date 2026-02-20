'use client';

import { CheckCircle } from 'lucide-react';

export function ApprovalsTab() {
  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Pending Approvals</h2>
          <p className="text-sm text-mc-text-secondary">Items Ember has ready for your review</p>
        </div>
        <span className="px-2 py-1 bg-mc-bg-tertiary text-mc-text-secondary text-xs rounded-full font-medium">
          0 pending
        </span>
      </div>

      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-mc-accent-green/10 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-mc-accent-green" />
        </div>
        <h3 className="font-medium mb-2">All clear</h3>
        <p className="text-mc-text-secondary text-sm max-w-xs">
          When Ember has code, copy, or decisions ready for your approval, they&apos;ll show up here.
        </p>
      </div>
    </div>
  );
}
