'use client';

import dynamic from 'next/dynamic';

// Client-only: the editor restores its state from localStorage on first render.
const ProposalLetterEditor = dynamic(() => import('./ProposalLetterEditor'), {
  ssr: false,
  loading: () => (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-pulse">
      <div>
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-48 mb-2" />
        <div className="h-4 bg-gray-100 dark:bg-gray-800/50 rounded w-72" />
      </div>
      <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-white/5 h-[320px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    </div>
  ),
});

export function ProposalLetterEditorLoader() {
  return <ProposalLetterEditor />;
}
