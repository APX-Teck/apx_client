'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, KeyRound } from 'lucide-react';
import Link from 'next/link';

export function SecurityClient() {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    alert('Password change not implemented in this demo');
  };

  return (
    <motion.div
      variants={item}
      className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-8"
    >
      <div className="flex items-center gap-4 border-b border-gray-100 dark:border-white/5 pb-6">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
          <KeyRound className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ensure your new password is strong and unique.
          </p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="space-y-2 max-w-md">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-3 min-h-[48px] bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-gray-900 dark:text-white"
            placeholder="Enter current password"
            required
          />
        </div>

        <div className="space-y-2 max-w-md">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 min-h-[48px] bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-gray-900 dark:text-white"
            placeholder="Enter new password"
            required
          />
        </div>

        <div className="space-y-2 max-w-md">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 min-h-[48px] bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-gray-900 dark:text-white"
            placeholder="Confirm new password"
            required
          />
        </div>

        <div className="pt-4 flex items-center gap-4">
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-8 py-3 min-h-[48px] flex items-center justify-center rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all active:scale-[0.98]"
          >
            Update Password
          </button>
          <Link
            href="/admin/settings"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-bold px-4 py-3 min-h-[48px] flex items-center justify-center transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>

      <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-4 flex gap-3 mt-8">
        <Shield className="w-5 h-5 text-indigo-500 shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-indigo-700 dark:text-indigo-400">
            Admin Password Requirements
          </p>
          <ul className="text-xs text-indigo-600/80 dark:text-indigo-400/80 space-y-1 list-disc list-inside">
            <li>Minimum 12 characters long</li>
            <li>At least one uppercase and one lowercase letter</li>
            <li>At least one number and special character</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
