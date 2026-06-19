import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { NotificationsClient } from './_components/NotificationsClient';

export default function AdminNotificationsSettingsPage() {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 pb-safe pb-12 px-4 sm:px-6 md:px-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/settings"
          className="p-2 min-w-[44px] min-h-[48px] flex items-center justify-center rounded-xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 hover:border-cyan-500/30 text-gray-500 hover:text-cyan-500 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage admin alerts and system notifications.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <NotificationsClient />
    </div>
  );
}
