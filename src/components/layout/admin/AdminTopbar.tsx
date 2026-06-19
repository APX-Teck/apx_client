'use client';
import React from 'react';
import { Search, Menu, Home } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import GlobalSearch from './GlobalSearch';
import { useTopbarLogic } from './hooks/useTopbarLogic';
import NotificationBell from '@/components/NotificationBell';
import { UserProfileDropdown } from '@/components/UserProfileDropdown';

export default function AdminTopbar() {
  const {
    toggleMobileSidebar,
    user,
    mounted,
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    getPageTitle,
  } = useTopbarLogic();

  return (
    <header className="h-20 bg-transparent flex items-center justify-between px-2 sm:px-4 md:px-8 z-40">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 mr-2">
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight drop-shadow-sm truncate">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-5 shrink-0">
        <div className="flex items-center space-x-1 sm:space-x-3">
          <Link href="/" className="hidden sm:block">
            <button
              className="w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-xl bg-white dark:bg-[#1a1a1a] flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-[#222] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all border border-gray-100 dark:border-white/5 hover:border-indigo-500/30"
              title="Go to Public Home"
            >
              <Home size={16} />
              <span className="hidden sm:inline">Home</span>
            </button>
          </Link>

          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setIsGlobalSearchOpen(true);
              }}
              title="Search (Cmd+K)"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
                isGlobalSearchOpen
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/20 dark:border-indigo-500/30 dark:text-indigo-400'
                  : 'bg-white dark:bg-[#1a1a1a] border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#222]'
              } shadow-[0_2px_10px_rgba(0,0,0,0.02)]`}
            >
              <Search size={18} />
            </button>
          </div>

          <NotificationBell />
        </div>

        <UserProfileDropdown />
      </div>

      <GlobalSearch isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} />
    </header>
  );
}
