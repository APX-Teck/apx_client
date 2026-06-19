'use client';

import React from 'react';
import { Search, Menu, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useUiStore } from '@/store/uiStore';
import { useAuth } from '@/providers/AuthProvider';
import NotificationBell from '@/components/NotificationBell';
import { UserProfileDropdown } from '@/components/UserProfileDropdown';

export default function CustomerTopbar() {
  const pathname = usePathname();
  const { toggleMobileSidebar } = useUiStore();
  const { user } = useAuth();

  const getPageTitle = () => {
    if (pathname === '/customer') return 'Overview';
    const pathParts = pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
  };

  return (
    <header className="h-20 bg-transparent flex items-center justify-between px-4 md:px-8 z-40 relative">
      {/* Subtle bottom border gradient for premium feel */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>

      <div className="flex items-center gap-2 sm:gap-3 min-w-0 mr-2 relative z-10">
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-gray-500 hover:text-cyan-500 dark:text-gray-400 dark:hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight drop-shadow-sm truncate">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center space-x-4 md:space-x-5 shrink-0 relative z-10">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link href="/" className="hidden sm:block">
            <button
              className="px-4 py-2 rounded-xl bg-white dark:bg-[#1a1a1a] flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-[#222] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all border border-gray-100 dark:border-white/5 hover:border-cyan-500/30"
              title="Go to Public Home"
            >
              <Home size={16} />
              <span className="hidden sm:inline">Home</span>
            </button>
          </Link>

          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <button className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1a1a] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-[#222] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all border border-gray-100 dark:border-white/5 hover:border-cyan-500/30">
            <Search size={18} />
          </button>

          <NotificationBell />
        </div>

        <UserProfileDropdown />
      </div>
    </header>
  );
}
