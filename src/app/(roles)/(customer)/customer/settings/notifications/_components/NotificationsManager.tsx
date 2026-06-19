'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { EmailPreferences } from './EmailPreferences';
import { PushPreferences } from './PushPreferences';
import { useNotificationsLogic } from '../_hooks/useNotificationsLogic';

export default function NotificationsManager() {
  const { preferences, togglePref, handleSave, isSaving, message } = useNotificationsLogic();

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 pt-4 pb-safe space-y-8"
    >
      <motion.div variants={item} className="flex items-center gap-4">
        <Link
          href="/customer/settings"
          className="p-2 rounded-xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 hover:border-cyan-500/30 text-gray-500 hover:text-cyan-500 transition-all flex items-center justify-center min-w-[44px] min-h-[48px]"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage how and when you receive alerts and updates.
          </p>
        </div>
      </motion.div>

      <motion.div variants={item} className="space-y-6">
        <EmailPreferences preferences={preferences} togglePref={togglePref} />
        <PushPreferences preferences={preferences} togglePref={togglePref} />

        {message && (
          <div
            className={`p-4 rounded-xl flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center min-h-[48px] gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Preferences
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
