import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Bell } from 'lucide-react';
import Link from 'next/link';

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function SettingsCards() {
  return (
    <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-[#111] p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:border-indigo-500/30 transition-all cursor-pointer group flex flex-col justify-between">
        <div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Security Settings
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Update your password and secure your account.
          </p>
        </div>
        <Link
          href="/employee/settings/security"
          className="w-full min-h-[48px] flex items-center justify-center rounded-xl border-2 border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold group-hover:bg-indigo-500/10 transition-all text-center"
        >
          Update Security
        </Link>
      </div>

      <div className="bg-white dark:bg-[#111] p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:border-amber-500/30 transition-all cursor-pointer group flex flex-col justify-between">
        <div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
            <Bell className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Notifications</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Manage how you receive updates and alerts.
          </p>
        </div>
        <Link
          href="/employee/settings/notifications"
          className="w-full min-h-[48px] flex items-center justify-center rounded-xl border-2 border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold group-hover:bg-amber-500/10 transition-all text-center"
        >
          Manage Preferences
        </Link>
      </div>
    </motion.div>
  );
}
