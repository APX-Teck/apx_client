'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function ServicesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Services page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[url('/grid-bg.svg')] bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-red-100 dark:border-red-900/30 relative z-10">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Services</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          We encountered an error while trying to load the services page.
        </p>
        <div className="space-y-3">
          <button 
            onClick={() => reset()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
          >
            Try Again
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}
