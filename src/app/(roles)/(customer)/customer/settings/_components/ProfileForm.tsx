'use client';
import React from 'react';
import { User, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProfileFormProps {
  user: any;
  formData: any;
  handleInputChange: (field: string, value: string) => void;
  handleSave: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  message: { type: 'success' | 'error'; text: string } | null;
}

export function ProfileForm({
  user,
  formData,
  handleInputChange,
  handleSave,
  isSubmitting,
  message,
}: ProfileFormProps) {
  return (
    <div className="bg-white dark:bg-[#111] p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
      <div className="flex items-center gap-4 border-b border-gray-100 dark:border-white/5 pb-6">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Update your account details and public profile.
          </p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              required
              className="w-full px-4 py-3 min-h-[48px] bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-gray-900 dark:text-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              className="w-full px-4 py-3 min-h-[48px] bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all opacity-70 cursor-not-allowed text-gray-900 dark:text-white"
              disabled
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-3 min-h-[48px] bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {message && (
          <div
            className={`mt-4 p-3 rounded-xl flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}
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
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center min-h-[48px] gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
