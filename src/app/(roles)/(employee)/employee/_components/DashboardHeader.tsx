import React from 'react';
import { Sparkles } from 'lucide-react';
import { User } from '@/providers/AuthProvider';

export function DashboardHeader({ user }: { user: any }) {
  return (
    <div className="bg-white dark:bg-[#111] p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-white/5 relative overflow-hidden shadow-sm">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
      <div className="space-y-2 relative z-10">
        <div className="flex items-center gap-2 text-indigo-500 font-semibold text-sm">
          <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span>Internal Employee Workspace</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Welcome back, {user?.fullName || 'Teammate'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl leading-relaxed">
          Stay updated with your assigned development tasks, manage your project reimbursements, or
          request updates from administrative managers.
        </p>
      </div>
    </div>
  );
}
