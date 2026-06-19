'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Monitor, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useNotificationsLogic } from '../_hooks/useNotificationsLogic';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onChange();
    }}
    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${checked ? 'bg-amber-500' : 'bg-gray-200 dark:bg-white/10'}`}
  >
    <div
      className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${checked ? 'translate-x-6' : 'translate-x-0'}`}
    />
  </button>
);

export default function NotificationsManager() {
  const { preferences, togglePref, isSubmitting, successMessage, handleSave } =
    useNotificationsLogic();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-3xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={item} className="flex items-center gap-4">
        <Link
          href="/employee/settings"
          className="p-2 min-w-[44px] min-h-[48px] flex items-center justify-center rounded-xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 hover:border-cyan-500/30 text-gray-500 hover:text-cyan-500 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage how and when you receive alerts.
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={item} className="space-y-6">
        {/* Email Notifications */}
        <div className="bg-white dark:bg-[#111] p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Email Notifications</h3>
          </div>

          <div className="space-y-4">
            <div
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
              onClick={() => togglePref('emailTasks')}
            >
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Task Assignments</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive an email when a new task is assigned to you.
                </p>
              </div>
              <ToggleSwitch
                checked={preferences.emailTasks}
                onChange={() => togglePref('emailTasks')}
              />
            </div>
            <div
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
              onClick={() => togglePref('emailUpdates')}
            >
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Project Updates</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get notified when there are major changes to your projects.
                </p>
              </div>
              <ToggleSwitch
                checked={preferences.emailUpdates}
                onChange={() => togglePref('emailUpdates')}
              />
            </div>
            <div
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
              onClick={() => togglePref('emailMarketing')}
            >
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Company Announcements</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Occasional updates regarding company news and events.
                </p>
              </div>
              <ToggleSwitch
                checked={preferences.emailMarketing}
                onChange={() => togglePref('emailMarketing')}
              />
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-white dark:bg-[#111] p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Monitor className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">In-App Alerts</h3>
          </div>

          <div className="space-y-4">
            <div
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
              onClick={() => togglePref('pushTasks')}
            >
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Task Reminders</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Alerts for upcoming deadlines and urgent tasks.
                </p>
              </div>
              <ToggleSwitch
                checked={preferences.pushTasks}
                onChange={() => togglePref('pushTasks')}
              />
            </div>
            <div
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
              onClick={() => togglePref('pushMentions')}
            >
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Mentions</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Notify me when someone mentions me in a comment.
                </p>
              </div>
              <ToggleSwitch
                checked={preferences.pushMentions}
                onChange={() => togglePref('pushMentions')}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-4">
          {successMessage && (
            <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">
              <CheckCircle2 size={16} /> {successMessage}
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-3 min-h-[48px] rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Preferences
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
