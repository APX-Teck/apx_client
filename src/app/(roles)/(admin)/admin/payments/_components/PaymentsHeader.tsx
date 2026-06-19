import React from 'react';

interface Props {
  onOpenCreateLink: () => void;
}

export function PaymentsHeader({ onOpenCreateLink }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 mt-6">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-4 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-indigo-300 dark:to-white">
            Payments & Invoices
          </span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-3 font-medium text-base ml-1">
          Manage customer invoices, manually mark as paid, and track statuses.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95">
          Export CSV
        </button>
        <button
          onClick={onOpenCreateLink}
          className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white border border-transparent px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
        >
          Create Link
        </button>
      </div>
    </div>
  );
}
