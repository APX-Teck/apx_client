'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Monitor, ShieldAlert } from 'lucide-react';

export function NotificationsClient() {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const [preferences, setPreferences] = useState({
    emailNewUsers: true,
    emailPayments: true,
    emailSystemAlerts: true,
    pushNewRequests: true,
    pushMentions: true,
  });

  const togglePref = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${checked ? 'bg-amber-500' : 'bg-gray-200 dark:bg-white/10'}`}
    >
      <div
        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${checked ? 'translate-x-6' : 'translate-x-0'}`}
      />
    </button>
  );

  return (
    <motion.div variants={item} className="space-y-6">
      {/* System & Security Alerts */}
      <div className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-3xl border border-red-100 dark:border-red-500/10 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Critical Alerts</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02]">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">
                Security Breaches & Errors
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Cannot be disabled. You will always receive critical system alerts.
              </p>
            </div>
            <div className="text-red-500 text-sm font-bold bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-lg">
              Always On
            </div>
          </div>
        </div>
      </div>

      {/* Email Notifications */}
      <div className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Email Notifications</h3>
        </div>

        <div className="space-y-4">
          <div
            className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
            onClick={() => togglePref('emailNewUsers')}
          >
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">New User Signups</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive a daily digest of new customer registrations.
              </p>
            </div>
            <ToggleSwitch checked={preferences.emailNewUsers} onChange={() => {}} />
          </div>
          <div
            className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
            onClick={() => togglePref('emailPayments')}
          >
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">Payment Receipts</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get notified when high-value payments are completed.
              </p>
            </div>
            <ToggleSwitch checked={preferences.emailPayments} onChange={() => {}} />
          </div>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
            <Monitor className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">In-App Alerts</h3>
        </div>

        <div className="space-y-4">
          <div
            className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
            onClick={() => togglePref('pushNewRequests')}
          >
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">New Service Requests</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Immediate alerts when a customer submits a new request.
              </p>
            </div>
            <ToggleSwitch checked={preferences.pushNewRequests} onChange={() => {}} />
          </div>
          <div
            className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
            onClick={() => togglePref('pushMentions')}
          >
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">Team Mentions</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Notify me when an employee mentions me in notes.
              </p>
            </div>
            <ToggleSwitch checked={preferences.pushMentions} onChange={() => {}} />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="button"
          className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3 min-h-[48px] flex items-center justify-center rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all active:scale-[0.98]"
        >
          Save Preferences
        </button>
      </div>
    </motion.div>
  );
}
