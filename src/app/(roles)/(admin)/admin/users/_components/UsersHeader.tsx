'use client';
import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export function UsersHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-indigo-300 dark:to-white">
          Users & Roles
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 sm:mt-2 text-sm sm:text-base">
          Manage system users, role assignments, and module access permissions.
        </p>
      </div>
      <Link
        href="/admin/users/create"
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
      >
        <Plus size={18} strokeWidth={3} />
        Add New User
      </Link>
    </div>
  );
}
