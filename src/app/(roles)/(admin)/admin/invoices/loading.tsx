import React from 'react';

export default function InvoicesLoading() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-100 dark:bg-gray-800/50 rounded w-96"></div>
        </div>
        <div className="h-11 w-36 bg-gray-200 dark:bg-[#161b22] rounded-2xl"></div>
      </div>

      {/* Summary Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white/80 dark:bg-[#111111]/80 border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-white/10" />
              <div className="w-16 h-5 rounded-md bg-gray-200 dark:bg-white/10" />
            </div>
            <div className="space-y-2">
              <div className="w-24 h-4 rounded bg-gray-200 dark:bg-white/10" />
              <div className="w-36 h-8 rounded bg-gray-300 dark:bg-white/20" />
            </div>
            <div className="w-28 h-3 rounded bg-gray-200 dark:bg-white/10" />
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#0d1117] border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#161b22] flex justify-between">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
          ))}
        </div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center"
          >
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
              <div className="h-3 bg-gray-100 dark:bg-gray-800/50 rounded w-24"></div>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-40"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
