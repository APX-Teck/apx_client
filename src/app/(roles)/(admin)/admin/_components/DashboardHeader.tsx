'use client';
import React from 'react';
import Link from 'next/link';
import { Plus, Users, FileText, Zap, LayoutDashboard } from 'lucide-react';

export function DashboardHeader() {
  return (
    <div className="flex flex-col xl:flex-row justify-between items-start gap-6 mb-2">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center border border-indigo-500/20 shadow-inner">
            <LayoutDashboard className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-indigo-300 dark:to-white">
            Admin Dashboard
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">
          Welcome back! Here is a summary of platform performance.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full xl:w-auto p-2 sm:p-2.5 bg-white/60 dark:bg-[#111111]/80 backdrop-blur-xl rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
        <div className="px-3 flex items-center gap-2 border-r border-gray-200 dark:border-white/10 hidden sm:flex">
          <Zap className="w-4 h-4 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Quick Actions</span>
        </div>
        <Link
          href="/admin/tasks/new"
          className="flex items-center justify-center min-h-[44px] min-w-[44px] gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" /> New Task
        </Link>
        <Link
          href="/admin/users"
          className="flex items-center justify-center min-h-[44px] min-w-[44px] gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 text-sm font-bold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Users className="w-4 h-4" /> Add User
        </Link>
        <Link
          href="/admin/blog"
          className="flex items-center justify-center min-h-[44px] min-w-[44px] gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 text-sm font-bold rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
        >
          <FileText className="w-4 h-4" /> Write Blog
        </Link>
      </div>
    </div>
  );
}
