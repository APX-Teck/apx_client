'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Building } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

export default function CustomerSettingsPage() {
  const { user } = useAuth();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your profile, security, and notification preferences.</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div variants={item} className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-100 dark:border-white/5 pb-6">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Update your account details and public profile.</p>
          </div>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Full Name</label>
              <input 
                type="text" 
                defaultValue={user?.fullName || ''}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Email Address</label>
              <input 
                type="email" 
                defaultValue={user?.email || ''}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 opacity-70 cursor-not-allowed"
                disabled
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Phone Number</label>
              <input 
                type="tel" 
                defaultValue={user?.phone || ''}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Company (Optional)</label>
              <input 
                type="text" 
                placeholder="Company Name"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button type="button" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all">
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>

      {/* Other Settings Placeholder */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:border-indigo-500/30 transition-all cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">Security</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Update password</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:border-amber-500/30 transition-all cursor-pointer group flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">Notifications</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Email preferences</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
