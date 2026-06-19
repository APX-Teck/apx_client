'use client';
import React from 'react';
import { Mail } from 'lucide-react';
import { ToggleSwitch } from './ToggleSwitch';

interface EmailPreferencesProps {
  preferences: any;
  togglePref: (key: any) => void;
}

export function EmailPreferences({ preferences, togglePref }: EmailPreferencesProps) {
  return (
    <div className="bg-white dark:bg-[#111] p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
          <Mail className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Email Notifications</h3>
      </div>

      <div className="space-y-4">
        <div
          className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
          onClick={() => togglePref('emailInvoices')}
        >
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Billing & Invoices</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Receive an email when a new invoice is generated.
            </p>
          </div>
          <ToggleSwitch checked={preferences.emailInvoices} onChange={() => {}} />
        </div>
        <div
          className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
          onClick={() => togglePref('emailServiceUpdates')}
        >
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Service Updates</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Get notified when there are updates to your active requests.
            </p>
          </div>
          <ToggleSwitch checked={preferences.emailServiceUpdates} onChange={() => {}} />
        </div>
        <div
          className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
          onClick={() => togglePref('emailMarketing')}
        >
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Promotions & News</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Occasional updates regarding new services and offers.
            </p>
          </div>
          <ToggleSwitch checked={preferences.emailMarketing} onChange={() => {}} />
        </div>
      </div>
    </div>
  );
}
