'use client';
import React from 'react';
import { Lock, Bell } from 'lucide-react';
import Link from 'next/link';

export function SettingsNavigation() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Link
        href="/customer/settings/security"
        className="bg-white dark:bg-[#111] p-4 sm:p-6 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:border-indigo-500/30 transition-all cursor-pointer group flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Security</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Update password</p>
          </div>
        </div>
      </Link>

      <Link
        href="/customer/settings/notifications"
        className="bg-white dark:bg-[#111] p-4 sm:p-6 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:border-amber-500/30 transition-all cursor-pointer group flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Notifications</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Email preferences</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
