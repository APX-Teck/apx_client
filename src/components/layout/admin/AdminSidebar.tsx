'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu, PanelLeftClose, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarLogic } from './hooks/useSidebarLogic';

export default function AdminSidebar() {
  const {
    pathname,
    logout,
    mounted,
    isSidebarCollapsed,
    setSidebarCollapsed,
    isMobileSidebarOpen,
    setMobileSidebarOpen,
    filteredGroups,
  } = useSidebarLogic();

  if (!mounted) return null;

  const sidebarContent = (
    <>
      <div className="h-20 flex items-center justify-center border-b border-white/10 px-4 shrink-0">
        <AnimatePresence mode="wait">
          {!isSidebarCollapsed ? (
            <motion.div
              key="open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between w-full h-full"
            >
              <div className="flex-1 flex justify-center">
                <div className="relative w-32 h-8 drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                  <Image
                    src="/APX Teck - Final Logo -01.png"
                    alt="APXTeck Logo Light"
                    fill
                    className="object-contain dark:hidden"
                    priority
                  />
                  <Image
                    src="/APX Teck - Final Logo -03.png"
                    alt="APXTeck Logo Dark"
                    fill
                    className="object-contain hidden dark:block"
                    priority
                  />
                </div>
              </div>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="hidden md:flex w-8 h-8 rounded-lg items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0"
              >
                <PanelLeftClose size={18} />
              </button>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="md:hidden flex w-8 h-8 rounded-lg items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="closed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex items-center justify-center"
            >
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-[#39FF14] hover:bg-indigo-50 dark:hover:bg-[#39FF14]/10 border border-gray-200 dark:border-white/5 shadow-sm transition-all"
              >
                <Menu size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 custom-scrollbar">
        {filteredGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="mb-6 last:mb-0">
            {!isSidebarCollapsed && (
              <div className="text-[11px] font-bold text-gray-500 tracking-wider mb-3 px-3 transition-colors uppercase">
                {group.title}
              </div>
            )}
            <div className="space-y-1">
              {group.items.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (pathname.startsWith(link.href) && link.href !== '/admin');
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    title={isSidebarCollapsed ? link.name : undefined}
                    onClick={() => setMobileSidebarOpen(false)}
                  >
                    <div
                      className={cn(
                        'flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
                        isSidebarCollapsed ? 'justify-center' : 'justify-start',
                        isActive
                          ? 'bg-indigo-50 dark:bg-white/5 text-indigo-700 dark:text-white font-bold'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200 font-medium'
                      )}
                    >
                      <Icon
                        size={20}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={cn(
                          'shrink-0 transition-colors',
                          isActive
                            ? 'text-indigo-600 dark:text-[#39FF14]'
                            : 'text-gray-400 group-hover:text-gray-700 dark:text-gray-500 dark:group-hover:text-gray-300'
                        )}
                      />

                      <AnimatePresence mode="wait">
                        {!isSidebarCollapsed && (
                          <motion.span
                            key="label"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-3.5 text-[14px] whitespace-nowrap overflow-hidden text-ellipsis"
                          >
                            {link.name}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      <AnimatePresence mode="wait">
                        {isActive && !isSidebarCollapsed && (
                          <motion.div
                            key="indicator"
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            exit={{ opacity: 0, scaleY: 0 }}
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-orange-500 to-yellow-500 rounded-r-full"
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-white/10 shrink-0">
        <button
          onClick={() => {
            setMobileSidebarOpen(false);
            logout();
          }}
          title={isSidebarCollapsed ? 'Log out' : undefined}
          className={cn(
            'flex items-center w-full px-3 py-2.5 rounded-xl text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-bold transition-colors group relative',
            isSidebarCollapsed ? 'justify-center' : 'justify-start'
          )}
        >
          <LogOut
            size={20}
            strokeWidth={2.5}
            className="shrink-0 text-red-600 dark:text-red-500 transition-colors"
          />
          <AnimatePresence mode="wait">
            {!isSidebarCollapsed && (
              <motion.span
                key="logout-text"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-3.5 font-bold text-[14px] whitespace-nowrap overflow-hidden"
              >
                Log out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </>
  );

  return (
    <>
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 dark:bg-black/60 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-y-0 left-0 w-[260px] bg-white dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-white/10 flex flex-col z-50 shadow-2xl md:hidden overflow-hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex h-screen bg-white dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-white/10 flex-col sticky top-0 z-40 shadow-sm transition-colors duration-300 overflow-hidden shrink-0"
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
}
