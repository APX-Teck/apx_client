import React from 'react';
import Link from 'next/link';

export function PortalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 px-4 sm:px-6 md:px-8 border-t border-gray-200 dark:border-white/10 bg-transparent relative z-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center md:text-left">
          &copy; {currentYear} <span className="font-bold text-gray-900 dark:text-white">APXTeck</span>. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-gray-400">
          <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Support
          </Link>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
          <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Privacy
          </Link>
          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
          <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
