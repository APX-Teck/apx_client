'use client';

import React from 'react';
import { Search, Menu, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useUiStore } from '@/store/uiStore';
import { useAuth } from '@/providers/AuthProvider';
import NotificationBell from '@/components/NotificationBell';

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

      <div className="flex items-center gap-3 relative z-10">
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-cyan-500 dark:text-gray-400 dark:hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight drop-shadow-sm flex items-center gap-2">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center space-x-4 md:space-x-5 relative z-10">
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

        <div className="flex items-center pl-4 md:pl-5 border-l border-gray-200 dark:border-white/10 cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-100 to-cyan-50 dark:from-cyan-500/20 dark:to-cyan-500/10 overflow-hidden border border-cyan-200 dark:border-cyan-500/30 shadow-inner flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all shrink-0">
              {user?.profilePhotoUrl ? (
                <img
                  src={user.profilePhotoUrl}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              ) : user?.fullName ? (
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=4f46e5&color=fff`}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold text-sm drop-shadow-sm">
                  US
                </div>
              )}
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                {user?.fullName || 'Loading...'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium capitalize">
                {user?.role?.replace(/_/g, ' ').toLowerCase() || 'Customer'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
