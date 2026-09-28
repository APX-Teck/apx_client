'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function InvoicesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Invoices Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-[#111111] rounded-3xl border border-red-100 dark:border-red-900/30 p-8 text-center max-w-7xl mx-auto mt-6">
      <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-100 dark:border-red-500/20">
        <AlertCircle className="text-red-500" size={32} />
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Failed to load invoices</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-6">
        {error.message || 'An unexpected error occurred while loading invoices. Please try again.'}
      </p>
      <button
        onClick={reset}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-sm"
      >
        <RefreshCw size={18} />
        Try Again
      </button>
    </div>
  );
}
