'use client';
import React from 'react';
import { Monitor } from 'lucide-react';
import { ToggleSwitch } from './ToggleSwitch';

interface PushPreferencesProps {
  preferences: any;
  togglePref: (key: any) => void;
}

export function PushPreferences({ preferences, togglePref }: PushPreferencesProps) {
  return (
    <div className="bg-white dark:bg-[#111] p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
          <Monitor className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">In-App Alerts</h3>
      </div>

      <div className="space-y-4">
        <div
          className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
          onClick={() => togglePref('pushAlerts')}
        >
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Important Alerts</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Urgent notifications regarding your account.
            </p>
          </div>
          <ToggleSwitch checked={preferences.pushAlerts} onChange={() => {}} />
        </div>
        <div
          className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
          onClick={() => togglePref('pushReminders')}
        >
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Reminders</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Helpful reminders for pending actions or payments.
            </p>
          </div>
          <ToggleSwitch checked={preferences.pushReminders} onChange={() => {}} />
        </div>
      </div>
    </div>
  );
}
