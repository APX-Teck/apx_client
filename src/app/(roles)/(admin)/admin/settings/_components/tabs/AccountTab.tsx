'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, Shield, Bell } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { ToastState } from '../SettingsManager';

interface Props {
  setToast: (toast: ToastState) => void;
}

export function AccountTab({ setToast }: Props) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-white/5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Account</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage your profile, security, and preferences.
        </p>
      </div>

      <div className="p-6 space-y-8 min-h-[400px]">
        {/* Profile Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 pb-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Personal Information
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update your details and public profile.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                defaultValue={user?.fullName || ''}
                className="w-full px-4 py-3 min-h-[48px] bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-gray-900 dark:text-white"
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                defaultValue={user?.email || ''}
                className="w-full px-4 py-3 min-h-[48px] bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-gray-500 cursor-not-allowed opacity-70"
                disabled
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                defaultValue={user?.phone || ''}
                className="w-full px-4 py-3 min-h-[48px] bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-gray-900 dark:text-white"
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Role</label>
              <input
                type="text"
                defaultValue={user?.role || 'Admin'}
                className="w-full px-4 py-3 min-h-[48px] bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-gray-500 cursor-not-allowed opacity-70 capitalize"
                disabled
              />
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setToast({ message: 'Profile updated successfully', type: 'success' })}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3 min-h-[48px] flex items-center justify-center rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all active:scale-[0.98]"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="w-full h-px bg-gray-100 dark:bg-white/5"></div>

        {/* Security & Notifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <Link
            href="/admin/settings/security"
            className="bg-gray-50 dark:bg-[#151515] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:border-indigo-500/30 transition-all cursor-pointer group flex flex-col justify-between h-[200px]"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Security</h4>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Update your password and secure your account.
              </p>
            </div>
            <div className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
              Change Password &rarr;
            </div>
          </Link>

          <Link
            href="/admin/settings/notifications"
            className="bg-gray-50 dark:bg-[#151515] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:border-amber-500/30 transition-all cursor-pointer group flex flex-col justify-between h-[200px]"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <Bell className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h4>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Manage how you receive updates and alerts.
              </p>
            </div>
            <div className="text-amber-600 dark:text-amber-400 font-bold text-sm mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
              Manage Preferences &rarr;
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
