import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Briefcase, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface ProfileFormProps {
  user: any;
  fullName: string;
  setFullName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  message: { type: 'success' | 'error'; text: string } | null;
}

export function ProfileForm({
  user,
  fullName,
  setFullName,
  phone,
  setPhone,
  handleSubmit,
  isSubmitting,
  message,
}: ProfileFormProps) {
  return (
    <motion.div
      variants={item}
      className="bg-white dark:bg-[#111] p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-6"
    >
      <div className="flex items-center gap-4 border-b border-gray-100 dark:border-white/5 pb-6">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Update your details and public profile.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" /> Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 min-h-[48px] bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-gray-900 dark:text-white"
              placeholder="Enter your full name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" /> Email Address
            </label>
            <input
              type="email"
              value={user?.email || ''}
              className="w-full px-4 py-3 min-h-[48px] bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-gray-500 cursor-not-allowed opacity-70"
              disabled
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" /> Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 min-h-[48px] bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-gray-900 dark:text-white"
              placeholder="Enter phone number"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-400" /> Role
            </label>
            <input
              type="text"
              value={user?.role || 'Employee'}
              className="w-full px-4 py-3 min-h-[48px] bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-gray-500 cursor-not-allowed opacity-70 capitalize"
              disabled
            />
          </div>
        </div>

        {message && (
          <div
            className={`p-3 rounded-xl flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <div className="pt-4 flex items-center justify-end gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3 min-h-[48px] rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Save Changes
          </button>
        </div>
      </form>
    </motion.div>
  );
}
